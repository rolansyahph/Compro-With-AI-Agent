import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Mic, MicOff, Volume2, VolumeX, AlertCircle, Phone, PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToOpenRouter, type ChatMessage } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 500;

  // Speech recognition & synthesis refs
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);
  const isCallActiveRef = useRef(false);
  
  // Inactivity Timer Refs
  const silenceTimerRef = useRef<number>(Date.now());
  const hasWarnedRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  // Inactivity Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      silenceTimerRef.current = Date.now(); // Reset on start
      hasWarnedRef.current = false;
      
      interval = setInterval(() => {
        // If AI is speaking or thinking, reset timer
        if (isSpeakingRef.current || isTyping) {
           silenceTimerRef.current = Date.now();
           return;
        }
        
        const now = Date.now();
        const diff = now - silenceTimerRef.current;
        
        if (diff > 10000 && hasWarnedRef.current) {
           // 10 seconds passed total (approx 5s after warning)
           endCall();
        } else if (diff > 5000 && !hasWarnedRef.current) {
           hasWarnedRef.current = true;
           speak("Apakah masih ada yang dapat saya bantu atau anda tanyakan?");
           // Note: speak() triggers isSpeakingRef=true, which will reset silenceTimerRef in next tick.
           // This effectively restarts the 5s timer for the final cutoff.
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, isTyping]); // Re-run if these change, though refs handle mutable state

  // Auto-recording logic for Call Mode
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isCallActive && !isRecording && !isSpeakingRef.current && !isTyping) {
       // Add a small delay to ensure natural turn-taking
       timeout = setTimeout(() => {
         if (isCallActiveRef.current && !isRecording && !isSpeakingRef.current) {
           startRecording();
         }
       }, 500);
    }

    return () => clearTimeout(timeout);
  }, [isCallActive, isRecording, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isCallActive) {
      scrollToBottom();
    }
  }, [messages, isCallActive]);

  useEffect(() => {
    return () => {
      stopSpeech();
      stopRecording();
    };
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    // Always speak in call mode, otherwise respect isVoiceEnabled
    if (!isVoiceEnabled && !isCallActiveRef.current) return;
    if (!('speechSynthesis' in window)) return;

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.onstart = () => {
      isSpeakingRef.current = true;
      silenceTimerRef.current = Date.now(); // Reset timer on speak start
    };
    utterance.onend = () => {
      isSpeakingRef.current = false;
      silenceTimerRef.current = Date.now(); // Reset timer on speak end
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    isSpeakingRef.current = false;
  };

  const getSpeechRecognition = (): any => {
    const win = window as any;
    return win.SpeechRecognition || win.webkitSpeechRecognition || null;
  };

  const startRecording = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'id-ID';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        // User is speaking, reset inactivity timer
        silenceTimerRef.current = Date.now();
        hasWarnedRef.current = false;

        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        // Only update input value if NOT in call mode
        if (!isCallActiveRef.current) {
          setInputValue(finalTranscript + interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error || 'unknown');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
        
        if (finalTranscript.trim()) {
          handleSendMessage(finalTranscript.trim());
        }
      };

      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsRecording(false);
      recognitionRef.current = null;
    }
  };

  const stopRecording = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSendMessage = async (text?: string) => {
    const content = (typeof text === 'string' ? text : inputValue).trim();
    if (!content) return;
    
    // Reset inactivity timer on user message
    silenceTimerRef.current = Date.now();
    hasWarnedRef.current = false;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      timestamp: new Date()
    };

    if (!isCallActiveRef.current) {
      setInputValue('');
    }
    
    stopRecording();
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const contextMessages: ChatMessage[] = [
        ...messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant' as const,
          content: m.text
        })),
        { role: 'user', content: content }
      ];

      const responseText = await sendMessageToOpenRouter(contextMessages);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      speak(responseText, () => {
        // Callback handled by useEffect watching states
      });
      
    } catch (err: any) {
      console.error('Failed to get AI response:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${err.message || "Connection failed"}. Please check API Key.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
      
      if (isCallActiveRef.current) {
          speak("Sorry, I encountered an error.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startCall = () => {
    setIsOpen(true);
    setIsCallActive(true);
    setIsVoiceEnabled(true);
    setError(null);
    silenceTimerRef.current = Date.now();
    hasWarnedRef.current = false;
  };

  const endCall = () => {
    setIsCallActive(false);
    stopRecording();
    stopSpeech();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
        setIsCallActive(false); // Reset call mode when closing
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className={`${isCallActive ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4 flex items-center justify-between transition-colors duration-300`}>
              <div className="flex items-center space-x-2">
                {isCallActive ? <Phone className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                <span className="font-medium">{isCallActive ? 'Live Call' : 'AI Assistant'}</span>
              </div>
              <div className="flex items-center space-x-2">
                {!isCallActive && (
                  <button
                    onClick={() => setIsVoiceEnabled((v) => { if (v) stopSpeech(); return !v; })}
                    className="mr-2 text-white/90 hover:text-white focus:outline-none"
                    aria-label={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
                  >
                    {isVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 text-xs flex items-center border-b border-red-100">
                <AlertCircle className="h-3 w-3 mr-2" />
                {error}
              </div>
            )}

            {isCallActive ? (
              // CALL UI
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative">
                 <div className="relative mb-8">
                    <div className={`w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center z-10 relative ${isSpeakingRef.current ? 'animate-pulse' : ''}`}>
                       <Bot className="w-12 h-12 text-white" />
                    </div>
                    {/* Ripple animation when recording */}
                    {isRecording && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                        <div className="absolute -inset-4 rounded-full bg-blue-500 opacity-10 animate-pulse delay-75"></div>
                      </>
                    )}
                 </div>
                 
                 <div className="text-center space-y-2 mb-8 h-16">
                    <h3 className="text-xl font-semibold">
                      {isSpeakingRef.current ? "Speaking..." : isRecording ? "Listening..." : "Thinking..."}
                    </h3>
                    <p className="text-blue-300 text-sm px-4">
                       {isRecording ? "Go ahead, I'm listening." : "Please wait a moment."}
                    </p>
                 </div>

                 <button 
                   onClick={endCall}
                   className="bg-red-500 p-4 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110 active:scale-95"
                 >
                    <PhoneOff className="w-8 h-8 text-white" />
                 </button>
              </div>
            ) : (
              // CHAT UI
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.isError 
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.sender === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 items-center">
                    <div className="relative flex-1">
                        <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) {
                                setInputValue(e.target.value);
                                if (error) setError(null);
                            }
                        }}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                        placeholder={isTyping ? "AI is typing..." : "Type your message..."}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
                        />
                        <span className="absolute right-2 bottom-2 text-[10px] text-gray-400">
                            {inputValue.length}/{MAX_CHARS}
                        </span>
                    </div>
                    <button
                      onClick={() => isRecording ? stopRecording() : startRecording()}
                      disabled={isTyping}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 flex flex-row items-end space-x-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startCall}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
            title="Start AI Call"
          >
            <Phone className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
            title="Open Chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
      </div>
    </>
  );
};

export default LiveChat;
