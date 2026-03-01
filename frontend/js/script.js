const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_URL = isLocal
    ? "http://localhost:5000/api"
    : "https://rvrjc-library-system-production.up.railway.app/api";
// UX Utilities
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast align-items-center ${type} border-0 show mb-2 p-2`;
    toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

const toggleLoading = (show) => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
};

const showConfirm = (title, message, onConfirm) => {
    const modalEl = document.getElementById('confirmModal');
    if (!modalEl) return onConfirm();
    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerText = message;
    const confirmBtn = document.getElementById('confirmBtn');
    const modal = new bootstrap.Modal(modalEl);

    confirmBtn.onclick = () => {
        onConfirm();
        modal.hide();
    };
    modal.show();
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

const checkAuth = () => {
    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null' || !token) token = null;

    let userStr = localStorage.getItem('user');
    if (userStr === 'undefined' || userStr === 'null' || !userStr) userStr = 'null';

    const user = JSON.parse(userStr);
    const path = window.location.pathname.split('/').pop() || 'index.html';

    const protectedPages = ['admin.html']; // books.html and cart.html can be viewed unauthenticated initially, protected actions guard themselves.
    const authPages = ['login.html', 'membership.html'];

    if (protectedPages.includes(path) && !token) {
        showToast('Please login to access this page', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    if (path === 'admin.html' && user?.role !== 'admin') {
        showToast('Access Denied: Admins only', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Navbar Dynamic Auth Toggling
    const loginLink = document.querySelector('a[href="login.html"]');
    const joinLink = document.querySelector('a[href="membership.html"]');

    if (token) {
        // Hide Login and Join Us
        if (loginLink) loginLink.parentElement.style.display = 'none';
        if (joinLink) joinLink.parentElement.style.display = 'none';

        // Add Profile Dropdown if not exists
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav && !document.getElementById('profileDropdown')) {
            const profileLi = document.createElement('li');
            profileLi.className = 'nav-item ms-lg-3';

            const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

            const isAdmin = user?.role === 'admin';
            profileLi.innerHTML = `
                <div class="profile-dropdown ${isAdmin ? 'admin-profile' : ''}" id="profileDropdown">
                    <div class="profile-avatar ${isAdmin ? 'bg-danger text-white' : ''}">${initials}</div>
                    <div class="profile-menu">
                        <div class="profile-menu-header">
                            <h4 class="profile-menu-name d-flex align-items-center justify-content-between">
                                ${user?.name || 'User'}
                                ${isAdmin ? '<span class="badge bg-danger ms-2" style="font-size: 0.6rem;">ADMIN</span>' : ''}
                            </h4>
                            <span class="profile-menu-id">${user?.uniqueId || 'ID'}</span>
                        </div>
                        <ul class="profile-menu-list">
                            <li class="profile-menu-item">
                                <span>Role</span>
                                <span class="text-capitalize ${isAdmin ? 'text-danger fw-bold' : 'text-primary fw-bold'}">${user?.role || 'Student'}</span>
                            </li>
                            <li class="profile-menu-item">
                                <span>Dept</span>
                                <span>${user?.department || 'N/A'}</span>
                            </li>
                        </ul>
                        <button class="profile-menu-logout" id="logoutBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            `;
            navbarNav.appendChild(profileLi);

            // Toggle dropdown logic
            const dropdown = document.getElementById('profileDropdown');
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                if (dropdown.classList.contains('open')) {
                    dropdown.classList.remove('open');
                }
            });

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
            });
        }
    } else {
        // Ensure Login and Join Us are visible
        if (loginLink) loginLink.parentElement.style.display = 'block';
        if (joinLink) joinLink.parentElement.style.display = 'block';
        const profileDropdownItem = document.getElementById('profileDropdown')?.parentElement;
        if (profileDropdownItem) profileDropdownItem.remove();
    }

    // Removed the forced redirect on authPages so users can still manually navigate if they want to without being trapped.
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('LMS Frontend Loaded');
    checkAuth();

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +(counter.innerText.replace('+', '') || 0);
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + '+';
                }
            };
            updateCount();
        });
    };

    // Trigger animation when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const uniqueId = e.target.uniqueId.value;
            const password = e.target.password.value;
            const role = e.target.role.value;

            toggleLoading(true);
            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uniqueId, password, role })
                });
                const data = await res.json();
                if (res.ok) {
                    showToast('Welcome back! Logging you in...');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    setTimeout(() => {
                        window.location.href = data.user.role === 'admin' ? 'admin.html' : 'books.html';
                    }, 1000);
                } else {
                    showToast(data.message, 'error');
                }
            } catch (err) {
                showToast('Login failed', 'error');
            } finally {
                toggleLoading(false);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Bootstrap Validation
            if (!registerForm.checkValidity()) {
                e.stopPropagation();
                registerForm.classList.add('was-validated');
                return;
            }

            const formData = {
                uniqueId: e.target.uniqueId.value,
                name: e.target.name.value,
                email: e.target.email.value,
                password: e.target.password.value,
                role: e.target.role.value,
                department: e.target.department.value
            };

            toggleLoading(true);
            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await res.json();
                if (res.ok) {
                    showToast('Registration successful! Your account is pending admin approval.', 'success');
                    e.target.reset();
                    registerForm.classList.remove('was-validated');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    const msg = data.error || data.message || 'Registration failed';
                    showToast(msg, 'error');
                }
            } catch (err) {
                console.error('Registration Error:', err);
                showToast('Registration failed: Server unreachable or internal error', 'error');
            } finally {
                toggleLoading(false);
            }
        });
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const uniqueId = e.target.resetId.value;
            const email = e.target.resetEmail.value;
            const newPassword = e.target.resetPassword.value;

            toggleLoading(true);
            try {
                const res = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uniqueId, email, newPassword })
                });
                const data = await res.json();

                if (res.ok) {
                    showToast(data.message, 'success');
                    e.target.reset();
                    // Close the modal
                    const modalEl = document.getElementById('forgotPasswordModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                } else {
                    showToast(data.message || 'Password reset failed', 'error');
                }
            } catch (err) {
                console.error('Reset Error:', err);
                showToast('Failed to connect to the server', 'error');
            } finally {
                toggleLoading(false);
            }
        });
    }

    // Book fetching and filtering
    const bookList = document.getElementById('bookList');
    const deptFilter = document.getElementById('deptFilter');
    const bookSearch = document.getElementById('bookSearch');

    if (bookList) {
        fetchBooks();

        deptFilter.addEventListener('change', () => fetchBooks(deptFilter.value));

        bookSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card-col');
            cards.forEach(card => {
                const title = card.querySelector('.card-title').innerText.toLowerCase();
                const author = card.querySelector('.card-text').innerText.toLowerCase();
                if (title.includes(term) || author.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    updateCartBadge();
    loadCartItems();
});


const renderStars = (rating) => {
    if (rating === null || rating === undefined) return '<span class="text-muted small">No ratings yet</span>';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += `
            <svg class="star-icon" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>`;
    }

    // Half star
    if (hasHalfStar) {
        starsHtml += `
            <svg class="star-icon" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="halfStarGradient">
                        <stop offset="50%" stop-color="var(--accent-gold)" />
                        <stop offset="50%" stop-color="#e2e8f0" stop-opacity="1" />
                    </linearGradient>
                </defs>
                <path fill="url(#halfStarGradient)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>`;
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `
            <svg class="star-icon empty" viewBox="0 0 24 24" style="fill: #e2e8f0;">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>`;
    }

    return `
        <div class="book-rating">
            ${starsHtml}
            <span class="rating-value">${rating.toFixed(1)}</span>
        </div>`;
};

async function fetchBooks(dept = 'All') {
    const bookList = document.getElementById('bookList');
    if (!bookList) return;

    bookList.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border spinner-custom" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted fw-semibold">Loading library catalog...</p>
        </div>
    `;

    try {
        const url = dept === 'All' ? `${API_URL}/books` : `${API_URL}/books?department=${dept}`;
        const res = await fetch(url);
        const books = await res.json();

        if (books.length === 0) {
            bookList.innerHTML = '<div class="col-12 text-center py-5"><h3>No books found in this department.</h3></div>';
            return;
        }

        bookList.innerHTML = books.map(book => {
            const stock = book.stock_count !== undefined ? book.stock_count : (book.available ? 1 : 0);
            const isAvailable = stock > 0;

            return `
            <div class="col card-col">
                <article class="book-card h-100">
                    <div class="book-card-image-wrapper">
                        <img src="${book.image_url}" class="book-card-image" alt="Cover of ${book.title}" loading="lazy">
                        <span class="book-card-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}">
                            ${isAvailable ? `Available (${stock})` : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="book-card-content">
                        <span class="book-dept">${book.department}</span>
                        <h3 class="book-title" title="${book.title}">${book.title}</h3>
                        <p class="book-author">By ${book.author}</p>
                        
                        ${renderStars(book.rating)}

                        <div class="book-footer">
                            <div class="stock-info">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 8V21H3V8M23 3H1V8H23V3Z"/>
                                </svg>
                                <span>${isAvailable ? `${stock} copies available` : 'Currently unavailable'}</span>
                            </div>
                            <div class="d-grid gap-2">
                                <button 
                                    onclick="addToCart(${book.id})" 
                                    class="btn-add-cart"
                                    ${!isAvailable ? 'disabled title="This book is currently out of stock"' : ''}
                                >
                                    Add to Cart
                                </button>
                                <button onclick="issueBook(${book.id})" class="btn-issue ${!isAvailable ? 'disabled' : ''}" ${!isAvailable ? 'disabled' : ''}>
                                    ${isAvailable ? 'Issue Now' : 'Not Available'}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        `}).join('');
    } catch (err) {
        bookList.innerHTML = '<div class="col-12 text-center py-5 text-danger"><h3>Error loading catalog. Please try again later.</h3></div>';
        showToast('Error loading books', 'error');
    }
}

async function issueBook(id) {
    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null') token = null;
    let userStr = localStorage.getItem('user');
    if (userStr === 'undefined' || userStr === 'null') userStr = null;

    if (!token || !userStr) {
        showToast('Please login to issue books', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const user = JSON.parse(userStr);
    const modalId = 'issueBookModal';
    let modalEl = document.getElementById(modalId);

    // Inject Modal if it doesn't exist
    if (!modalEl) {
        const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 1rem;">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="fw-bold fs-4" style="color: var(--primary-blue);">Issue Book</h5>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 pt-2">
                        <p class="text-muted small mb-4">Please confirm your details to issue this book. A confirmation email will be sent to the address provided.</p>
                        <form id="issueBookForm">
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Full Name</label>
                                <input type="text" class="form-control bg-light" name="name" required value="${user.name}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Email Address</label>
                                <input type="email" class="form-control bg-light" name="email" required value="${user.email || ''}">
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small fw-bold">Roll Number / ID</label>
                                <input type="text" class="form-control bg-light" name="rollNumber" required value="${user.uniqueId}">
                            </div>
                            <input type="hidden" name="bookId" id="issueModalBookId" value="">
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary py-2 fw-bold text-uppercase" style="letter-spacing: 0.05em;">Confirm & Issue</button>
                                <button type="button" class="btn btn-light py-2 fw-semibold" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modalEl = document.getElementById(modalId);

        document.getElementById('issueBookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const bookId = form.bookId.value;
            const payload = {
                userId: user.id,
                bookId: bookId,
                name: form.name.value,
                email: form.email.value,
                rollNumber: form.rollNumber.value
            };

            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            toggleLoading(true);
            try {
                const res = await fetch(`${API_URL}/books/issue`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    showToast('Book issued successfully! Check your email for confirmation.', 'success');
                    // Refresh current view based on where we are
                    const deptFilter = document.getElementById('deptFilter');
                    if (window.location.pathname.includes('books.html')) {
                        fetchBooks(deptFilter ? deptFilter.value : 'All');
                    } else if (window.location.pathname.includes('cart.html')) {
                        loadCartItems();
                    }
                } else {
                    showToast(data.message || 'Error issuing book', 'error');
                }
            } catch (err) {
                showToast('Error issuing book', 'error');
            } finally {
                toggleLoading(false);
            }
        });
    }

    document.getElementById('issueModalBookId').value = id;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

async function updateCartBadge() {
    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null' || !token) return;
    try {
        const res = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const items = await res.json();
            const badges = document.querySelectorAll('#cartBadge');
            badges.forEach(badge => {
                const currentCount = parseInt(badge.innerText) || 0;
                if (items.length > currentCount && items.length > 0) {
                    badge.classList.remove('pulse-anim');
                    void badge.offsetWidth; // trigger reflow
                    badge.classList.add('pulse-anim');
                }
                badge.innerText = items.length;
                badge.style.display = items.length > 0 ? 'inline-block' : 'none';
            });
        }
    } catch (err) {
        console.error('Failed to update cart badge', err);
    }
}

async function addToCart(bookId) {
    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null' || !token) {
        showToast('Please login to add books to cart', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    toggleLoading(true);
    try {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId })
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Book added to cart!');
            updateCartBadge();
        } else {
            showToast(data.message || 'Failed to add to cart', 'error');
        }
    } catch (err) {
        showToast('Error adding to cart', 'error');
    } finally {
        toggleLoading(false);
    }
}

async function loadCartItems() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null' || !token) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 animate-fade-in-up">
                <div class="mb-4 text-muted opacity-50">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        <path d="M10 10l4 4m0-4l-4 4"></path>
                    </svg>
                </div>
                <h4 class="fw-bold text-dark">Please login</h4>
                <p class="text-muted mb-4">You must be logged in to view your cart.</p>
                <a href="login.html" class="btn btn-primary px-4 py-2 fw-bold shadow-sm">Go to Login</a>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await res.json();

        if (items.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 animate-fade-in-up">
                    <div class="mb-4 text-muted opacity-50">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            <path d="M10 10l4 4m0-4l-4 4"></path>
                        </svg>
                    </div>
                    <h4 class="fw-bold text-dark">Your cart is empty</h4>
                    <p class="text-muted mb-4">Looks like you haven't added any books to your cart yet.</p>
                    <a href="books.html" class="btn btn-primary px-4 py-2 fw-bold shadow-sm">Explore Catalog</a>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="col-lg-8 mx-auto mb-3">
                <div class="card shadow-sm border-0 flex-row align-items-center p-3 animate-fade-in-up cart-item-card hover-lift">
                    <img src="${item.image_url}" alt="${item.title}" style="width: 70px; height: 95px; object-fit: cover; border-radius: 6px;" class="me-4 shadow-sm">
                    <div class="flex-grow-1">
                        <h5 class="mb-1 text-dark fw-bold">${item.title}</h5>
                        <p class="text-muted small mb-0">By ${item.author} &bull; ${item.department}</p>
                    </div>
                    <div class="d-flex flex-column gap-2 ms-3">
                        <button onclick="issueBook(${item.book_id || item.id})" class="btn btn-issue btn-sm px-4 fw-bold">Book Now</button>
                        <button onclick="removeFromCart(${item.cart_id})" class="btn btn-light text-danger btn-sm px-3 fw-semibold border">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<div class="text-danger text-center py-4">Failed to load cart items. Please try again.</div>';
    }
}

async function removeFromCart(cartId) {
    let token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null' || !token) return;
    toggleLoading(true);
    try {
        const res = await fetch(`${API_URL}/cart/${cartId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Item removed from cart');
            updateCartBadge();
            loadCartItems();
        } else {
            showToast('Failed to remove item', 'error');
        }
    } catch (err) {
        showToast('Error removing item', 'error');
    } finally {
        toggleLoading(false);
    }
}

