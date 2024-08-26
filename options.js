const defaultBlockedSites = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com'];

document.addEventListener('DOMContentLoaded', function () {
    initializeOptions();
});

function initializeOptions() {
    const blacklistInput = document.getElementById('blacklist-input');
    const addBlacklistButton = document.getElementById('add-blacklist');
    const blacklistList = document.getElementById('blacklist');

    const whitelistInput = document.getElementById('whitelist-input');
    const addWhitelistButton = document.getElementById('add-whitelist');
    const whitelistList = document.getElementById('whitelist');

    loadLists(blacklistList, whitelistList);

    addBlacklistButton.addEventListener('click', function () {
        addSiteToList(blacklistInput, blacklistList, 'blacklist');
    });

    addWhitelistButton.addEventListener('click', function () {
        addSiteToList(whitelistInput, whitelistList, 'whitelist');
    });
}

function loadLists(blacklistList, whitelistList) {
    chrome.storage.local.get(['blacklist', 'whitelist'], function (result) {
        const fullBlacklist = mergeLists(defaultBlockedSites, result.blacklist || []);
        displayList(fullBlacklist, blacklistList, 'blacklist', true);
        displayList(result.whitelist || [], whitelistList, 'whitelist', false);

        // Save the updated blacklist to ensure defaults are always included
        chrome.storage.local.set({ blacklist: fullBlacklist });
    });
}

function addSiteToList(inputElement, listElement, listType) {
    const site = inputElement.value.trim().toLowerCase();
    if (site && (!defaultBlockedSites.includes(site) || listType === 'whitelist')) {
        addListItem(site, listElement, listType, false);
        saveSiteToStorage(site, listType);
        inputElement.value = '';
    }
}

function displayList(list, listElement, listType, isDefaultList) {
    list.forEach(site => addListItem(site, listElement, listType, isDefaultList && defaultBlockedSites.includes(site)));
}

function addListItem(site, listElement, listType, isDefault) {
    const li = document.createElement('li');
    li.textContent = site;
    if (!isDefault) {
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function () {
            listElement.removeChild(li);
            removeSiteFromStorage(site, listType);
        });
        li.appendChild(removeButton);
    }
    listElement.appendChild(li);
}

function saveSiteToStorage(site, listType) {
    chrome.storage.local.get([listType], function (result) {
        const updatedList = mergeLists(result[listType] || [], [site]);
        chrome.storage.local.set({ [listType]: updatedList });
    });
}

function removeSiteFromStorage(site, listType) {
    chrome.storage.local.get([listType], function (result) {
        const updatedList = result[listType].filter(s => s !== site);
        chrome.storage.local.set({ [listType]: updatedList });
    });
}

function mergeLists(defaultList, customList) {
    return [...new Set([...defaultList, ...customList])];
}
