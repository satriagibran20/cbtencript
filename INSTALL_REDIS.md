# Instalasi Redis untuk Optimasi Aplikasi CBT

Redis adalah in-memory data store yang digunakan untuk caching dan session storage, membuat aplikasi lebih ringan dan cepat.

## Persyaratan

1. **PHP Redis Extension** (disarankan) atau **Predis Library** (fallback)
2. **Redis Server** yang berjalan

## Instalasi Redis Server

### Windows (menggunakan XAMPP)

1. Download Redis untuk Windows dari: https://github.com/microsoftarchive/redis/releases
2. Extract dan jalankan `redis-server.exe`
3. Redis akan berjalan di `127.0.0.1:6379` secara default

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Linux (CentOS/RHEL)

```bash
sudo yum install epel-release
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

## Instalasi PHP Redis Extension

### Windows (XAMPP)

1. Download PHP Redis extension dari: https://pecl.php.net/package/redis
2. Atau gunakan PECL:
   ```bash
   pecl install redis
   ```
3. Tambahkan ke `php.ini`:
   ```ini
   extension=redis
   ```
4. Restart Apache

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install php-redis

# CentOS/RHEL
sudo yum install php-redis

# Atau via PECL
sudo pecl install redis
```

## Konfigurasi

### Menggunakan Environment Variables (Opsional)

Buat file `.env` di root project atau set environment variables:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0
```

### Menggunakan Konfigurasi Default

Jika tidak ada environment variables, aplikasi akan menggunakan:
- Host: `127.0.0.1`
- Port: `6379`
- Password: `null` (tidak ada)
- Database: `0`

Untuk mengubah konfigurasi, edit file `config/redis.php`:

```php
$host = '127.0.0.1';
$port = 6379;
$password = null; // atau 'password_anda'
$database = 0;
```

## Fitur yang Dioptimasi dengan Redis

### 1. Session Storage
- Session disimpan di Redis, bukan file
- Lebih cepat dan dapat diakses dari multiple server
- Auto-expire setelah 1 jam

### 2. Settings Caching
- Semua settings di-cache selama 1 jam
- Mengurangi query ke database
- Cache otomatis di-invalidate saat settings diupdate

### 3. Query Caching (Siap untuk Implementasi)
- Dashboard statistics
- User data
- Exam data
- Dan lainnya

## Fallback Behavior

Aplikasi dirancang untuk **graceful degradation**:
- Jika Redis tidak tersedia, aplikasi tetap berjalan normal
- Session akan menggunakan file-based storage
- Cache akan di-skip (query langsung ke database)
- Tidak ada error yang muncul ke user

## Testing Redis Connection

Untuk test apakah Redis berfungsi, buat file `test_redis.php`:

```php
<?php
require_once 'config/redis.php';

if (RedisCache::isEnabled()) {
    echo "Redis is ENABLED and working!\n";
    
    // Test set/get
    RedisCache::set('test_key', 'test_value', 60);
    $value = RedisCache::get('test_key');
    echo "Test value: " . $value . "\n";
} else {
    echo "Redis is NOT available. Using fallback mode.\n";
}
?>
```

## Monitoring Redis

### Menggunakan Redis CLI

```bash
# Connect to Redis
redis-cli

# Check all keys
KEYS *

# Check specific pattern
KEYS cbt:*

# Get value
GET cbt:settings:app_name

# Check memory usage
INFO memory

# Monitor commands in real-time
MONITOR
```

### Menggunakan Redis Desktop Manager

Download dari: https://redisdesktop.com/

## Troubleshooting

### Redis tidak terdeteksi

1. Pastikan Redis server berjalan:
   ```bash
   redis-cli ping
   # Harus return: PONG
   ```

2. Pastikan PHP extension terinstall:
   ```bash
   php -m | grep redis
   ```

3. Check error log:
   ```bash
   tail -f /path/to/error.log
   ```

### Session tidak tersimpan di Redis

- Check apakah `RedisCache::isEnabled()` return `true`
- Check Redis connection di `config/redis.php`
- Pastikan session handler ter-register sebelum `session_start()`

### Cache tidak bekerja

- Check apakah Redis server berjalan
- Check apakah extension terinstall
- Lihat error log untuk detail error

## Performance Tips

1. **TTL (Time To Live)**: Sesuaikan TTL cache sesuai kebutuhan
   - Settings: 1 jam (3600 detik)
   - Statistics: 5-15 menit
   - User data: 30 menit

2. **Memory Management**: Monitor penggunaan memory Redis
   ```bash
   redis-cli INFO memory
   ```

3. **Key Naming**: Gunakan prefix yang konsisten (`cbt:`)

4. **Cache Invalidation**: Selalu invalidate cache saat data diupdate

## Security

1. **Password Protection**: Set password Redis di production
2. **Network Binding**: Bind Redis hanya ke localhost atau private network
3. **Firewall**: Block port 6379 dari public access

## Support

Jika ada masalah, check:
1. Error log aplikasi
2. Redis server log
3. PHP error log
4. Network connectivity ke Redis server
