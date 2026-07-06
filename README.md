# IRGIkopi - Platform Pemesanan Kopi Arabika Nusantara

IRGIkopi adalah aplikasi web e-commerce *full-stack* modern yang dirancang khusus untuk menjelajahi, memilih, dan memesan biji kopi Arabika Nusantara berkualitas tinggi secara langsung. Aplikasi ini dilengkapi dengan **Coffee Sommelier AI** yang ditenagai oleh Google Gemini untuk memberikan rekomendasi kopi personal berdasarkan preferensi rasa pengguna, sistem checkout transaksi interaktif, manajemen dwi-bahasa (Indonesia & Inggris), serta **Admin Dashboard** untuk mengelola katalog produk, stok, dan memantau status pesanan pelanggan secara real-time.

---

## Panduan Menjalankan Aplikasi di Lokal (VSCode)

Ikuti langkah-langkah di bawah ini untuk mengunduh, mengatur, dan menjalankan aplikasi IRGIkopi di komputer lokal Anda menggunakan Visual Studio Code.

### 1. Prasyarat Sistem
Sebelum memulai, pastikan komputer Anda telah terinstal:
*   **Node.js** (Sangat disarankan versi LTS terbaru, minimal v18+)
*   **VSCode** (Visual Studio Code)

---

### 2. Langkah-Langkah Instalasi dan Konfigurasi

#### Langkah A: Buka Folder Proyek di VSCode
1. Ekstrak file zip aplikasi atau pastikan seluruh folder proyek hasil salinan dari AI Studio berada di komputer Anda.
2. Buka aplikasi **VSCode**.
3. Pilih menu **File** -> **Open Folder...** lalu pilih folder utama proyek `IRGIkopi` Anda.

#### Langkah B: Konfigurasi Environment Variables (`.env`)
Aplikasi memerlukan beberapa kunci konfigurasi (seperti API Key untuk asisten AI).
1. Di dalam folder utama proyek, cari file bernama **`.env.example`**.
2. Salin (*copy*) file tersebut dan ganti namanya menjadi **`.env`**.
3. Buka file **`.env`** yang baru dibuat, lalu isi variabel berikut:
   ```env
   # Masukkan API Key Gemini Anda di sini untuk mengaktifkan fitur asisten kopi AI
   GEMINI_API_KEY="ISI_DENGAN_GEMINI_API_KEY_ANDA"
   
   # Gunakan localhost untuk pengembangan di komputer lokal
   APP_URL="http://localhost:3000"
   ```
   *(Catatan: Anda dapat memperoleh API Key secara gratis melalui Google AI Studio).*

#### Langkah C: Instal Dependensi (*Packages*)
1. Buka terminal terintegrasi di VSCode dengan menekan tombol kombinasi ``Ctrl + ` `` (atau menu **Terminal** -> **New Terminal**).
2. Jalankan perintah di bawah ini untuk menginstal semua modul pendukung yang dibutuhkan aplikasi:
   ```bash
   npm install
   ```
3. Tunggu hingga proses instalasi selesai (ditandai dengan munculnya folder `node_modules`).

---

### 3. Cara Menjalankan Aplikasi

Karena aplikasi ini menggunakan arsitektur *full-stack* terpadu (Express.js sebagai backend server dan Vite + React sebagai frontend), Anda hanya perlu menjalankan satu perintah tunggal untuk mematangkan kedua sisi server tersebut secara bersamaan:

1. Di terminal VSCode Anda, jalankan perintah pengembangan berikut:
   ```bash
   npm run dev
   ```
2. Jika berhasil, Anda akan melihat teks konfirmasi di terminal seperti berikut:
   ```text
   Vite development middleware mounted successfully.
   Server IRGIkopi running at http://localhost:3000
   ```
3. Buka browser kesayangan Anda dan akses alamat:
   **`http://localhost:3000`**

---

## Solusi Mengatasi Error Umum saat Menjalankan di Lokal

### 1. Error: `EADDRINUSE: address already in use 0.0.0.0:3000`
Error ini berarti port `3000` di komputer Anda sedang digunakan oleh aplikasi lain (seperti proses Node.js yang lupa dimatikan sebelumnya, server local lainnya, atau backend terpisah).

**Cara Solusinya (Windows/PowerShell):**
1. Buka terminal VSCode (PowerShell) lalu jalankan perintah otomatis berikut untuk mematikan paksa aplikasi yang menggunakan port `3000`:
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
   ```
2. Atau cara alternatif tercepat dan termudah menggunakan paket pembantu `npx`:
   ```bash
   npx kill-port 3000
   ```
3. Setelah port dibebaskan, jalankan kembali perintah:
   ```bash
   npm run dev
   ```

---

### 2. Error: `Failed to resolve import "./assets/images/irgikopi_logo_1783331419657.jpg" from "src/App.tsx". Does the file exist?`
Error ini terjadi karena file gambar logo utama `irgikopi_logo_1783331419657.jpg` belum tersalin dengan benar atau struktur folder gambar terlewat ketika Anda mengunduh/menyalin kode ke komputer lokal.

**Cara Solusinya:**
1. Pastikan Anda telah membuat struktur folder berikut secara utuh di komputer Anda:
   📁 `src` -> 📁 `assets` -> 📁 `images`
2. Pastikan file gambar logo diletakkan di dalam folder `src/assets/images/` dengan nama yang tepat:
   `irgikopi_logo_1783331419657.jpg`
3. Jika Anda tidak memiliki file logo aslinya, Anda dapat mengambil gambar apa saja (format JPG/PNG), lalu ubah namanya menjadi `irgikopi_logo_1783331419657.jpg` dan tempatkan ke dalam folder `src/assets/images/` tersebut. Aplikasi akan otomatis mendeteksi dan berjalan normal kembali tanpa merusak tampilan.

---

## Skrip yang Tersedia

*   `npm install` - Mengunduh dan mengonfigurasi seluruh pustaka pendukung.
*   `npm run dev` - Menjalankan server backend Express dan frontend Vite secara lokal (Hot Reload aktif).
*   `npm run build` - Mengompilasi aplikasi React ke bentuk statis produksi serta mem-bundle backend CJS ke dalam folder `dist`.
*   `npm start` - Menjalankan server aplikasi siap produksi di lokal.
