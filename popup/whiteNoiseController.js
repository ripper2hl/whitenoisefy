( (browser) => {
  'use strict';

  document.addEventListener('click', e => {
    if ( e.target.classList.contains("button") ) {
      let action = e.target.textContent;
      browser.tabs.query({active: true, currentWindow: true}
        , tabs => browser.runtime.sendMessage( { action: action } ));
    }
  });

})(window.browser || window.chrome);
