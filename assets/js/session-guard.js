
// === Session Guard ===
// Masalah: saat session login habis, server membalas HTML (redirect ke halaman login).
// Semua pemanggilan response.json() lalu melempar "Unexpected token '<'" dan
// tombol simpan seolah tidak berfungsi. Guard ini mendeteksinya dan mengarahkan
// pengguna ke login dengan pesan yang jelas.
//
// Catatan: beberapa endpoint PHP mengirim JSON tanpa header application/json.
// Karena itu body diperiksa dulu: kalau isinya JSON valid, tetap dipakai.
(function () {
    if (window.__sessionGuardInstalled) return;
    window.__sessionGuardInstalled = true;
    var origJson = Response.prototype.json;

    function sessionExpired() {
        if (window.__sessionGuardShown) {
            return Promise.reject(new Error('session_expired'));
        }
        window.__sessionGuardShown = true;

        var loginUrl = '../login.php?status=session_expired';
        if (window.Swal) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesi Berakhir',
                text: 'Sesi login Anda telah habis. Silakan login kembali untuk melanjutkan.',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () { window.location.href = loginUrl; });
        } else {
            window.location.href = loginUrl;
        }
        return Promise.reject(new Error('session_expired'));
    }

    Response.prototype.json = function () {
        var res = this;
        var ct = '';
        try { ct = res.headers.get('content-type') || ''; } catch (e) {}
        if (ct.indexOf('json') !== -1) {
            return origJson.call(res);
        }
        return res.clone().text().then(function (txt) {
            try {
                return JSON.parse(txt);
            } catch (e) {}
            if (!/\S/.test(txt)) {
                return Promise.reject(new Error('empty_response'));
            }
            return sessionExpired();
        });
    };
})();

