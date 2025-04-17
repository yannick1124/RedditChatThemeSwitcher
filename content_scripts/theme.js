browser.runtime.onMessage.addListener(updateTheme);

function updateTheme(req, sender, sendRes) {
  document.documentElement.className = `theme-beta theme-${req.theme}`;
}