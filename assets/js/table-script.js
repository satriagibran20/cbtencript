// Table and UI Element Scripts for Admin, Guru, and Peserta Pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced data tables
    initEnhancedDataTables();
    
    // Initialize stat cards
    initStatCards();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize alerts
    initAlerts();
});

/**
 * Initialize enhanced data tables with advanced features
 */
function initEnhancedDataTables() {
    const dataTables = document.querySelectorAll('.data-table');
    
    dataTables.forEach(table => {
        if (!table.classList.contains('enhanced-data-table-initialized')) {
            // Create table container if not exists
            let tableContainer = table.closest('.data-table-container');
            if (!tableContainer) {
                tableContainer = document.createElement('div');
                tableContainer.className = 'data-table-container';
                table.parentNode.insertBefore(tableContainer, table);
                tableContainer.appendChild(table);
            }
            
            // Create table header if not exists
            let tableHeader = tableContainer.querySelector('.data-table-header');
            if (!tableHeader) {
                tableHeader = document.createElement('div');
                tableHeader.className = 'data-table-header';
                
                // Get table title from data attribute or create default
                const tableTitle = table.getAttribute('data-title') || 'Data Table';
                const tableIcon = table.getAttribute('data-icon') || 'fa-table';
                
                tableHeader.innerHTML = `
                    <div class="data-table-title">
                        <i class="fas ${tableIcon}"></i>
                        ${tableTitle}
                    </div>
                    <div class="data-table-actions">
                        <div class="data-table-search">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Cari..." class="data-table-search-input">
                        </div>
                    </div>
                `;
                
                tableContainer.insertBefore(tableHeader, table);
            }
            
            // Add search functionality
            const searchInput = tableHeader.querySelector('.data-table-search-input');
            if (searchInput) {
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
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                // Skip if explicitly marked as non-sortable
                if (header.hasAttribute('data-no-sort')) {
                    return;
                }
                
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
                        
                        // Check if values are numbers
                        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
                        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
                        
                        if (!isNaN(aNum) && !isNaN(bNum)) {
                            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
                        } else {
                            return sortDirection === 'asc' ? 
                                aValue.localeCompare(bValue, 'id', { sensitivity: 'base' }) : 
                                bValue.localeCompare(aValue, 'id', { sensitivity: 'base' });
                        }
                    });
                    
                    // Reorder the table
                    const tbody = table.querySelector('tbody');
                    rows.forEach(row => {
                        tbody.appendChild(row);
                    });
                });
            });
            
            // Create table footer with pagination if needed
            if (table.hasAttribute('data-paginate')) {
                const rowsPerPage = parseInt(table.getAttribute('data-rows-per-page')) || 10;
                const rows = table.querySelectorAll('tbody tr');
                
                if (rows.length > rowsPerPage) {
                    let tableFooter = tableContainer.querySelector('.data-table-footer');
                    if (!tableFooter) {
                        tableFooter = document.createElement('div');
                        tableFooter.className = 'data-table-footer';
                        tableContainer.appendChild(tableFooter);
                    }
                    
                    // Initialize pagination
                    initTablePagination(table, tableFooter, rowsPerPage);
                }
            }
            
            table.classList.add('enhanced-data-table-initialized');
        }
    });
}

/**
 * Initialize table pagination
 * @param {HTMLElement} table - The table element
 * @param {HTMLElement} footer - The footer element
 * @param {number} rowsPerPage - Number of rows per page
 */
