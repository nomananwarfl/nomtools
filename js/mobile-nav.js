document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    const navLinks = document.querySelectorAll('.main-menu a');
    const body = document.body;

    // Toggle mobile menu
    function toggleMenu() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Toggle aria-hidden on menu items for better screen reader support
        const menuItems = navMenu.querySelectorAll('a, button');
        menuItems.forEach(item => {
            item.setAttribute('tabindex', isExpanded ? '-1' : '0');
        });
    }

    // Toggle submenu on mobile
    function toggleSubmenu(button) {
        const submenu = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        button.setAttribute('aria-expanded', !isExpanded);
        submenu.classList.toggle('active');
        
        // Close other submenus when one is opened
        if (!isExpanded) {
            closeOtherSubmenus(button);
        }
    }

    // Close all other submenus when one is opened
    function closeOtherSubmenus(currentButton) {
        submenuToggles.forEach(toggle => {
            if (toggle !== currentButton) {
                toggle.setAttribute('aria-expanded', 'false');
                const submenu = toggle.nextElementSibling;
                if (submenu) {
                    submenu.classList.remove('active');
                }
            }
        });
    }

    // Close menu when clicking outside
    function closeMenu(e) {
        if (navMenu && !navMenu.contains(e.target) && e.target !== mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Reset tabindex for menu items
            const menuItems = navMenu.querySelectorAll('a, button');
            menuItems.forEach(item => {
                item.setAttribute('tabindex', '-1');
            });
        }
    }

    // Initialize submenus
    function initSubmenus() {
        submenuToggles.forEach(toggle => {
            const submenu = toggle.nextElementSibling;
            if (submenu) {
                // Set initial state
                toggle.setAttribute('aria-expanded', 'false');
                submenu.style.maxHeight = '0';
                
                // Add click event
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSubmenu(toggle);
                });
            }
        });
    }

    // Event Listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking on overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleMenu();
            }
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
            toggleMenu();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) {
                // Reset mobile menu state on desktop
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    body.classList.remove('menu-open');
                }
                
                // Reset all submenus
                submenuToggles.forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                    const submenu = toggle.nextElementSibling;
                    if (submenu) {
                        submenu.classList.remove('active');
                        submenu.style.maxHeight = '';
                    }
                });
            }
        }, 250);
    });

    // Initialize
    initSubmenus();
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', closeMenu);
                e.target !== searchToggle) {
                searchBox.style.display = 'none';
                searchToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Handle submenu toggles
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeOtherSubmenus(toggle);
            toggleSubmenu(toggle);
        });
    });

    // Close menu when clicking a link on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // For mobile, only close menu if not a parent link with submenu
                if (!link.parentElement.classList.contains('has-submenu')) {
                    toggleMenu();
                }
            }
        });
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
                toggleMenu();
            }
            if (searchToggle && searchToggle.getAttribute('aria-expanded') === 'true') {
                searchBox.style.display = 'none';
                searchToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Reset mobile menu
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                if (navMenu) navMenu.setAttribute('aria-expanded', 'false');
                if (navOverlay) navOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset search
                if (searchBox) searchBox.style.display = '';
                if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
                
                // Reset all submenus
                const submenus = document.querySelectorAll('.submenu');
                submenus.forEach(menu => {
                    menu.style.maxHeight = '';
                });
                
                submenuToggles.forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
        }, 250);
    }

    window.addEventListener('resize', handleResize);

    // Initialize submenu heights for mobile
    function initSubmenus() {
        if (window.innerWidth <= 768) {
            const submenus = document.querySelectorAll('.submenu');
            submenus.forEach(menu => {
                if (menu.previousElementSibling.getAttribute('aria-expanded') === 'true') {
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                } else {
                    menu.style.maxHeight = '0';
                }
            });
        }
    }

    // Initialize
    initSubmenus();
    
    // Re-initialize when the window is resized
    window.addEventListener('resize', initSubmenus);
});
