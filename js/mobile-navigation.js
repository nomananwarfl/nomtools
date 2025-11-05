document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu-container');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    const body = document.body;

    // Toggle mobile menu
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Toggle aria-hidden on menu items for better screen reader support
        const menuItems = navMenu.querySelectorAll('a, button');
        menuItems.forEach(item => {
            const currentAriaHidden = item.getAttribute('aria-hidden');
            item.setAttribute('aria-hidden', currentAriaHidden === 'true' ? 'false' : 'true');
            item.setAttribute('tabindex', isExpanded ? '-1' : '0');
        });
    }

    // Toggle submenu
    function toggleSubmenu(button) {
        const submenu = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        button.querySelector('.plus').textContent = isExpanded ? '+' : '-';
        submenu.classList.toggle('active');
    }

    // Close menu when clicking outside
    function closeMenu(e) {
        if (navMenu && !navMenu.contains(e.target) && e.target !== menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Reset tabindex for menu items
            const menuItems = navMenu.querySelectorAll('a, button');
            menuItems.forEach(item => {
                item.setAttribute('tabindex', '-1');
                item.setAttribute('aria-hidden', 'true');
            });
        }
    }

    // Initialize navigation
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            toggleMenu();
        });
    }

    // Handle submenu toggles
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSubmenu(toggle);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', closeMenu);
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            toggleMenu();
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu-container a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleMenu();
            }
        });
    });
});
