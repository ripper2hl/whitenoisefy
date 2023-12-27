((browser) => {
    'use strict';

    const BUFFER_SIZE = 8192;
    const VOLUME_STEP = 0.1; // Ajusta según tus necesidades
    let globalVolume = 1.0; // Volumen global

    const noises = [
        { name: 'white', control: createNoiseGenerator('white') },
        { name: 'pink', control: createNoiseGenerator('pink') },
        { name: 'brown', control: createNoiseGenerator('brown') }
    ];

    function whitenoisefy(request, sender, sendResponse) {
        if (request.action === 'stop') {
            stop();
        } else if (request.action === 'volumeUp') {
            volumeUp();
        } else if (request.action === 'volumeDown') {
            volumeDown();
        } else {
            play(request.action);
        }
    }

    browser.runtime.onMessage.addListener(whitenoisefy);

    function createNoiseGenerator(type, bufferSize = 8192) {
        let control = {};
        let audioContext = new window.AudioContext();
        let node = audioContext.createScriptProcessor(bufferSize, 1, 1);

        let noiseFunction;

        if (type === 'white') {
            noiseFunction = createWhiteNoiseGenerator();
        } else if (type === 'pink') {
            noiseFunction = createPinkNoiseGenerator();
        } else if (type === 'brown') {
            noiseFunction = createBrownNoiseGenerator();
        }

        node.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = noiseFunction() * globalVolume;
            }
        };

        control.play = () => node.connect(audioContext.destination);
        control.stop = () => node.disconnect();

        return control;
    }

    function createWhiteNoiseGenerator() {
        return function () {
            return Math.random() * 2 - 1;
        };
    }

    function createPinkNoiseGenerator() {
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

        return function () {
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
        };
    }

    function createBrownNoiseGenerator() {
        let lastOut = 0.0;

        return function () {
            const white = Math.random() * 2 - 1;
            const brownValue = (lastOut + (0.02 * white)) / 1.02;
            lastOut = brownValue;
            return brownValue * 3.5; // (roughly) compensate for gain
        };
    }

    function volumeUp() {
        globalVolume = Math.min(1.0, globalVolume + VOLUME_STEP);
    }

    function volumeDown() {
        globalVolume = Math.max(0.0, globalVolume - VOLUME_STEP);
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

    browser.commands.onCommand.addListener((command) => {
        if (command === 'play-white-noise') {
            play('white');
        } else if (command === 'play-pink-noise') {
            play('pink');
        } else if (command === 'play-brown-noise') {
            play('brown');
        } else {
            stop();
        }
    });

})(window.browser || window.chrome);
