// Google AdSense Integration
document.addEventListener('DOMContentLoaded', function() {
    initializeAds();
});

// Function to initialize ads
function initializeAds() {
    try {
        const consentData = JSON.parse(getCookie('cookie_consent'));
        if (consentData && consentData.advertising) {
            loadAdsenseScript();
        } else {
            hideAds();
        }
    } catch (e) {
        // If cookie doesn't exist or is invalid, hide ads
        hideAds();
    }
}

// Listen for the custom event when ads are enabled
document.addEventListener('adsEnabled', function () {
    loadAdsenseScript();
});

// Function to load the Google AdSense script
function loadAdsenseScript() {
    // Show the ads that were hidden
    showAds();
    
    // Initialize all ad units only if they haven't been initialized
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        const adElement = container.querySelector('ins.adsbygoogle');
        if (adElement && !adElement.hasAttribute('data-adsbygoogle-initialized')) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                adElement.setAttribute('data-adsbygoogle-initialized', 'true');
            } catch (e) {
                console.error('Error initializing ad:', e);
            }
        }
    });
    
    console.log('AdSense containers are now visible and initialized');
}

// Function to show ads when cookies are accepted
function showAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        container.style.display = 'block';
    });
}

// Function to hide ads when cookies are declined
function hideAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        container.style.display = 'none';
    });
}