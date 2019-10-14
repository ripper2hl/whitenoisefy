(() => {
    'use strict';
    const BUFFER_SIZE = 8192;
    const noises = [{
            name: 'White',
            control: createWhiteNoise()
        },
        {
            name: 'Pink',
            control: createPinkNoise()
        },
        {
            name: 'Brown',
            control: createBrownNoise()
        }
    ];

    function whitenoisefy(request, sender, sendResponse) {
        if (request.action === 'stop') {
            stop();
        } else {
            play(request.action);
        }
    }


    browser.runtime.onMessage.addListener(whitenoisefy);

    function createWhiteNoise(bufferSize) {
        let control = {};
        let audioContext = new window.AudioContext();
        bufferSize = bufferSize || BUFFER_SIZE;
        let node = audioContext.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }

        control.play = () => node.connect(audioContext.destination);
        control.stop = () => node.disconnect();
        return control;
    }

    function createPinkNoise(bufferSize) {
        let control = {};
        let audioContext = new window.AudioContext();
        bufferSize = bufferSize || BUFFER_SIZE;
        var b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        let node = audioContext.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        }
        control.play = () => node.connect(audioContext.destination);
        control.stop = () => node.disconnect();
        return control;
    }

    function createBrownNoise(bufferSize) {
        let control = {};
        let audioContext = new window.AudioContext();
        bufferSize = bufferSize || BUFFER_SIZE;
        let lastOut = 0.0;
        let node = audioContext.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        }
        control.play = () => node.connect(audioContext.destination);
        control.stop = () => node.disconnect();
        return control;
    }

    function play(nameSound) {
        let soundSelected;
        noises.forEach((noise, index) => {
            if (noise.name === nameSound) {
                soundSelected = index;
            } else {
                noise.control.stop();
            }
        });
        noises[soundSelected].control.play();
    }

    function stop() {
        noises.forEach(noise => noise.control.stop());
    }

    /**
     * Fired when a registered command is activated using a keyboard shortcut.
     * In this sample extension, there is only one registered command: "Ctrl+Shift+U".
     * On Mac, this command will automatically be converted to "Command+Shift+U".
     */
    browser.commands.onCommand.addListener((command) => {
        if (command === 'play-white-noise') {
            play('White');
        } else if (command === 'play-pink-noise') {
            play('Pink');
        } else if (command === 'play-brown-noise') {
            play('Brown');
        } else {
            stop();
        }
    });

})();
