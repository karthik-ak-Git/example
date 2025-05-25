// Google AdSense Integration
window.onload = function () {
    // Check if cookies are accepted before loading ads
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
};

// Listen for the custom event when ads are enabled
document.addEventListener('adsEnabled', function () {
    loadAdsenseScript();
});

// Function to load the Google AdSense script
function loadAdsenseScript() {
    // Show the ads that were hidden
    showAds();
    console.log('AdSense containers are now visible');
}

// Function to show ads when cookies are accepted
function showAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        // Make sure container is visible
        container.style.display = 'block';

        // Ensure the ad has width
        const adElement = container.querySelector('ins.adsbygoogle');
        if (adElement) {
            // Set explicit dimensions if not already set
            if (!adElement.style.width) {
                adElement.style.width = '100%';
            }
            if (!adElement.style.height) {
                adElement.style.height = '250px';
            }
        }
    });
}

// Function to hide ads when cookies are declined
function hideAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        container.style.display = 'none';
    });
}