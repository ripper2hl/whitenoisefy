document.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    var action = e.target.textContent;
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.runtime.sendMessage( { action: action } );
    });
  }
});
