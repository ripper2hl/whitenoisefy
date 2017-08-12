( () => {
  'use strict';

  document.addEventListener('click', e => {
    if ( e.target.classList.contains("button") ) {
      let action = e.target.textContent;
      let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
      gettingActiveTab.then( tabs => browser.runtime.sendMessage( { action: action } ) );
    }
  });

})();
