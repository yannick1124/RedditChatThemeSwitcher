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

let button = document.querySelector('.theme-container button.theme-button');
let cookieValue = { theme: '' };

function changeColors() {
  getCookies().then((cookie) => {
    if (cookie) {
      cookieValue = JSON.parse(cookie.value);
      let style = document.body.style;
      let div = document.querySelector('.current-theme');
      if (cookieValue.theme == 'dark') {
        style.backgroundColor = 'black';
        style.color = 'white';
        div.textContent = 'dark';
      }
      else {
        style.backgroundColor = 'white';
        style.color = 'black';
        div.textContent = 'light';
      }
    }
  });
}

changeColors();

button.onclick = (e) => {
  getActiveTab().then((tabs) => {

    switch (cookieValue.theme) {
      case 'light':
        cookieValue.theme = 'dark';
        break;
      case 'dark':
      default:
        cookieValue.theme = 'light';
        break;
    }

    browser.cookies.set({
      url: tabs[0].url,
      name: 'redditTheme',
      value: JSON.stringify(cookieValue)
    });

    changeColors();
  });
}

browser.cookies.onChanged.addListener((changeInfo) => {
  console.log(`Cookie changed:\n
              * Cookie: ${JSON.stringify(changeInfo.cookie)}\n
              * Cause: ${changeInfo.cause}\n
              * Removed ${changeInfo.removed}`);
});