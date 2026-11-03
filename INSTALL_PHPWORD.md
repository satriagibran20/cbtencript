# Instalasi PHPWord untuk Fitur Import Word

Fitur import soal dari Word document memerlukan library **PHPWord**. Berikut cara menginstallnya:

## Metode 1: Menggunakan Composer (Recommended)

1. Pastikan Composer sudah terinstall di sistem Anda
2. Buka terminal/command prompt di folder root project
3. Jalankan perintah:

```bash
composer require phpoffice/phpword
```

4. Pastikan file `vendor/autoload.php` sudah terbuat
5. Fitur import Word siap digunakan!

## Metode 2: Manual Install

Jika tidak menggunakan Composer, Anda bisa download library PHPWord secara manual:

1. Download PHPWord dari: https://github.com/PHPOffice/PHPWord/releases
2. Extract file ZIP
3. Copy folder `src` ke folder `vendor/phpoffice/phpword/` di project Anda
4. Pastikan autoloader sudah dikonfigurasi dengan benar

## Verifikasi Instalasi

Setelah install, pastikan library bisa digunakan dengan mengakses halaman import Word. Jika library belum terinstall, akan muncul pesan error yang meminta untuk install PHPWord.

## Format Word Document

Format yang didukung untuk import:

```
1. Apa ibukota Indonesia?
A. Jakarta
B. Bandung
C. Surabaya
D. Medan
E. Yogyakarta
Jawaban: A

2. Soal berikutnya...
A. Pilihan A
B. Pilihan B
C. Pilihan C
D. Pilihan D
E. Pilihan E
Kunci: B
```

**Catatan:**
- Nomor soal bisa menggunakan format "1." atau "Soal 1:"
- Pilihan jawaban menggunakan format "A." atau "A)"
- Jawaban benar ditulis "Jawaban: A" atau "Kunci: B"
- Gambar yang ada di dokumen akan otomatis diekstrak dan disimpan




