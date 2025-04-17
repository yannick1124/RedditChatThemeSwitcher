function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function getCookies() {
  return getActiveTab().then((tabs) => {
    return browser.cookies.get({
      url: tabs[0].url,
      name: 'redditTheme'
    });
  });
}

function cookieUpdate() {
  getActiveTab().then((tabs) => {
    getCookies().then((cookie) => {
      if (cookie) {
        let cookieValue = JSON.parse(cookie.value);
        browser.tabs.sendMessage(tabs[0].id, { theme: cookieValue.theme });
      }
    });
  });
}