export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'AI Project';

export const sendMessageToOpenRouter = async (messages: ChatMessage[], model: string = 'openai/gpt-3.5-turbo') => {
  if (!API_KEY) {
    throw new Error('OpenRouter API Key is missing. Please check your .env configuration.');
  }

  try {
    console.log('Sending request to OpenRouter with model:', model);
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter Response received');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};
