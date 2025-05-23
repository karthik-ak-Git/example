// Cookie Management Functions
document.addEventListener('DOMContentLoaded', function () {
    // Hide all ad containers by default
    hideAdContainers();

    // Check if user has already made a cookie choice
    if (!getCookie('cookie_consent')) {
        // If no choice has been made, show the cookie banner
        document.getElementById('cookie-consent-banner').style.display = 'block';
    } else if (getCookie('cookie_consent') === 'accepted') {
        // If cookies were accepted, enable ads
        enableAds();
    } else {
        // If cookies were declined, disable ads
        document.body.classList.add('ads-disabled');
    }

    // Add event listeners for the cookie consent buttons
    document.getElementById('accept-cookies').addEventListener('click', function () {
        setCookie('cookie_consent', 'accepted', 365); // Store consent for 1 year
        document.getElementById('cookie-consent-banner').style.display = 'none';
        enableAds();
    });

    document.getElementById('decline-cookies').addEventListener('click', function () {
        setCookie('cookie_consent', 'declined', 365); // Store decision for 1 year
        document.getElementById('cookie-consent-banner').style.display = 'none';
        document.body.classList.add('ads-disabled');
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
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
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