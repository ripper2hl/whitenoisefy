( function () {
  'use strict';
  var bufferSize = 4096;
  var audioContext = new window.AudioContext();
  var whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
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
      for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
      }
  }

  browser.runtime.onMessage.addListener(whitenoisefy);
})();