function initTablePagination(table, footer, rowsPerPage) {
    const rows = table.querySelectorAll('tbody tr');
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1;
    
    // Create pagination elements
    footer.innerHTML = `
        <div class="data-table-info">
            Menampilkan <span class="current-range">1-${Math.min(rowsPerPage, totalRows)}</span> dari ${totalRows} data
        </div>
        <div class="data-table-pagination">
            <button class="pagination-button prev-page" disabled>
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="pagination-pages"></div>
            <button class="pagination-button next-page">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    const paginationPages = footer.querySelector('.pagination-pages');
    const prevButton = footer.querySelector('.prev-page');
    const nextButton = footer.querySelector('.next-page');
    const currentRangeElement = footer.querySelector('.current-range');
    
    // Create page buttons
    function createPageButtons() {
        paginationPages.innerHTML = '';
        
        // Determine which page buttons to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add first page button if not included
        if (startPage > 1) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            pageButton.textContent = '1';
            pageButton.addEventListener('click', () => goToPage(1));
            paginationPages.appendChild(pageButton);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationPages.appendChild(ellipsis);
            }
        }
        
        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => goToPage(i));
            paginationPages.appendChild(pageButton);
        }
        
        // Add last page button if not included
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationPages.appendChild(ellipsis);
            }
            
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            pageButton.textContent = totalPages;
            pageButton.addEventListener('click', () => goToPage(totalPages));
            paginationPages.appendChild(pageButton);
        }
    }
    
    // Go to specific page
    function goToPage(page) {
        currentPage = page;
        
        // Update rows visibility
        rows.forEach((row, index) => {
            row.style.display = (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage) ? '' : 'none';
        });
        
        // Update pagination buttons
        prevButton.disabled = page === 1;
        nextButton.disabled = page === totalPages;
        
        // Update current range text
        const start = (page - 1) * rowsPerPage + 1;
        const end = Math.min(page * rowsPerPage, totalRows);
        currentRangeElement.textContent = `${start}-${end}`;
        
        // Recreate page buttons
        createPageButtons();
    }
    
    // Event listeners for prev/next buttons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });
    
    // Initialize pagination
    createPageButtons();
    goToPage(1);
}

/**
 * Initialize stat cards with animations
 */
function initStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const valueElement = card.querySelector('.stat-card-value');
        if (valueElement && !card.classList.contains('stat-card-initialized')) {
            const finalValue = parseInt(valueElement.textContent);
            
            // Only animate if it's a number
            if (!isNaN(finalValue)) {
                valueElement.textContent = '0';
                
                // Simple animation
                let currentValue = 0;
                const duration = 1000; // 1 second
                const interval = 50; // Update every 50ms
                const steps = duration / interval;
                const increment = finalValue / steps;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        clearInterval(timer);
                        currentValue = finalValue;
                    }
                    valueElement.textContent = Math.floor(currentValue);
                }, interval);
            }
            
            card.classList.add('stat-card-initialized');
        }
    });
}

/**
 * Initialize form validations
 */
function initFormValidations() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'Bidang ini wajib diisi');
                } else {
                    clearFieldError(field);
                }
            });
            
            // Check email fields
            const emailFields = form.querySelectorAll('[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    showFieldError(field, 'Format email tidak valid');
                }
            });
            
            // Check password fields
            const passwordFields = form.querySelectorAll('[data-validate="password"]');
            passwordFields.forEach(field => {
                if (field.value.trim() && field.value.length < 6) {
                    isValid = false;
                    showFieldError(field, 'Password minimal 6 karakter');
                }
            });
            
            // Check password confirmation
            const passwordConfirmFields = form.querySelectorAll('[data-validate="password-confirm"]');
            passwordConfirmFields.forEach(field => {
                const passwordField = document.getElementById(field.getAttribute('data-match'));
                if (passwordField && field.value !== passwordField.value) {
                    isValid = false;
                    showFieldError(field, 'Password tidak cocok');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Live validation on blur
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                // Required validation
                if (field.hasAttribute('required') && !field.value.trim()) {
                    showFieldError(field, 'Bidang ini wajib diisi');
                } else {
                    clearFieldError(field);
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
                    showFieldError(field, 'Format email tidak valid');
                }
                
                // Password validation
                if (field.getAttribute('data-validate') === 'password' && field.value.trim() && field.value.length < 6) {
                    showFieldError(field, 'Password minimal 6 karakter');
                }
                
                // Password confirmation
                if (field.getAttribute('data-validate') === 'password-confirm') {
                    const passwordField = document.getElementById(field.getAttribute('data-match'));
                    if (passwordField && field.value !== passwordField.value) {
                        showFieldError(field, 'Password tidak cocok');
                    }
                }
            });
        });
    });
}

/**
 * Show field error message
 * @param {HTMLElement} field - The form field
 * @param {string} message - The error message
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message if any
    const existingError = field.parentNode.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error-message';
    errorElement.textContent = message;
    
    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

/**
 * Clear field error message
 * @param {HTMLElement} field - The form field
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message if exists
    const errorElement = field.parentNode.querySelector('.form-error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

/**
 * Initialize alerts with auto-dismiss
 */
function initAlerts() {
    const alerts = document.querySelectorAll('.alert[data-auto-dismiss]');
    
    alerts.forEach(alert => {
        const dismissTime = parseInt(alert.getAttribute('data-auto-dismiss')) || 5000;
        
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, dismissTime);
    });
    
    // Add close button functionality
    document.querySelectorAll('.alert .alert-close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            const alert = this.closest('.alert');
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });
}