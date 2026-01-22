# Dokumentasi Integrasi AI Chat (Open Router)

Dokumen ini menjelaskan cara mengatur dan menggunakan fitur chat AI yang telah diintegrasikan ke dalam project ini.

## 1. Setup API Key

Project ini menggunakan **OpenRouter** sebagai gateway untuk mengakses berbagai model LLM (Large Language Models) seperti GPT-3.5, Claude, Llama, dll.

### Langkah-langkah:

1.  Daftar akun di [OpenRouter.ai](https://openrouter.ai/).
2.  Masuk ke dashboard dan buat API Key baru.
3.  Salin file `.env.example` menjadi `.env` di root project:
    ```bash
    cp .env.example .env
    ```
    *(Atau buat file baru bernama `.env`)*
4.  Isi variabel `VITE_OPENROUTER_API_KEY` dengan API key Anda:
    ```env
    VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
    VITE_SITE_URL=http://localhost:5173
    VITE_SITE_NAME=My AI Project
    ```

> **PENTING:** Jangan pernah commit file `.env` ke repository publik (git). File `.env` sudah dimasukkan ke dalam `.gitignore`.

## 2. Konfigurasi Model

Saat ini, konfigurasi model diatur di file `src/services/aiService.ts`.

```typescript
// src/services/aiService.ts
export const sendMessageToOpenRouter = async (messages: ChatMessage[], model: string = 'openai/gpt-3.5-turbo') => {
  // ...
}
```

Model default yang digunakan adalah `openai/gpt-3.5-turbo`. Anda dapat mengubahnya dengan:
1.  Mengubah nilai default di parameter fungsi.
2.  Mengirimkan parameter `model` saat memanggil fungsi `sendMessageToOpenRouter`.

Daftar model yang tersedia dapat dilihat di [OpenRouter Docs](https://openrouter.ai/docs#models).

## 3. Struktur Request & Response

### Request
Fungsi `sendMessageToOpenRouter` menerima array pesan dengan format:

```typescript
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string; // Isi pesan
}
```

### Response
Fungsi mengembalikan `Promise<string>` yang berisi teks balasan dari AI.

## 4. Error Handling

Fitur chat telah dilengkapi dengan error handling:
- **UI:** Menampilkan pesan error berwarna merah di dalam chat bubble dan alert di atas chat jika terjadi kegagalan koneksi.
- **Console:** Log error detail untuk debugging.
- **Skenario yang ditangani:**
  - API Key tidak ditemukan/salah.
  - Koneksi internet terputus.
  - API OpenRouter down atau rate limit.

## 5. Fitur Tambahan
- **Loading State:** Indikator "Typing..." saat menunggu balasan.
- **Character Limit:** Input dibatasi maksimal 500 karakter untuk mencegah penyalahgunaan token.
- **Voice Support:** Integrasi dengan Web Speech API (bawaan browser) tetap dipertahankan.
