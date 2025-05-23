// Google AdSense Integration
document.addEventListener('DOMContentLoaded', function () {
    // Check if cookies are accepted before loading ads
    if (getCookie('cookie_consent') === 'accepted') {
        loadAdsenseScript();
    }
});

// Listen for the custom event when ads are enabled
document.addEventListener('adsEnabled', function () {
    loadAdsenseScript();
});

// Function to load the Google AdSense script
function loadAdsenseScript() {
    // Only load if not already loaded
    if (!document.getElementById('adsense-script')) {
        // Create and append the AdSense script
        const adScript = document.createElement('script');
        adScript.id = 'adsense-script';
        adScript.async = true;
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
        adScript.crossOrigin = 'anonymous';
        document.head.appendChild(adScript);

        // Wait for the script to load before showing ads
        adScript.onload = function () {
            // Show the ads that were hidden
            showAds();

            // Initialize any existing ad units
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense initialization error:', e);
            }
        };
    } else {
        // If script is already loaded, just show the ads
        showAds();

        // Re-initialize ads
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense initialization error:', e);
        }
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