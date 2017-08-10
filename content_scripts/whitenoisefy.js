var bufferSize = 4096;
var audioContext = new window.AudioContext();
whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
whiteNoise.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
	output[i] = Math.random() * 2 - 1;
    }
}

function whitenoisefy(request, sender, sendResponse){
	if(request.action === 'play'){
		whiteNoise.connect(audioContext.destination);
	}else{
		window.whiteNoise.disconnect()
	}
}

browser.runtime.onMessage.addListener(whitenoisefy);
