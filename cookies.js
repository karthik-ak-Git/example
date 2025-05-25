// Cookie Management Functions
document.addEventListener('DOMContentLoaded', function () {
    // Hide all ad containers by default
    hideAdContainers();

    // Check browser privacy features
    checkBrowserPrivacyFeatures();

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

// Function to check browser privacy features
function checkBrowserPrivacyFeatures() {
    // Check if running in Microsoft Edge
    const isEdge = /Edg/.test(navigator.userAgent);
    
    if (isEdge) {
        // Check for third-party cookie blocking
        const testCookie = 'testCookie';
        document.cookie = `${testCookie}=1; domain=.doubleclick.net; path=/`;
        const hasThirdPartyCookies = document.cookie.indexOf(testCookie) !== -1;
        
        if (!hasThirdPartyCookies) {
            console.log('Third-party cookies are blocked in this browser');
            // Store this information for ad serving decisions
            localStorage.setItem('thirdPartyCookiesBlocked', 'true');
        }
    }
}

// Function to handle cookie consent
function handleCookieConsent(consentData) {
    if (consentData.advertising) {
        // Check if third-party cookies are blocked
        const thirdPartyCookiesBlocked = localStorage.getItem('thirdPartyCookiesBlocked') === 'true';
        
        if (thirdPartyCookiesBlocked) {
            // Use privacy-preserving alternatives
            enablePrivacyPreservingAds();
        } else {
            // Use traditional ad serving
            enableThirdPartyCookies();
        }
        
        // Show and initialize ads
        document.body.classList.remove('ads-disabled');
        const event = new Event('adsEnabled');
        document.dispatchEvent(event);
    } else {
        // Disable ads
        disableAds();
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

// Function to enable privacy-preserving ads
function enablePrivacyPreservingAds() {
    // Set up first-party data collection
    setupFirstPartyDataCollection();
    
    // Use Topics API if available
    if (document.browsingTopics) {
        setupTopicsAPI();
    }
    
    // Use FLEDGE/Protected Audience API if available
    if (navigator.runAdAuction) {
        setupProtectedAudienceAPI();
    }
    
    // Load AdSense with privacy-preserving features
    loadPrivacyPreservingAdSense();
}

// Function to set up first-party data collection
function setupFirstPartyDataCollection() {
    // Collect and store first-party data for ad targeting
    const firstPartyData = {
        pageContext: {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            categories: Array.from(document.querySelectorAll('meta[property="article:tag"]'))
                .map(tag => tag.content)
        },
        userContext: {
            visitTime: new Date().toISOString(),
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        }
    };
    
    localStorage.setItem('firstPartyData', JSON.stringify(firstPartyData));
}

// Function to set up Topics API
function setupTopicsAPI() {
    document.browsingTopics()
        .then(topics => {
            if (topics && topics.length > 0) {
                localStorage.setItem('userTopics', JSON.stringify(topics));
            }
        })
        .catch(error => {
            console.error('Error accessing Topics API:', error);
        });
}

// Function to set up Protected Audience API
function setupProtectedAudienceAPI() {
    // Implementation for FLEDGE/Protected Audience API
    console.log('Protected Audience API is available');
}

// Function to load AdSense with privacy-preserving features
function loadPrivacyPreservingAdSense() {
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7139286601549044';
    script.crossOrigin = 'anonymous';
    
    // Add privacy-preserving parameters
    script.setAttribute('data-privacy-preserving', 'true');
    
    document.head.appendChild(script);
}

// Function to enable third-party cookies for advertising
function enableThirdPartyCookies() {
    localStorage.setItem('thirdPartyCookiesAllowed', 'true');
    loadPrivacyPreservingAdSense();
}

// Function to disable ads
function disableAds() {
    localStorage.setItem('thirdPartyCookiesAllowed', 'false');
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