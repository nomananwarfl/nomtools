document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const COOKIE_CONSENT = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    // Check if user has already made a choice
    function hasConsent() {
        return document.cookie
            .split(';')
            .some(cookie => cookie.trim().startsWith(COOKIE_CONSENT + '='));
    }

    // Set cookie with the user's choice
    function setConsent(accepted) {
        const date = new Date();
        date.setTime(date.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
        const expires = '; expires=' + date.toUTCString();
        document.cookie = COOKIE_CONSENT + '=' + (accepted ? 'accepted' : 'declined') + expires + '; path=/; SameSite=Lax';
        
        // If accepted, load Google Analytics
        if (accepted) {
            loadGoogleAnalytics();
        }
        
        // Hide the banner
        cookieBanner.style.display = 'none';
    }

    // Load Google Analytics if consent is given
    function loadGoogleAnalytics() {
        // This is the existing GA code from your head
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7WRE7G63RN');
    }

    // Show the banner if no consent has been given
    if (!hasConsent()) {
        // Add a small delay to ensure the page has loaded
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    } else if (document.cookie.includes(COOKIE_CONSENT + '=accepted')) {
        // If consent was previously given, load GA
        loadGoogleAnalytics();
    }

    // Event listeners for buttons
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            setConsent(true);
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', function() {
            setConsent(false);
        });
    }
});
