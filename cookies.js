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

            // If advertising cookies were accepted, enable ads
            if (consentData && consentData.advertising) {
                enableAds();
            } else {
                // If advertising cookies were declined, disable ads
                document.body.classList.add('ads-disabled');
            }
        } catch (e) {
            // Handle legacy cookie format
            if (getCookie('cookie_consent') === 'accepted') {
                enableAds();
            } else {
                document.body.classList.add('ads-disabled');
            }
        }
    }

    // Add event listeners for the cookie consent buttons
    document.getElementById('accept-cookies').addEventListener('click', function () {
        // Accept all cookies
        const consentData = {
            essential: true,
            analytics: true,
            advertising: true
        };

        setCookie('cookie_consent', JSON.stringify(consentData), 365); // Store consent for 1 year
        document.getElementById('cookie-consent-banner').style.display = 'none';
        enableAds();

        // Inform users about the importance of cookies for functionality
        showCookieNotification('All cookies accepted. Thank you for supporting our site!');
    });

    // Handle accept selected cookies
    document.getElementById('accept-selected-cookies').addEventListener('click', function () {
        const consentData = {
            essential: true, // Essential cookies are always required
            analytics: document.getElementById('analytics-cookies').checked,
            advertising: document.getElementById('advertising-cookies').checked
        };

        setCookie('cookie_consent', JSON.stringify(consentData), 365);
        document.getElementById('cookie-consent-banner').style.display = 'none';

        if (consentData.advertising) {
            enableAds();
            showCookieNotification('Selected cookies accepted. Ads will be displayed.');
        } else {
            document.body.classList.add('ads-disabled');
            showCookieNotification('Selected cookies accepted. Ads will be hidden.');
        }
    });

    document.getElementById('decline-cookies').addEventListener('click', function () {
        // Only accept essential cookies
        const consentData = {
            essential: true,
            analytics: false,
            advertising: false
        };

        setCookie('cookie_consent', JSON.stringify(consentData), 365);
        document.getElementById('cookie-consent-banner').style.display = 'none';
        document.body.classList.add('ads-disabled');

        // Inform users about the impact of declining cookies
        showCookieNotification('Only essential cookies accepted. Some features may be limited.');
    });
});

// Function to hide ad containers
function hideAdContainers() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        container.style.display = 'none';
    });
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

// Function to enable ads
function enableAds() {
    // This function will be called when cookies are accepted
    // The actual ad loading is handled in ads.js
    const event = new Event('adsEnabled');
    document.dispatchEvent(event);
}

// Function to show a notification about cookie settings
function showCookieNotification(message) {
    // Create notification element if it doesn't exist
    if (!document.getElementById('cookie-notification')) {
        const notification = document.createElement('div');
        notification.id = 'cookie-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#f8f9fa';
        notification.style.border = '1px solid #dee2e6';
        notification.style.borderRadius = '4px';
        notification.style.padding = '10px 20px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '300px';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(notification);
    }

    const notification = document.getElementById('cookie-notification');
    notification.textContent = message;
    notification.style.opacity = '1';

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 5000);
}