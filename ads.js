// Google AdSense Integration
window.onload = function () {
    // Check if cookies are accepted before loading ads
    if (getCookie('cookie_consent') === 'accepted') {
        loadAdsenseScript();
    }
};

// Listen for the custom event when ads are enabled
document.addEventListener('adsEnabled', function () {
    loadAdsenseScript();
});

// Function to load the Google AdSense script
function loadAdsenseScript() {
    // The AdSense script is now loaded in the HTML head
    // Just show the ads that were hidden
    showAds();

    // We don't need to initialize ads here anymore
    // Each ad unit has its own initialization script in the HTML
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

            // No need to push ads here - they're initialized by inline scripts
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