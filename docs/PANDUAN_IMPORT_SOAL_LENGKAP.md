# Panduan Lengkap Import Soal

Panduan ini menjelaskan cara import soal untuk semua tipe soal yang didukung.

## Tipe Soal yang Didukung

1. **PG (Pilihan Ganda)** - Soal dengan satu jawaban benar
2. **PG Kompleks** - Soal dengan lebih dari satu jawaban benar
3. **Benar Salah** - Soal dengan 2 pilihan: Benar atau Salah
4. **Esai** - Soal uraian yang dinilai manual
5. **Menjodohkan** - Soal dengan pasangan item kiri dan kanan

---

## Format Import CSV/TXT

### Struktur Kolom

```
tipe_soal,soal,pilihan_a,pilihan_b,pilihan_c,pilihan_d,pilihan_e,jawaban_benar,poin_esai,kelas,bobot
```

Kolom `bobot` adalah kolom terakhir dan **opsional**. Lihat bagian [Bobot Custom](#bobot-custom) di bawah.

### 1. Soal Pilihan Ganda (PG)

**Format:**
```
pg,"Pertanyaan soal","Pilihan A","Pilihan B","Pilihan C","Pilihan D","Pilihan E",a,,kelas,
```

**Contoh:**
```
pg,"Apa ibukota Indonesia?","Jakarta","Bandung","Surabaya","Medan","Yogyakarta",a,,12-RPL
```

**Ketentuan:**
- `tipe_soal`: Harus `pg`
- `pilihan_a` sampai `pilihan_e`: Wajib diisi
- `jawaban_benar`: Satu huruf (a, b, c, d, atau e)
- `poin_esai`: Dikosongkan
- `kelas`: Opsional

---

### 2. Soal Pilihan Ganda Kompleks (PG Kompleks)

**Format:**
```
pg_kompleks,"Pertanyaan soal","Pilihan A","Pilihan B","Pilihan C","Pilihan D","Pilihan E","a,b,c",,kelas,
```

**Contoh:**
```
pg_kompleks,"Pilih jawaban yang benar (bisa lebih dari satu):","Pilihan A benar","Pilihan B benar","Pilihan C salah","Pilihan D benar","Pilihan E salah","a,b,d",,12-RPL
```

**Ketentuan:**
- `tipe_soal`: Harus `pg_kompleks`
- `pilihan_a` sampai `pilihan_e`: Wajib diisi
- `jawaban_benar`: Multiple answers dipisahkan koma (contoh: `a,b,c` atau `a,b` atau `a,b,c,d`)
- `poin_esai`: Dikosongkan
- `kelas`: Opsional

**Catatan:** Peserta bisa memilih lebih dari satu jawaban. Semua jawaban yang dipilih harus sama persis dengan jawaban benar (urutan tidak penting).

---

### 3. Soal Benar Salah

**Format:**
```
benar_salah,"Pernyataan",,,,,,"a",,kelas,
```

**Contoh:**
```
benar_salah,"Jakarta adalah ibukota Indonesia",,,,,,a,,12-RPL
benar_salah,"Bandung adalah ibukota Indonesia",,,,,,b,,12-RPL
```

**Ketentuan:**
- `tipe_soal`: Harus `benar_salah`
- `soal`: Pernyataan yang akan dinilai benar atau salah
- `pilihan_a` sampai `pilihan_e`: Dikosongkan (akan otomatis diisi "Benar" dan "Salah")
- `jawaban_benar`: 
  - `a` = Benar
  - `b` = Salah
- `poin_esai`: Dikosongkan
- `kelas`: Opsional

**Catatan:** Sistem akan otomatis membuat pilihan A = "Benar" dan pilihan B = "Salah".

---

### 4. Soal Esai

**Format:**
```
esai,"Pertanyaan soal",,,,,,,10,kelas,bobot
```

**Contoh:**
```
esai,"Jelaskan perbedaan HTML dan CSS!",,,,,,,10,12-RPL,
esai,"Apa yang dimaksud dengan algoritma? Berikan contohnya!",,,,,,,15,12-RPL,5
```

**Ketentuan:**
- `tipe_soal`: Harus `esai`
- `soal`: Pertanyaan uraian
- `pilihan_a` sampai `pilihan_e`: Dikosongkan
- `jawaban_benar`: Dikosongkan
- `poin_esai`: Angka 1-100 (poin maksimal)
- `kelas`: Opsional

---

## Bobot Custom

Setiap soal punya bobot. Ada dua cara pengisiannya:

1. **Otomatis (default)** â€” kosongkan kolom `bobot`. Sistem memakai 100 Ã· jumlah soal pada mapel
   tersebut (contoh: 8 soal â†’ masing-masing 12.5).
2. **Custom** â€” isi kolom `bobot` dengan angka **0-100**. Soal itu memakai nilainya sendiri dan
   tidak ikut dihitung ulang saat soal ditambah/dihapus. Di daftar soal tampil label `(custom)`.

Soal custom dan otomatis bisa dicampur dalam satu file:

```
pg,"Soal tanpa bobot custom",...,a,,12-RPL,        â† otomatis
pg,"Soal dengan bobot custom",...,b,,12-RPL,2.5    â† custom 2.5
```

**Ketentuan:**
- Desimal boleh pakai titik atau koma (`2.5` atau `2,5`).
- Nilai di luar 0-100 ditolak; soal tetap diimport dengan bobot otomatis dan muncul peringatan.
- Total bobot tidak dinormalisasi otomatis ke 100, jadi hitung manual kalau ingin totalnya pas.
- Baris `benar_salah` boleh memakai format ringkas lama (`benar_salah,soal,jawaban,kelas`), tetapi
  untuk mengisi bobot gunakan format 11 kolom penuh.

---

## Format Import Word Document

> **Template siap pakai:** unduh `assets/templates/template_import_soal.docx` dari halaman
> Import Soal (Word), isi soalnya, lalu upload. Template sudah berisi contoh semua tipe soal.

### Format Umum

```
1. Pertanyaan soal?
A. Pilihan A
B. Pilihan B
C. Pilihan C
D. Pilihan D
E. Pilihan E
Jawaban: A
```

**Bobot custom** (opsional) â€” tambahkan baris `Bobot: 2.5` di dalam soal. Tanpa baris ini,
soal memakai bobot otomatis (100 dibagi jumlah soal). Nilai yang diterima 0-100.

```
2. Hasil dari 2 + 3 x 4 adalah ...
A. 20
B. 14
C. 24
D. 10
E. 9
Jawaban: B
Tipe: pg
Bobot: 2.5
```

**Rumus matematika** â€” tulis memakai **Insert > Equation** di Word, jangan diketik manual
(seperti "akar 2" atau "1/2"). Importir mengubah persamaan Word (OMML) menjadi LaTeX, lalu
aplikasi merendernya dengan KaTeX. Yang didukung: pecahan, akar (termasuk akar pangkat),
pangkat/subskrip, sigma & integral, kurung, matriks, serta fungsi seperti sin, cos, log.

Contoh hasil konversi:

| Di Word (Equation) | Tersimpan sebagai | Tampil sebagai |
| --- | --- | --- |
| akar dari 1/2 | `$\sqrt{\frac{1}{2}}$` | âˆš(1â„2) |
| akar pangkat 3 dari 8 | `$\sqrt[3]{8}$` | âˆ›8 |
| x kuadrat | `$x^{2}$` | xÂ² |
| sigma i=1 sampai n | `$\sum_{i=1}^{n} i$` | Î£ |

### 1. Soal Pilihan Ganda (PG)

```
1. Apa ibukota Indonesia?
A. Jakarta
B. Bandung
C. Surabaya
D. Medan
E. Yogyakarta
Jawaban: A
```

### 2. Soal Pilihan Ganda Kompleks

```
2. Pilih jawaban yang benar (bisa lebih dari satu):
A. Pilihan A benar
B. Pilihan B benar
C. Pilihan C salah
D. Pilihan D benar
E. Pilihan E salah
Tipe: pg_kompleks
Jawaban: A,B,D
```

**Catatan:** 
- Tambahkan `Tipe: pg_kompleks` sebelum atau setelah pilihan
- Jawaban dipisahkan koma: `A,B,D` atau `a,b,d`

### 3. Soal Benar Salah

```
3. Jakarta adalah ibukota Indonesia
Tipe: benar_salah
Jawaban: A
```

**Catatan:**
- Tambahkan `Tipe: benar_salah`
- Jawaban: `A` = Benar, `B` = Salah
- Tidak perlu menulis pilihan A dan B (otomatis)

### 4. Soal Esai

```
4. Jelaskan perbedaan HTML dan CSS!
Tipe: esai
```

**Catatan:**
- Tambahkan `Tipe: esai`
- Tidak perlu pilihan dan jawaban

### 5. Soal Menjodohkan

```
4. Pasangkan item di kolom kiri dengan kolom kanan!
Tipe: menjodohkan

A. Item kiri 1
B. Item kiri 2
C. Item kiri 3
D. Item kiri 4

1) Item kanan 1
2) Item kanan 2
3) Item kanan 3
4) Item kanan 4

Jawaban: a-1,b-2,c-3,d-4
```

**Catatan:**
- Tambahkan `Tipe: menjodohkan`
- **Item kiri**: Gunakan format "A.", "B.", "C.", dst (huruf)
- **Item kanan**: Gunakan format "1)", "2)", "3)", dst (angka + kurung tutup). Jangan pakai titik ("1.") karena akan dianggap soal baru.
- **Pairing**: Format "a-1,b-2,c-3" (huruf-angka, dipisahkan koma)
- Jumlah item kiri dan kanan bisa berbeda (tidak harus sama)
- Bisa menggunakan lebih dari 5 item (A-Z, kemudian AA, AB, dst)
- Format pairing bisa menggunakan huruf besar atau kecil: "A-1,B-2" atau "a-1,b-2"

**Contoh alternatif:**
```
Soal 5: Pasangkan dengan benar!
Tipe: menjodohkan

A) Ibukota Indonesia
B) Ibukota Malaysia
C) Ibukota Thailand

1) Jakarta
2) Kuala Lumpur
3) Bangkok

Pairing: A-1,B-2,C-3
```

---

## Tips Import

1. **Gunakan tanda kutip ganda** untuk teks yang mengandung koma
2. **Gambar otomatis diekstrak** dari Word document
3. **Urutan kolom harus sesuai** dengan format yang ditentukan
4. **Validasi otomatis** akan memeriksa kelengkapan data
5. **Error akan ditampilkan** jika ada data yang tidak valid

---

## Contoh File CSV Lengkap

```csv
tipe_soal,soal,pilihan_a,pilihan_b,pilihan_c,pilihan_d,pilihan_e,jawaban_benar,poin_esai,kelas,bobot
pg,"Apa ibukota Indonesia?","Jakarta","Bandung","Surabaya","Medan","Yogyakarta",a,,12-RPL,
pg,"Hasil dari 2 + 3 x 4 adalah ...","20","14","24","10","9",b,,12-RPL,2.5
pg_kompleks,"Pilih yang benar:","A benar","B benar","C salah","D benar","E salah","a,b,d",,12-RPL,
benar_salah,"Jakarta adalah ibukota Indonesia",,,,,,a,,12-RPL,
benar_salah,"Bandung adalah ibukota Indonesia",,,,,,b,,12-RPL,1.5
esai,"Jelaskan algoritma!",,,,,,,10,12-RPL,
esai,"Sebutkan 3 contoh tag HTML!",,,,,,,15,12-RPL,5
```

Contoh di atas: 3 soal memakai bobot custom (2.5, 1.5, 5), sisanya otomatis.

---

## Troubleshooting

### Error: "Tipe soal harus 'pg', 'pg_kompleks', 'benar_salah', atau 'esai'"
- Pastikan tipe_soal ditulis dengan benar (huruf kecil)
- Tidak ada spasi di awal atau akhir

### Error: "Jawaban harus a, b, c, d, atau e"
- Untuk PG: gunakan satu huruf (a/b/c/d/e)
- Untuk PG Kompleks: pisahkan dengan koma (a,b,c)
- Untuk Benar Salah: gunakan a (Benar) atau b (Salah)

### Error: "Pilihan jawaban tidak lengkap"
- Pastikan pilihan A, B, C, D diisi (E opsional untuk PG)
- Untuk Benar Salah, kosongkan semua pilihan

### Gambar tidak muncul
- Pastikan gambar ada di dokumen Word
- Format gambar: JPG, PNG, GIF
- Gambar akan otomatis diekstrak dan disimpan

---

## Bantuan

Jika mengalami masalah, hubungi admin atau lihat log error di panel admin.

