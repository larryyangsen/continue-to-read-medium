const go = document.getElementById('go');
go.style.border = 'none';
go.style.backgroundColor = '#fff';
go.style.color = '#000';
go.style.fontSize = '1.2em';
go.style.padding = '1.5em';
go.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const tab = tabs[0];
        let domain = new URL(tab.url).hostname;
        domain = domain.includes('medium.com') ? 'medium.com' : domain;
        const cookies = await chrome.cookies.getAll({ domain });
        const uidCookie = cookies.find((cookie) => cookie.name === 'uid');
        const protocol = uidCookie.secure ? 'https:' : 'http:';
        const cookieDomain = uidCookie.domain.startsWith('.') ? uidCookie.domain.substr(1) : uidCookie.domain;
        const cookieUrl = `${protocol}//${cookieDomain}${uidCookie.path}`;
        const mediumUrl = `${protocol}//medium.com/`;
        await chrome.cookies.remove({
            url: cookieUrl,
            name: uidCookie.name,
            storeId: uidCookie.storeId,
        });
        await chrome.cookies.remove({
            url: mediumUrl,
            name: uidCookie.name,
            storeId: uidCookie.storeId,
        });
        chrome.tabs.reload(tabs[0].id);
    });
});
