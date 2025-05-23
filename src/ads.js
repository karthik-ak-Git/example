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
        // This is where you'll paste the exact AdSense code provided by Google
        // The code below is just a placeholder - replace it with your actual AdSense code

        // Example of what Google might provide:
        const adScript = document.createElement('script');
        adScript.id = 'adsense-script';
        adScript.async = true;
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
        adScript.crossOrigin = 'anonymous';
        document.head.appendChild(adScript);

        // Show the ads that were hidden
        showAds();
    } else {
        // If script is already loaded, just show the ads
        showAds();
    }
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