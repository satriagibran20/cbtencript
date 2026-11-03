# Dukungan Rumus Matematika dan Tulisan Arab di Import Word

## Fitur yang Didukung

### 1. Rumus Matematika
- **Format**: Rumus matematika yang dibuat menggunakan Microsoft Word Equation Editor
- **Ekstraksi**: Rumus diekstrak sebagai MathML (Mathematical Markup Language)
- **Rendering**: 
  - Browser modern dapat merender MathML secara native
  - Untuk browser yang tidak support, dapat menggunakan MathJax (opsional)
- **Format Output**: `<math xmlns="http://www.w3.org/1998/Math/MathML">...</math>`

### 2. Tulisan Arab
- **Deteksi Otomatis**: Sistem otomatis mendeteksi karakter Arab
- **RTL Support**: Teks Arab otomatis diberi atribut `dir="rtl"` dan `lang="ar"`
- **Encoding**: UTF-8 untuk mendukung semua karakter Unicode
- **Format Output**: `<span dir="rtl" lang="ar">...</span>`

### 3. Formatting HTML
- **Bold**: `<strong>...</strong>`
- **Italic**: `<em>...</em>`
- **Underline**: `<u>...</u>`
- **Subscript**: `<sub>...</sub>`
- **Superscript**: `<sup>...</sup>`

## Cara Penggunaan

### 1. Membuat Soal dengan Rumus Matematika
1. Buka Microsoft Word
2. Buat soal seperti biasa
3. Untuk rumus matematika, gunakan **Insert > Equation** atau tekan `Alt + =`
4. Tulis rumus matematika
5. Simpan sebagai .docx
6. Import ke sistem

### 2. Membuat Soal dengan Tulisan Arab
1. Buka Microsoft Word
2. Aktifkan keyboard Arabic atau copy-paste teks Arab
3. Tulis soal dengan tulisan Arab
4. Simpan sebagai .docx
5. Import ke sistem
6. Sistem akan otomatis mendeteksi dan menambahkan atribut RTL

### 3. Kombinasi Rumus dan Arab
- Bisa menggunakan rumus matematika dan tulisan Arab dalam satu soal
- Sistem akan mempertahankan keduanya

## Catatan Penting

### Database
- Pastikan database menggunakan charset `utf8mb4` untuk mendukung karakter Arab dan simbol matematika
- Kolom `soal`, `a`, `b`, `c`, `d`, `e` harus menggunakan charset `utf8mb4`

### Browser Support
- **MathML**: Browser modern (Chrome, Firefox, Safari, Edge) support MathML
- **Arabic RTL**: Semua browser modern support RTL text
- **Fallback**: Jika MathML tidak ter-render, akan ditampilkan sebagai "[Rumus Matematika]"

### Library Requirements
- **PhpOffice\PhpWord**: Untuk membaca file Word
- **PhpOffice\Math**: Untuk mengekstrak rumus matematika (opsional, akan fallback jika tidak tersedia)

## Troubleshooting

### Rumus Matematika Tidak Tampil
1. Pastikan rumus dibuat menggunakan Word Equation Editor (bukan gambar)
2. Pastikan file Word disimpan sebagai .docx (bukan .doc)
3. Jika masih tidak tampil, cek apakah browser support MathML

### Tulisan Arab Tidak RTL
1. Pastikan database menggunakan charset utf8mb4
2. Pastikan kolom database menggunakan collation utf8mb4_unicode_ci
3. Cek apakah karakter Arab benar-benar terdeteksi (bukan karakter lain yang mirip)

### Formatting Hilang
1. Pastikan menggunakan .docx format (bukan .doc)
2. Pastikan formatting dibuat langsung di Word (bukan copy-paste dari aplikasi lain)
3. Cek apakah HTML ter-render dengan benar di browser

## Contoh Format Word Document

```
1. Hitunglah nilai dari persamaan berikut:
   x² + 2x + 1 = 0
   [Gunakan Equation Editor untuk x²]

A. x = -1
B. x = 1
C. x = 0
D. x = 2
Jawaban: A

2. اكتب الجملة التالية بالعربية:
   [Tulisan Arab akan otomatis di-detect dan diberi RTL]

A. Benar
B. Salah
Jawaban: A
```

## Implementasi Teknis

### Ekstraksi HTML
- Fungsi `extractHtmlFromElement()` mengekstrak konten dengan formatting HTML
- Mapping antara plain text dan HTML version untuk parsing
- HTML version digunakan saat menyimpan ke database

### Deteksi Arabic
- Menggunakan regex pattern untuk mendeteksi karakter Unicode Arabic
- Range: `\x{0600}-\x{06FF}` (Arabic), `\x{0750}-\x{077F}` (Arabic Supplement), dll

### MathML Extraction
- Mencoba menggunakan `MathML` writer terlebih dahulu
- Fallback ke `OfficeMathML` writer jika MathML tidak tersedia
- Jika keduanya gagal, menggunakan placeholder
