// Cookie Management Functions
document.addEventListener('DOMContentLoaded', function () {
    // Hide all ad containers by default
    hideAdContainers();

    // Check if user has already made a cookie choice
    if (!getCookie('cookie_consent')) {
        // If no choice has been made, show the cookie banner
        document.getElementById('cookie-consent-banner').style.display = 'block';
    } else {
        // Parse the cookie consent JSON
        try {
            const consentData = JSON.parse(getCookie('cookie_consent'));
            handleCookieConsent(consentData);
        } catch (e) {
            console.error('Error parsing cookie consent:', e);
            // Default to most restrictive setting
            handleCookieConsent({ essential: true, analytics: false, advertising: false });
        }
    }

    // Add event listeners for the cookie consent buttons
    document.getElementById('accept-cookies').addEventListener('click', function () {
        const consentData = {
            essential: true,
            analytics: true,
            advertising: true
        };
        handleCookieConsent(consentData);
        setCookie('cookie_consent', JSON.stringify(consentData), 365);
        document.getElementById('cookie-consent-banner').style.display = 'none';
        showCookieNotification('All cookies accepted. Thank you for supporting our site!');
    });

    document.getElementById('accept-selected-cookies').addEventListener('click', function () {
        const consentData = {
            essential: true,
            analytics: document.getElementById('analytics-cookies').checked,
            advertising: document.getElementById('advertising-cookies').checked
        };
        handleCookieConsent(consentData);
        setCookie('cookie_consent', JSON.stringify(consentData), 365);
        document.getElementById('cookie-consent-banner').style.display = 'none';
        showCookieNotification('Selected cookies accepted.');
    });

    document.getElementById('decline-cookies').addEventListener('click', function () {
        const consentData = {
            essential: true,
            analytics: false,
            advertising: false
        };
        handleCookieConsent(consentData);
        setCookie('cookie_consent', JSON.stringify(consentData), 365);
        document.getElementById('cookie-consent-banner').style.display = 'none';
        showCookieNotification('Only essential cookies accepted. Some features may be limited.');
    });
});

// Function to handle cookie consent
function handleCookieConsent(consentData) {
    if (consentData.advertising) {
        // Enable third-party cookies for advertising
        enableThirdPartyCookies();
        // Show and initialize ads
        document.body.classList.remove('ads-disabled');
        const event = new Event('adsEnabled');
        document.dispatchEvent(event);
    } else {
        // Disable third-party cookies for advertising
        disableThirdPartyCookies();
        // Hide ads
        document.body.classList.add('ads-disabled');
        hideAds();
    }

    // Handle analytics cookies
    if (consentData.analytics) {
        enableAnalytics();
    } else {
        disableAnalytics();
    }
}

// Function to enable third-party cookies for advertising
function enableThirdPartyCookies() {
    // Set a flag to indicate third-party cookies are allowed
    localStorage.setItem('thirdPartyCookiesAllowed', 'true');
    
    // Reload AdSense script to ensure it picks up the new cookie settings
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7139286601549044';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

// Function to disable third-party cookies for advertising
function disableThirdPartyCookies() {
    // Set a flag to indicate third-party cookies are not allowed
    localStorage.setItem('thirdPartyCookiesAllowed', 'false');
    
    // Remove AdSense script
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (existingScript) {
        existingScript.remove();
    }
}

// Function to enable analytics
function enableAnalytics() {
    // Add your analytics initialization code here
    console.log('Analytics enabled');
}

// Function to disable analytics
function disableAnalytics() {
    // Add your analytics disabling code here
    console.log('Analytics disabled');
}

// Function to hide ad containers
function hideAdContainers() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        container.style.display = 'none';
    });
}

// Function to hide ads
function hideAds() {
    // Implementation of hideAds function
    console.log('Ads hidden');
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    // Use SameSite=Lax for first-party cookies
    // This is more privacy-friendly while still allowing most functionality
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax; Secure';
}

// Function to get a cookie value
function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to delete a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Function to show a notification about cookie settings
function showCookieNotification(message) {
    const notification = document.createElement('div');
    notification.id = 'cookie-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 10px 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 300px;
        transition: opacity 0.5s ease-in-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}