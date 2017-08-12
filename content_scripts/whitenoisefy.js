( () => {
  'use strict';
  const BUFFER_SIZE = 4096;
  let audioContext = new window.AudioContext();
  let whiteNoise = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
  whiteNoise.onaudioprocess = audioProcess;

  function whitenoisefy(request, sender, sendResponse){
  	if(request.action === 'play'){
  		whiteNoise.connect(audioContext.destination);
  	}else{
  		whiteNoise.disconnect();
  	}
  }

  function audioProcess(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < BUFFER_SIZE; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  browser.runtime.onMessage.addListener(whitenoisefy);
})();
