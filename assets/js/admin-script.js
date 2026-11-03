// Admin Script - Shared functionality for admin, guru, and peserta pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdowns
    initDropdowns();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize mobile menu (if exists)
    initMobileMenu();
    
    // Initialize data tables (if exists)
    initDataTables();

    // Start session checker
    initSessionChecker();
});

/**
 * Initialize dropdown menus
 */
function initDropdowns() {
    // User dropdown
    const userDropdownToggle = document.getElementById('userDropdownToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdownToggle && userDropdown) {
        userDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userDropdownToggle.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
}

/**
 * Initialize notification system
 */
function initNotifications() {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationToggle && notificationDropdown) {
        notificationToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('hidden');
        });
        
        // Close notification dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationDropdown.contains(e.target) && !notificationToggle.contains(e.target)) {
                notificationDropdown.classList.add('hidden');
            }
        });
    }
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 10 + 'px';
            tooltipEl.style.left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
            tooltipEl.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                tooltipEl.remove();
            }
        });
    });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuToggle && mobileMenu && mobileMenuOverlay) {
        // Open mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close mobile menu
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        // Overlay click
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

/**
 * Initialize data tables with sorting and filtering
 */
function initDataTables() {
    const dataTables = document.querySelectorAll('.data-table');
    
    dataTables.forEach(table => {
        if (!table.classList.contains('data-table-initialized')) {
            // Add search functionality
            const tableContainer = table.closest('.table-container');
            if (tableContainer) {
                const searchContainer = document.createElement('div');
                searchContainer.className = 'search-container mb-4';
                searchContainer.innerHTML = `
                    <div class="flex">
                        <input type="text" class="form-input search-input" placeholder="Cari...">
                    </div>
                `;
                tableContainer.insertBefore(searchContainer, table);
                
                const searchInput = searchContainer.querySelector('.search-input');
                searchInput.addEventListener('keyup', function() {
                    const searchTerm = this.value.toLowerCase();
                    const rows = table.querySelectorAll('tbody tr');
                    
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(searchTerm) ? '' : 'none';
                    });
                });
            }
            
            // Add sorting functionality
            const headers = table.querySelectorAll('th[data-sort]');
            headers.forEach(header => {
                header.classList.add('sortable');
                header.addEventListener('click', function() {
                    const column = this.cellIndex;
                    const sortDirection = this.classList.contains('sort-asc') ? 'desc' : 'asc';
                    
                    // Remove sort classes from all headers
                    headers.forEach(h => {
                        h.classList.remove('sort-asc', 'sort-desc');
                    });
                    
                    // Add sort class to current header
                    this.classList.add(`sort-${sortDirection}`);
                    
                    // Sort the table
                    const rows = Array.from(table.querySelectorAll('tbody tr'));
                    rows.sort((a, b) => {
                        const aValue = a.cells[column].textContent.trim();
                        const bValue = b.cells[column].textContent.trim();
                        
                        if (sortDirection === 'asc') {
                            return aValue.localeCompare(bValue);
                        } else {
                            return bValue.localeCompare(aValue);
                        }
                    });
                    
                    // Reorder the table
                    const tbody = table.querySelector('tbody');
                    rows.forEach(row => {
                        tbody.appendChild(row);
                    });
                });
            });
            
            table.classList.add('data-table-initialized');
        }
    });
}

/**
 * Show a confirmation dialog
 * @param {string} message - The confirmation message
 * @param {Function} callback - Function to call if confirmed
 */
function confirmAction(message, callback) {
    if (window.Swal) {
        // Use SweetAlert2 if available
        Swal.fire({
            title: 'Konfirmasi',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    } else {
        // Fallback to browser confirm
        if (confirm(message)) {
            callback();
        }
    }
}

/**
 * Show a toast notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    if (window.Swal) {
        // Use SweetAlert2 if available
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
        Toast.fire({
            icon: type,
            title: message
        });
    } else {
        // Fallback to alert
        alert(message);
    }
}

/**
 * Format date to Indonesian format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format time to Indonesian format
 * @param {string} timeString - The time string to format
 * @returns {string} Formatted time string
 */
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format date and time to Indonesian format
 * @param {string} dateTimeString - The date and time string to format
 * @returns {string} Formatted date and time string
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Periodically checks the user's session status.
 */
function initSessionChecker() {
    const sessionInterval = setInterval(function() {
        fetch('../api/check_session.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'reset') {
                    // Stop the interval
                    clearInterval(sessionInterval);
                    
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesi Direset',
                        text: 'Sesi Anda telah direset oleh administrator. Anda akan dialihkan ke halaman login.',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '../login.php';
                    });
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
                // Stop polling on error to avoid flooding the console
                clearInterval(sessionInterval);
            });
    }, 1000); // Check every 5 seconds
}

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

