# Sistem Perhitungan Bobot Ujian

## Konsep Dasar

Sistem bobot ujian menggunakan prinsip **100% total bobot** yang didistribusikan secara merata kepada semua soal yang dijawab dengan benar.

### Rumus Perhitungan
```
Nilai = (Jumlah Jawaban Benar / Total Soal) × 100
```

## Contoh Perhitungan

### Contoh 1: Ujian dengan 10 Soal

**Skenario:**
- Total soal: 10
- Siswa menjawab benar: 8 soal
- Siswa menjawab salah: 2 soal

**Perhitungan:**
```
Nilai = (8 / 10) × 100 = 80
```

**Penjelasan:**
- Total bobot ujian = 100%
- Setiap soal memiliki bobot yang sama = 100% ÷ 10 = 10% per soal
- Soal yang dijawab benar = 8 × 10% = 80%
- Soal yang dijawab salah = 0% (tidak berkontribusi pada nilai)
- **Nilai akhir = 80**

### Contoh 2: Ujian dengan 20 Soal

**Skenario:**
- Total soal: 20
- Siswa menjawab benar: 18 soal
- Siswa menjawab salah: 2 soal

**Perhitungan:**
```
Nilai = (18 / 20) × 100 = 90
```

**Penjelasan:**
- Total bobot ujian = 100%
- Setiap soal memiliki bobot yang sama = 100% ÷ 20 = 5% per soal
- Soal yang dijawab benar = 18 × 5% = 90%
- Soal yang dijawab salah = 0% (tidak berkontribusi pada nilai)
- **Nilai akhir = 90**

### Contoh 3: Ujian dengan 5 Soal

**Skenario:**
- Total soal: 5
- Siswa menjawab benar: 5 soal (semua benar)
- Siswa menjawab salah: 0 soal

**Perhitungan:**
```
Nilai = (5 / 5) × 100 = 100
```

**Penjelasan:**
- Total bobot ujian = 100%
- Setiap soal memiliki bobot yang sama = 100% ÷ 5 = 20% per soal
- Soal yang dijawab benar = 5 × 20% = 100%
- **Nilai akhir = 100** (nilai sempurna)

## Karakteristik Sistem

### 1. **Bobot Otomatis**
- Bobot dihitung otomatis berdasarkan jumlah soal dalam mata pelajaran
- Setiap soal mendapat bobot yang sama: 100% ÷ jumlah soal
- Bobot diperbarui otomatis saat soal ditambah/dihapus

### 2. **Bobot Merata**
- Semua soal memiliki bobot yang sama
- Tidak ada soal yang lebih penting dari soal lainnya

### 2. **Hanya Jawaban Benar yang Dihitung**
- Jawaban salah tidak berkontribusi pada nilai
- Tidak ada pengurangan nilai untuk jawaban salah

### 3. **Skala 0-100**
- Nilai minimum: 0 (jika semua jawaban salah)
- Nilai maksimum: 100 (jika semua jawaban benar)

### 4. **Perhitungan Sederhana**
- Rumus yang mudah dipahami
- Transparan dan adil

## Implementasi dalam Sistem

### Database
- Field `bobot` pada tabel `questions` dihitung otomatis berdasarkan jumlah soal
- Bobot per soal = 100% ÷ jumlah soal dalam mata pelajaran
- Bobot total ujian dikelola di pengaturan ujian

### Update Soal yang Sudah Ada
Untuk mengupdate soal yang sudah ada dengan sistem bobot otomatis, jalankan script:
```bash
php update_bobot_script.php
```

Script ini akan:
- Menghitung ulang bobot untuk semua mata pelajaran
- Memperbarui field `bobot` di database
- Menampilkan laporan jumlah soal yang diupdate

### Kode Perhitungan

#### Perhitungan Bobot Otomatis
```php
// Calculate automatic bobot for questions
function calculateAutomaticBobot($totalQuestions) {
    if ($totalQuestions <= 0) {
        return 0;
    }
    
    // Each question gets equal weight: 100% / total questions
    $bobot = 100 / $totalQuestions;
    
    return round($bobot, 2);
}
```

#### Perhitungan Nilai Ujian
```php
// Get total questions for this exam (filtered by student's class)
$query = "SELECT COUNT(*) as total FROM questions 
          WHERE subject_id = ? 
          AND (kelas = ? OR kelas IS NULL OR kelas = '')";
$stmt = $conn->prepare($query);
$stmt->execute([$exam['subject_id'], $_SESSION['kelas']]);
$total_questions = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get user's correct answers
$query = "SELECT COUNT(*) as correct FROM user_answers 
          WHERE user_id = ? AND exam_id = ? AND is_correct = 1";
$stmt = $conn->prepare($query);
$stmt->execute([$user_id, $exam_id]);
$correct_answers = $stmt->fetch(PDO::FETCH_ASSOC)['correct'];

// Calculate score
if ($total_questions > 0) {
    $score = ($correct_answers / $total_questions) * 100;
} else {
    $score = 0;
}
```

## Keuntungan Sistem Ini

1. **Otomatis**: Bobot dihitung dan diperbarui otomatis
2. **Adil**: Semua soal memiliki bobot yang sama
3. **Transparan**: Siswa dapat dengan mudah menghitung nilai mereka
4. **Sederhana**: Tidak ada perhitungan kompleks
5. **Konsisten**: Sistem yang sama untuk semua ujian
6. **Mudah Dipahami**: Guru dan siswa dapat dengan mudah memahami sistem penilaian
7. **Dinamis**: Bobot menyesuaikan otomatis saat jumlah soal berubah

## Contoh Tabel Nilai

| Total Soal | Jawaban Benar | Jawaban Salah | Nilai |
|------------|---------------|---------------|-------|
| 10         | 10            | 0             | 100   |
| 10         | 9             | 1             | 90    |
| 10         | 8             | 2             | 80    |
| 10         | 7             | 3             | 70    |
| 10         | 6             | 4             | 60    |
| 10         | 5             | 5             | 50    |
| 10         | 4             | 6             | 40    |
| 10         | 3             | 7             | 30    |
| 10         | 2             | 8             | 20    |
| 10         | 1             | 9             | 10    |
| 10         | 0             | 10            | 0     | 