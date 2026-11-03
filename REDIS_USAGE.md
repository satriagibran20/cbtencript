# Panduan Penggunaan Redis di Aplikasi CBT

## Overview

Redis telah terintegrasi ke aplikasi CBT untuk optimasi performa. Aplikasi akan otomatis menggunakan Redis jika tersedia, dan akan fallback ke mode normal jika Redis tidak tersedia.

## Fitur yang Sudah Terintegrasi

### 1. Session Storage
- Session otomatis disimpan di Redis jika tersedia
- Fallback ke file-based session jika Redis tidak tersedia
- Tidak perlu perubahan kode

### 2. Settings Caching
- Fungsi `getSetting()` sudah menggunakan cache
- Cache otomatis di-invalidate saat `updateSetting()` dipanggil
- TTL: 1 jam

## Cara Menggunakan Cache di Kode

### Basic Cache Operations

```php
// Set cache
RedisCache::set('key', 'value', 3600); // TTL: 1 jam

// Get cache
$value = RedisCache::get('key');

// Delete cache
RedisCache::delete('key');

// Check if exists
if (RedisCache::exists('key')) {
    // ...
}
```

### Cache Remember Pattern

```php
// Get from cache, or execute callback if cache miss
$data = cacheRemember('my_key', function() {
    // Expensive operation
    $db = new Database();
    $conn = $db->getConnection();
    $query = "SELECT * FROM table";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}, 3600); // Cache for 1 hour
```

### Cache Invalidation

```php
// Delete single key
cacheForget('my_key');

// Delete by pattern
cacheForgetPattern('stats:*'); // Delete all keys starting with 'stats:'
```

## Contoh Implementasi

### 1. Caching Dashboard Statistics

**Sebelum (tanpa cache):**
```php
$query = "SELECT COUNT(*) as total FROM questions WHERE subject_id = ?";
$stmt = $conn->prepare($query);
$stmt->execute([$subjectId]);
$stats['total_questions'] = $stmt->fetchColumn();
```

**Sesudah (dengan cache):**
```php
require_once '../config/cache_helpers.php';

$stats = getCachedTeacherStats($subjectId, 300); // Cache 5 menit
```

### 2. Caching User Data

```php
require_once '../config/cache_helpers.php';

// Get user from cache
$user = getCachedUser($userId);

// Invalidate cache when user is updated
function updateUser($userId, $data) {
    // ... update database ...
    
    // Invalidate cache
    invalidateUserCache($userId);
}
```

### 3. Caching Exam Data

```php
require_once '../config/cache_helpers.php';

// Get exam from cache
$exam = getCachedExam($examId);

// Invalidate cache when exam is updated
function updateExam($examId, $data) {
    // ... update database ...
    
    // Invalidate cache
    invalidateExamCache($examId);
}
```

## Best Practices

### 1. TTL (Time To Live)

Pilih TTL yang sesuai dengan jenis data:

- **Settings**: 1 jam (3600 detik) - jarang berubah
- **User Data**: 30 menit (1800 detik) - bisa berubah
- **Statistics**: 5-15 menit (300-900 detik) - sering berubah
- **Exam Data**: 10 menit (600 detik) - bisa berubah saat aktif
- **Classes List**: 1 jam (3600 detik) - jarang berubah

### 2. Cache Invalidation

Selalu invalidate cache saat data diupdate:

```php
function updateQuestion($questionId, $data) {
    // Update database
    $query = "UPDATE questions SET ... WHERE id = ?";
    // ...
    
    // Invalidate related caches
    cacheForget("question:{$questionId}");
    cacheForgetPattern("stats:*"); // Invalidate all stats
}
```

### 3. Cache Keys Naming

Gunakan pattern yang konsisten:

- `user:{id}` - User data
- `exam:{id}` - Exam data
- `subject:{id}` - Subject data
- `stats:teacher:{subjectId}` - Teacher statistics
- `settings:{key}` - Individual setting
- `settings:all` - All settings

### 4. Error Handling

Cache operations tidak akan throw error, mereka akan return `null` atau `false` jika gagal. Aplikasi akan otomatis fallback ke database query.

## Monitoring

### Check Redis Status

```php
if (RedisCache::isEnabled()) {
    echo "Redis is working!";
} else {
    echo "Redis not available, using fallback";
}
```

### Check Cache Hit Rate

Anda bisa menambahkan logging untuk monitor cache hit rate:

```php
function cacheRememberWithLogging($key, $callback, $ttl = 3600) {
    $cached = RedisCache::get($key);
    
    if ($cached !== null) {
        error_log("Cache HIT: {$key}");
        return $cached;
    }
    
    error_log("Cache MISS: {$key}");
    $value = $callback();
    RedisCache::set($key, $value, $ttl);
    
    return $value;
}
```

## Performance Tips

1. **Cache Frequently Accessed Data**: Focus pada data yang sering diakses
2. **Appropriate TTL**: Jangan set TTL terlalu lama untuk data yang sering berubah
3. **Batch Operations**: Cache multiple related data dalam satu key jika memungkinkan
4. **Lazy Loading**: Cache data saat pertama kali diakses, bukan pre-load semua

## Troubleshooting

### Cache tidak bekerja

1. Check Redis status:
   ```php
   var_dump(RedisCache::isEnabled());
   ```

2. Check Redis connection:
   ```bash
   redis-cli ping
   ```

3. Check error log untuk detail error

### Cache tidak ter-invalidate

- Pastikan memanggil `cacheForget()` atau `cacheForgetPattern()` setelah update
- Check apakah key pattern sesuai

### Memory usage tinggi

- Review TTL values
- Implement cache size limits jika perlu
- Monitor dengan `redis-cli INFO memory`

## Advanced Usage

### Custom Cache Wrapper

```php
class ExamCache {
    public static function get($examId) {
        return getCachedExam($examId);
    }
    
    public static function invalidate($examId) {
        invalidateExamCache($examId);
    }
    
    public static function getParticipants($examId) {
        return cacheRemember("exam:{$examId}:participants", function() use ($examId) {
            // Query participants
        }, 300);
    }
}
```

### Cache Tags (Advanced)

Jika perlu, bisa implement cache tags untuk group-related invalidation:

```php
function cacheWithTags($key, $value, $tags, $ttl = 3600) {
    RedisCache::set($key, $value, $ttl);
    
    // Store key in tag sets
    foreach ($tags as $tag) {
        RedisCache::getInstance()->sAdd("tag:{$tag}", $key);
    }
}

function invalidateByTag($tag) {
    $keys = RedisCache::getInstance()->sMembers("tag:{$tag}");
    if (!empty($keys)) {
        RedisCache::getInstance()->del($keys);
    }
}
```
