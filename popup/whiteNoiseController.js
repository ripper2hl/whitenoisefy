document.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    var action = e.target.textContent;
    browser.tabs.executeScript(null, { 
      file: "/content_scripts/whitenoisefy.js" 
    });

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { action: action });
    });
  }
});
