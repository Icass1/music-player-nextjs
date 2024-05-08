import React, { useContext, useEffect, useRef, useState } from 'react';
import { MediaPlayerContext } from '@/app/components/audioContext';

export default function Equalizer({ className, bar_count = 20, bar_gap = 1, centered=false, toggleCenter=true }) {
    const canvasRef = useRef(null);
    const requestRef = useRef()

    const [updateFunc, setUpdateFunc] = useState(centered ? (1) : (0));

    const {
        analyser
    } = useContext(MediaPlayerContext);

    useEffect(() => {
        if (!toggleCenter) {return}

        canvasRef.current.onclick = function () {
            if (updateFunc == 0) { setUpdateFunc(1) }
            else if (updateFunc == 1) { setUpdateFunc(0) }
        }

    }, [updateFunc]);

    useEffect(() => {
        cancelAnimationFrame(requestRef.current)
        update()
    }, [analyser, updateFunc]); // Re-render when updateFunction changes

    function update() {
        requestRef.current = requestAnimationFrame(update);

        if (updateBottom == undefined || updateCentered == undefined) {
            return
        }

        if (updateFunc == 0) {
            updateBottom();
        } else if (updateFunc == 1) {
            updateCentered()
        }
    }

    function updateCentered() {

        if (canvasRef.current == null) { return }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // const bar_count = 20;
        // const bar_gap = 2;

        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        if (!analyser) return;

        let fbc_array = new Uint8Array(analyser.frequencyBinCount);

        const bar_width = (ctx.canvas.width - (bar_count - 1) * bar_gap) / bar_count;

        analyser.getByteFrequencyData(fbc_array);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const r = 202;
        const g = 129;
        const b = 4;

        fbc_array = fbc_array.slice(0, 700)

        const groupedFrequencies = groupFrequencies(fbc_array, bar_count);
        for (let i = 0; i < bar_count; i++) {

            ctx.fillStyle = `rgb(${r / (i / (bar_count - 1) + 1)} ${g / (i / (bar_count - 1) + 1)} ${b / (i / (bar_count - 1) + 1)})`

            const bar_pos = bar_width * i + bar_gap * i;
            const bar_height = groupedFrequencies[i] / 255 * canvas.height;

            ctx.fillRect(bar_pos, canvas.height / 2 - bar_height / 2, bar_width, bar_height);
        }
    }

    function updateBottom() {

        // console.log(analyser)

        if (canvasRef.current == null) { return }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // const bar_count = 20;
        // const bar_gap = 2;

        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        if (!analyser) return;

        let fbc_array = new Uint8Array(analyser.frequencyBinCount);

        const bar_width = (ctx.canvas.width - (bar_count - 1) * bar_gap) / bar_count;

        analyser.getByteFrequencyData(fbc_array);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const r = 202;
        const g = 129;
        const b = 4;

        fbc_array = fbc_array.slice(0, 700)

        const groupedFrequencies = groupFrequencies(fbc_array, bar_count);
        for (let i = 0; i < bar_count; i++) {

            ctx.fillStyle = `rgb(${r / (i / (bar_count - 1) + 1)} ${g / (i / (bar_count - 1) + 1)} ${b / (i / (bar_count - 1) + 1)})`

            const bar_pos = bar_width * i + bar_gap * i;
            const bar_height = -groupedFrequencies[i] / 255 * canvas.height;

            ctx.fillRect(bar_pos, canvas.height, bar_width, bar_height);
        }
    }

    // Utility function to group frequencies
    function groupFrequencies(frequencies, numberOfGroups) {
        const chunkSize = frequencies.length / numberOfGroups;
        const groupedFrequencies = [];
        for (let i = 0; i < frequencies.length; i += chunkSize) {
            const chunk = frequencies.slice(i, i + chunkSize);
            let chunkAverage = 0;
            for (const value of chunk) {
                chunkAverage += value / chunk.length;
            }
            groupedFrequencies.push(chunkAverage);
        }
        return groupedFrequencies;
    }

    // Render the canvas
    return <canvas className={className} ref={canvasRef} id="equalizer"></canvas>;
};

