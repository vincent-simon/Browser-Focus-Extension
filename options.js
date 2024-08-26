const defaultBlockedSites = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com'];

document.addEventListener('DOMContentLoaded', function () {
    const blacklistInput = document.getElementById('blacklist-input');
    const addBlacklistButton = document.getElementById('add-blacklist');
    const blacklistList = document.getElementById('blacklist');

    const whitelistInput = document.getElementById('whitelist-input');
    const addWhitelistButton = document.getElementById('add-whitelist');
    const whitelistList = document.getElementById('whitelist');

    // Load saved lists
    chrome.storage.local.get(['blacklist', 'whitelist'], function (result) {
        const blacklist = result.blacklist || [];
        const whitelist = result.whitelist || [];

        // Ensure default sites are always in the blacklist
        const fullBlacklist = [...new Set([...defaultBlockedSites, ...blacklist])];
        
        // Display blacklist (including default sites)
        fullBlacklist.forEach(site => addListItem(site, blacklistList, 'blacklist', defaultBlockedSites.includes(site)));
        
        // Display whitelist
        whitelist.forEach(site => addListItem(site, whitelistList, 'whitelist', false));

        // Save the updated blacklist
        chrome.storage.local.set({ blacklist: fullBlacklist });
    });

    // Add to blacklist
    addBlacklistButton.addEventListener('click', function () {
        const site = blacklistInput.value.trim().toLowerCase();
        if (site && !defaultBlockedSites.includes(site)) {
            addListItem(site, blacklistList, 'blacklist', false);
            saveToStorage(site, 'blacklist');
            blacklistInput.value = '';
        }
    });

    // Add to whitelist
    addWhitelistButton.addEventListener('click', function () {
        const site = whitelistInput.value.trim().toLowerCase();
        if (site) {
            addListItem(site, whitelistList, 'whitelist', false);
            saveToStorage(site, 'whitelist');
            whitelistInput.value = '';
        }
    });

    // Add list item
    function addListItem(site, listElement, listType, isDefault) {
        const li = document.createElement('li');
        li.textContent = site;
        if (!isDefault) {
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function () {
                listElement.removeChild(li);
                removeFromStorage(site, listType);
            });
            li.appendChild(removeButton);
        }
        listElement.appendChild(li);
    }

    // Save site to storage
    function saveToStorage(site, listType) {
        chrome.storage.local.get([listType], function (result) {
            const updatedList = result[listType] ? [...new Set([...result[listType], site])] : [site];
            chrome.storage.local.set({ [listType]: updatedList });
        });
    }

    // Remove site from storage
    function removeFromStorage(site, listType) {
        chrome.storage.local.get([listType], function (result) {
            const updatedList = result[listType].filter(s => s !== site);
            chrome.storage.local.set({ [listType]: updatedList });
        });
    }
});