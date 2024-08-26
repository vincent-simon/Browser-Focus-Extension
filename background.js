const defaultBlockedSites = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['blacklist', 'whitelist'], (result) => {
    if (!result.blacklist) {
      // Set default blacklist if not already set
      chrome.storage.local.set({ blacklist: defaultBlockedSites });
    } else {
      // Ensure default sites are always in the blacklist
      const updatedBlacklist = [...new Set([...defaultBlockedSites, ...result.blacklist])];
      chrome.storage.local.set({ blacklist: updatedBlacklist });
    }
    
    if (!result.whitelist) {
      // Initialize empty whitelist if not set
      chrome.storage.local.set({ whitelist: [] });
    }
  });
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.local.get(['focusMode', 'blacklist', 'whitelist'], (result) => {
    if (result.focusMode) {
      const url = new URL(details.url);
      const hostname = url.hostname.toLowerCase();

      // Check whitelist first
      if (result.whitelist && result.whitelist.some(site => hostname.includes(site.toLowerCase()))) {
        return; // Allow access to whitelisted sites
      }

      // Check blacklist (including default sites)
      const fullBlacklist = [...new Set([...defaultBlockedSites, ...(result.blacklist || [])])];
      if (fullBlacklist.some(site => hostname.includes(site.toLowerCase()))) {
        chrome.tabs.update(details.tabId, {url: 'blocked.html'});
      }
    }
  });
});