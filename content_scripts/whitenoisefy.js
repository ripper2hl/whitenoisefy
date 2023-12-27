((browser) => {
    'use strict';
    const BUFFER_SIZE = 8192;
    const noises = [{
            name: 'White',
            control: createNoiseGenerator('white')
        },
        {
            name: 'Pink',
            control: createNoiseGenerator('pink')
        },
        {
            name: 'Brown',
            control: createNoiseGenerator('brown')
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


    function createNoiseGenerator(type, bufferSize = 8192) {
        let control = {};
        let audioContext = new window.AudioContext();
        let node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        let lastOut = 0.0;
    
        node.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                if (type === 'white') {
                    output[i] = whiteNoise();
                } else if (type === 'pink') {
                    output[i] = pinkNoise();
                } else if (type === 'brown') {
                    output[i] = brownNoise();
                }
            }
        };
    
        control.play = () => node.connect(audioContext.destination);
        control.stop = () => node.disconnect();
    
        return control;
    
        // Functions for different types of noise
        function whiteNoise() {
            return Math.random() * 2 - 1;
        }
    
        function pinkNoise() {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            const pinkValue = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            b6 = white * 0.115926;
            return pinkValue * 0.11; // (roughly) compensate for gain
        }
    
        function brownNoise() {
            const white = Math.random() * 2 - 1;
            const brownValue = (lastOut + (0.02 * white)) / 1.02;
            lastOut = brownValue;
            return brownValue * 3.5; // (roughly) compensate for gain
        }
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

})(window.browser|| window.chrome);
