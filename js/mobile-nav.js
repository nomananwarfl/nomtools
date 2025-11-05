document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-container');
    const navOverlay = document.querySelector('.nav-overlay');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    const navLinks = document.querySelectorAll('.main-menu a');
    const searchInput = document.querySelector('.search-box input');

    // Toggle mobile menu
    function toggleMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Close search box when opening menu
            if (searchBox) {
                searchBox.style.display = 'none';
                searchToggle.setAttribute('aria-expanded', 'false');
            }
        } else {
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Toggle search box
    function toggleSearch() {
        const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
        searchToggle.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            searchBox.style.display = 'block';
            searchInput.focus();
        } else {
            searchBox.style.display = 'none';
        }
    }

    // Close menu when clicking outside
    function closeMenu(e) {
        if (navMenu && !navMenu.contains(e.target) && e.target !== navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-expanded', 'false');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Toggle submenu on mobile
    function toggleSubmenu(button) {
        const submenu = button.parentElement.querySelector('.submenu');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        button.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
        } else {
            submenu.style.maxHeight = '0';
        }
    }

    // Close all other submenus when one is opened
    function closeOtherSubmenus(currentButton) {
        submenuToggles.forEach(toggle => {
            if (toggle !== currentButton) {
                toggle.setAttribute('aria-expanded', 'false');
                const submenu = toggle.parentElement.querySelector('.submenu');
                if (submenu) {
                    submenu.style.maxHeight = '0';
                }
            }
        });
    }

    // Event Listeners
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Search toggle
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearch();
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (searchBox.style.display === 'block' && 
                !searchBox.contains(e.target) && 
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
