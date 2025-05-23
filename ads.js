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

    // Make sure ads are initialized
    try {
        if (window.adsbygoogle && window.adsbygoogle.loaded) {
            // AdSense is already loaded, just push the ads
            (adsbygoogle = window.adsbygoogle || []).push({});
        } else {
            // Wait a bit for AdSense to load
            setTimeout(function () {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 500);
        }
    } catch (e) {
        console.error('AdSense initialization error:', e);
    }
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

            // Force a layout recalculation
            setTimeout(() => {
                // Try to push the ad again after a short delay
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.log('Additional ad push attempt:', e);
                }
            }, 200);
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