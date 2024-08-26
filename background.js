const defaultBlockedSites = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com'];

// Initialize storage with default lists if needed
chrome.runtime.onInstalled.addListener(() => {
    initializeStorage();
});

function initializeStorage() {
    chrome.storage.local.get(['blacklist', 'whitelist'], (result) => {
        if (!result.blacklist) {
            chrome.storage.local.set({ blacklist: defaultBlockedSites });
        } else {
            const updatedBlacklist = mergeLists(defaultBlockedSites, result.blacklist);
            chrome.storage.local.set({ blacklist: updatedBlacklist });
        }

        if (!result.whitelist) {
            chrome.storage.local.set({ whitelist: [] });
        }
    });
}

// Handle navigation events to block sites
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    handleNavigation(details);
});

function handleNavigation(details) {
    chrome.storage.local.get(['focusMode', 'blacklist', 'whitelist'], (result) => {
        if (result.focusMode) {
            const hostname = new URL(details.url).hostname.toLowerCase();

            if (isWhitelisted(hostname, result.whitelist)) {
                return;
            }

            const fullBlacklist = mergeLists(defaultBlockedSites, result.blacklist);
            if (isBlacklisted(hostname, fullBlacklist)) {
                chrome.tabs.update(details.tabId, { url: 'blocked.html' });
            }
        }
    });
}

function mergeLists(defaultList, customList) {
    return [...new Set([...defaultList, ...customList])];
}

function isWhitelisted(hostname, whitelist) {
    return whitelist && whitelist.some(site => hostname.includes(site.toLowerCase()));
}

function isBlacklisted(hostname, blacklist) {
    return blacklist && blacklist.some(site => hostname.includes(site.toLowerCase()));
}
