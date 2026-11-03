# Dokumentasi Perhitungan Nilai Ujian

## Ringkasan Sistem Perhitungan Nilai

Sistem CBT menggunakan perhitungan nilai yang berbeda untuk berbagai jenis soal:

### 1. Soal Pilihan Ganda (PG)
- **Penilaian**: Otomatis berdasarkan `is_correct` di tabel `user_answers`
- **Nilai**: 1 jika benar, 0 jika salah
- **Perhitungan**: `is_correct = 1` jika jawaban siswa sama dengan kunci jawaban

### 2. Soal PG Kompleks (Multiple Choice)
- **Penilaian**: Otomatis berdasarkan perbandingan sorted array
- **Format Jawaban**: `'a,b,c'` (dipisahkan koma, diurutkan)
- **Perhitungan**: `is_correct = 1` jika sorted jawaban siswa sama dengan sorted `jawaban_kompleks`

### 3. Soal Benar/Salah
- **Penilaian**: Otomatis berdasarkan `is_correct`
- **Format Jawaban**: `'a'` untuk Benar, `'b'` untuk Salah
- **Perhitungan**: `is_correct = 1` jika jawaban siswa sama dengan `jawaban_benar_salah`

### 4. Soal Menjodohkan
- **Penilaian**: Otomatis berdasarkan perbandingan sorted array
- **Format Jawaban**: `'a-1,b-2,c-3'` (pasangan kiri-kanan dipisahkan koma)
- **Perhitungan**: `is_correct = 1` jika sorted jawaban siswa sama dengan sorted `jawaban_kompleks`

### 5. Soal Esai
- **Penilaian**: Manual oleh guru
- **Nilai**: Disimpan di `nilai_esai` (DECIMAL 5,2)
- **Poin Maksimal**: Disimpan di `poin_esai` (INT)
- **Perhitungan**: Nilai diberikan oleh guru, tidak otomatis

## Formula Perhitungan Nilai Akhir

### Saat Submit Ujian (peserta/save_answer.php & peserta/exam.php)
```
Total Soal = Jumlah semua soal dalam ujian (PG + Esai)
Jawaban Benar = COUNT(user_answers WHERE is_correct = 1)  // Hanya soal PG
Nilai = (Jawaban Benar / Total Soal) * 100
Nilai Final = Nilai - Penalty (dari cheat_logs)
```

**MASALAH**: Formula ini TIDAK menghitung nilai esai yang sudah dikoreksi!

### Saat Koreksi Esai (guru/essay.php - recalculateExamScore) - **SUDAH DIPERBAIKI**
```
Total Soal = COUNT(exam_questions WHERE exam_id = ?)
Total Soal PG = COUNT(exam_questions JOIN questions WHERE tipe_soal != 'esai')
Total Soal Esai = COUNT(exam_questions JOIN questions WHERE tipe_soal = 'esai')

Jawaban Benar PG = COUNT(user_answers WHERE tipe_soal != 'esai' AND is_correct = 1)
Nilai Esai = SUM(nilai_esai) dari soal esai yang sudah dikoreksi
Poin Maksimal Esai = SUM(poin_esai) dari semua soal esai

Nilai PG = (Jawaban Benar PG / Total Soal PG) * 100
Nilai Esai = (Nilai Esai / Poin Maksimal Esai) * 100

Jika ada PG dan Esai:
  Nilai Final = ((Nilai PG * Total Soal PG) + (Nilai Esai * Total Soal Esai)) / Total Soal
Jika hanya PG:
  Nilai Final = Nilai PG
Jika hanya Esai:
  Nilai Final = Nilai Esai

Nilai Final = max(0, Nilai Final - Penalty)
```

**PERBAIKAN YANG DILAKUKAN**:
1. ✅ Bug diperbaiki: Sekarang menggunakan `is_correct` dari database, bukan membandingkan `jawaban === jawaban`
2. ✅ Menghitung semua tipe soal PG (PG, PG Kompleks, Benar/Salah, Menjodohkan)
3. ✅ Formula konsisten dengan weighted average berdasarkan jumlah soal

## Rekomendasi Perbaikan

### Formula yang Disarankan (Konsisten)
```
Total Soal = Jumlah semua soal dalam ujian
Jawaban Benar PG = COUNT(user_answers WHERE tipe_soal != 'esai' AND is_correct = 1)
Nilai Esai = SUM(nilai_esai) dari soal esai yang sudah dikoreksi
Poin Maksimal Esai = SUM(poin_esai) dari semua soal esai

Nilai PG = (Jawaban Benar PG / Total Soal PG) * Bobot PG
Nilai Esai = (Nilai Esai / Poin Maksimal Esai) * Bobot Esai

Nilai Final = Nilai PG + Nilai Esai - Penalty
```

Atau lebih sederhana (sama bobot):
```
Total Soal = Jumlah semua soal dalam ujian
Jawaban Benar PG = COUNT(user_answers WHERE tipe_soal != 'esai' AND is_correct = 1)
Nilai Esai = SUM(nilai_esai) dari soal esai yang sudah dikoreksi

Nilai Final = ((Jawaban Benar PG + Nilai Esai) / Total Soal) * 100 - Penalty
```

## File yang Terlibat

1. **peserta/save_answer.php** (line 180-243): Perhitungan saat submit ujian
2. **peserta/exam.php** (line 145-172): Perhitungan saat auto-finish ujian
3. **guru/essay.php** (line 443-493): Recalculate setelah koreksi esai
4. **guru/view_result.php** (line 57-79): Statistik dan tampilan nilai

## Catatan Penting

- Soal esai yang belum dikoreksi (`nilai_esai IS NULL`) tidak dihitung dalam nilai final
- Penalty dari `cheat_logs` selalu dikurangkan dari nilai final
- Nilai final tidak boleh negatif (menggunakan `max(0, nilai - penalty)`)
