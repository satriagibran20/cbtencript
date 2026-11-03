# CBT SMK - Computer Based Test System

Sistem Computer Based Test (CBT) modern untuk SMK yang dilengkapi dengan fitur-fitur canggih seperti anti-cheat, monitoring real-time, dan chat system.

## 🚀 Fitur Utama

### Multi Role System
- **Admin**: Kelola seluruh sistem, user, ujian, dan monitoring
- **Guru**: Buat soal, kelola ujian, dan monitor siswa
- **Siswa**: Mengerjakan ujian dengan interface yang user-friendly

### Keamanan Tinggi
- ✅ Sistem token untuk akses ujian
- ✅ Anti-cheat detection (tab switching, copy-paste, developer tools)
- ✅ Fullscreen mode enforcement
- ✅ Session management dengan timeout
- ✅ Logging aktivitas lengkap

### Fitur Ujian
- ✅ Timer otomatis dengan auto-submit
- ✅ Sistem ragu-ragu untuk menandai soal
- ✅ Navigasi soal yang mudah
- ✅ Auto-save jawaban
- ✅ Randomisasi soal
- ✅ Multiple choice questions

### Monitoring Real-time
- ✅ Monitor siswa yang sedang ujian
- ✅ Deteksi aktivitas mencurigakan
- ✅ Status online/offline siswa
- ✅ Progress ujian real-time
- ✅ Statistik dan analytics

### Chat System
- ✅ Chat real-time menggunakan WebSocket
- ✅ Broadcast messages untuk pengumuman
- ✅ Private messages antar user
- ✅ Status online/offline
- ✅ Chat history

### Manajemen Data
- ✅ Import/Export data Excel
- ✅ Backup dan restore database
- ✅ Laporan hasil ujian
- ✅ Statistik lengkap

## 🛠️ Teknologi yang Digunakan

- **Backend**: PHP 8.0+, MySQL 8.0+
- **Frontend**: HTML5, TailwindCSS, JavaScript ES6+
- **Real-time**: WebSocket (Ratchet/ReactPHP)
- **Charts**: Chart.js
- **Notifications**: SweetAlert2
- **Icons**: Font Awesome 6
- **Animations**: AOS (Animate On Scroll)

## 📋 Persyaratan Sistem

### Server Requirements
- PHP 8.0 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- Apache/Nginx web server
- Composer (untuk WebSocket dependencies)
- Node.js (untuk WebSocket server)

### Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Instalasi

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-repo/cbt-smk.git
cd cbt-smk
\`\`\`

### 2. Setup Database
\`\`\`bash
# Import database schema
mysql -u root -p < database.sql

# Atau gunakan phpMyAdmin untuk import file database.sql
\`\`\`

### 3. Konfigurasi Database
Edit file `config/database.php`:
\`\`\`php
private $host = 'localhost';
private $db_name = 'cbt_smk';
private $username = 'your_username';
private $password = 'your_password';
\`\`\`

### 4. Setup WebSocket (Opsional)
\`\`\`bash
# Install Composer dependencies
composer install

# Jalankan WebSocket server
php websocket/chat_server.php
\`\`\`

### 5. Setup Web Server
- Arahkan document root ke folder aplikasi
- Pastikan mod_rewrite aktif (untuk Apache)
- Set permission folder yang diperlukan

### 6. Login Default
- **Username**: admin
- **Password**: password
- **Role**: Administrator

## 📁 Struktur Folder

\`\`\`
cbt-smk/
├── admin/              # Panel admin
├── guru/               # Panel guru  
├── peserta/            # Panel siswa
├── api/                # API endpoints
├── assets/             # CSS, JS, images
├── config/             # Konfigurasi aplikasi
├── websocket/          # WebSocket server
├── scripts/            # Database scripts
├── index.php           # Landing page
├── login.php           # Halaman login
├── maintenance.php     # Mode maintenance
└── README.md           # Dokumentasi
\`\`\`

## 🔧 Konfigurasi

### Pengaturan Aplikasi
Akses menu **Admin > Pengaturan** untuk mengkonfigurasi:
- Nama aplikasi dan logo
- Mode maintenance
- Pengaturan keamanan
- Timeout session
- Maksimal percobaan login

### Pengaturan Database
Edit file `config/config.php` untuk:
- Timezone
- Error reporting
- File upload limits
- Session settings

## 📖 Panduan Penggunaan

### Untuk Admin
1. Login dengan akun admin
2. Kelola Peserta (guru dan siswa)
3. Buat mata pelajaran
4. Monitor ujian real-time
5. Lihat laporan dan statistik

### Untuk Guru
1. Login dengan akun guru
2. Buat bank soal
3. Buat dan kelola ujian
4. Generate token ujian
5. Monitor siswa saat ujian
6. Lihat hasil ujian

### Untuk Siswa
1. Login dengan akun siswa
2. Masukkan token ujian
3. Kerjakan ujian dalam fullscreen
4. Submit ujian sebelum waktu habis

## 🔒 Keamanan

### Anti-Cheat Features
- Deteksi tab switching
- Disable right-click dan keyboard shortcuts
- Fullscreen mode enforcement
- Copy-paste prevention
- Developer tools detection
- Window focus monitoring

### Session Security
- Session timeout otomatis
- CSRF protection
- SQL injection prevention
- XSS protection
- Input sanitization

## 🐛 Troubleshooting

### Masalah Umum

**1. Database Connection Error**
- Periksa konfigurasi database di `config/database.php`
- Pastikan MySQL service berjalan
- Periksa username dan password database

**2. WebSocket Connection Failed**
- Pastikan port 8080 tidak diblokir firewall
- Jalankan WebSocket server: `php websocket/chat_server.php`
- Periksa log error di console browser

**3. File Upload Error**
- Periksa permission folder uploads
- Sesuaikan `upload_max_filesize` di php.ini
- Periksa `post_max_size` di php.ini

**4. Session Timeout**
- Sesuaikan `session_timeout` di pengaturan
- Periksa `session.gc_maxlifetime` di php.ini

## 📊 Monitoring & Logs

### Log Files
- `logs/` - Application logs
- Database table `logs` - User activities
- Database table `cheat_logs` - Cheating attempts

### Monitoring Dashboard
- Real-time student status
- Exam progress tracking
- Cheat detection alerts
- System performance metrics

## 🔄 Backup & Restore

### Manual Backup
\`\`\`bash
# Backup database
mysqldump -u username -p cbt_smk > backup_$(date +%Y%m%d).sql

# Backup files
tar -czf backup_files_$(date +%Y%m%d).tar.gz /path/to/cbt-smk/
\`\`\`

### Automated Backup
Setup cron job untuk backup otomatis:
\`\`\`bash
# Edit crontab
crontab -e

# Tambahkan backup harian jam 2 pagi
0 2 * * * /path/to/backup_script.sh
\`\`\`

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ Multi-role system
- ✅ Basic exam functionality
- ✅ Anti-cheat system
- ✅ Real-time monitoring
- ✅ Chat system
- ✅ Admin dashboard

### Version 1.2.5
- ✅ ADD GIF IN MAINTENANCE PAGE
- ✅ ADD PAGE 404
- ✅ FIX MAINTENANCE PAGE
- ✅ FIX HOME PAGE
- ✅ FIX FOOTER
- ✅ FIX MESSAGE IF USERNAME OR PASSWORD NOT FOUND

### Version 1.2.8
- ✅ CHANGE FORMAT IMPORT (CSV ONLY SEMENTARA)
- ✅ FIX MONITORING PAGE FOR GURU
- ✅ FIX EXPORT USERS FOR ADMIN
- ✅ FIX PROFILE PAGE FOR GURU
- ✅ UPDATE PAGE PROFILE PESERTA

### Version 1.3.0
- ✅ ADDING NEW SETINGS FOOTER IN ADMIN PAGE
- ✅ ADDING SYSTEM WHEN TIME ENDS, THE EXAM IS AUTOMATICALLY COMPLETED
- ✅ NEW MESSAGE IF MAINTENANCE MODE.

### Version 1.3.3
- ✅ FIX TOKEN GENERATOR

### Version 1.5.1
- ✅ ADD ALARM IF USERS CHEAT
- ✅ CHANGE FORMAT IMPORT SOAL
- ✅ FIX BOBOT AND AUTO MATIC BOBOT
- ✅ FIX SOME ERROR 
- ✅ FIX AUTOMATIC GENERATE TOKEN
- ✅ FIX CETAK KARTU

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@cbtsmk.com
- Documentation: [docs.cbtsmk.com](https://docs.cbtsmk.com)
- Issues: [GitHub Issues](https://github.com/your-repo/cbt-smk/issues)

## 🙏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [SweetAlert2](https://sweetalert2.github.io/) - Beautiful alerts
- [Chart.js](https://www.chartjs.org/) - Charts library
- [Font Awesome](https://fontawesome.com/) - Icons
- [Ratchet](http://socketo.me/) - WebSocket library

---

**CBT SMK** - Modern Computer Based Test System for Vocational High Schools
# ujian-pasundan
