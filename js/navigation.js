// Mobile navigation toggle
const navToggle = document.querySelector('.master-nav-toggle');
const navMenu = document.querySelector('.master-nav-menu');
const navOverlay = document.querySelector('.master-nav-overlay');
const body = document.body;

// Toggle mobile menu
function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('open');
    body.classList.toggle('nav-open', !isExpanded);
    
    // Toggle aria-hidden on menu items for better screen reader support
    const menuItems = navMenu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.setAttribute('tabindex', isExpanded ? '-1' : '0');
    });
}

// Close menu when clicking outside
function closeMenu(e) {
    if (!navMenu.contains(e.target) && e.target !== navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('open');
        body.classList.remove('nav-open');
        
        // Reset tabindex for menu items
        const menuItems = navMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.master-nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleMenu();
            }
        });
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu();
        }
    });
    
    // Close menu when window is resized to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('open');
                navOverlay.classList.remove('open');
                body.classList.remove('nav-open');
            }
        }, 250);
    });
});

// Update active link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.master-nav-menu a');

function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Throttle the scroll event
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateActiveLink, 50);
}, false);

// Initial call to set active link on page load
document.addEventListener('DOMContentLoaded', updateActiveLink);