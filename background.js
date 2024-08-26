// List of sites to block
const blockedSites = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com'];

// Function to check if a site is blocked
function isSiteBlocked(url) {
    for (let i = 0; i < blockedSites.length; i++) {
        if (url.hostname.includes(blockedSites[i])) {
            return true;
        }
    }
    return false;
}

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
    chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
        chrome.storage.local.get(['focusMode'], function(result) {
            // Only block sites if focus mode is enabled
            if (result.focusMode) {
                const url = new URL(details.url);
                if (isSiteBlocked(url)) {
                    chrome.tabs.update(details.tabId, {url: 'blocked.html'});
                }
            }
        });
    });
});
