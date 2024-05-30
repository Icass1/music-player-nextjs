
import { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import classNames from 'classnames';

const GlobalStyles = createGlobalStyle`
.custom-slider[mouseover]::-webkit-slider-thumb {
    height: 8px;
    width: 8px;
}

.custom-slider[mouseover]::-moz-range-thumb {
    height: 8px;
    width: 8px;
}

.custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: rgb(150 150 150);
    height: 0.4rem;
    width: 0.4rem;
    border-radius: 100%;
}
.custom-slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;

    background: rgb(150 150 150);
    height: 0.3rem;
    width: 0.3rem;
    border-radius: 100%;
}

`;

export default function Slider({ value, onInput, onChange, className }) {

    const [mouseOver, setMouseOver] = useState(false);

    const sliderMouseEnter = () => {
        setMouseOver(true)
    }
    const sliderMouseLeave = () => {
        setMouseOver(false)
    }

    return (
        <>
            <GlobalStyles />
            <input
                {...mouseOver && { mouseover: '' }}
                // id={id}
                type='range'
                className={classNames(className, 'custom-slider min-w-0 w-full h-[0.4rem] rounded-full appearance-none')}
                {...(mouseOver ? {
                    style: { background: `linear-gradient(90deg, #ca8a04 0%, #ca8a04 calc(0.2rem + (100% - 0.4rem)*${value}), black calc(0.2rem + (100% - 0.4rem)*${value}), black 100%)` }
                } : {
                    style: { background: `linear-gradient(90deg, rgb(150, 150, 150) 0%, rgb(150, 150, 150) calc(0.2rem + (100% - 0.4rem)*${value}), black calc(0.2rem + (100% - 0.4rem)*${value}), black 100%)` }
                })}
                min='0'
                max='1'
                value={value}
                step='0.005'
                onInput={onInput}
                onMouseEnter={sliderMouseEnter}
                onMouseLeave={sliderMouseLeave}
                onChange={onChange}
            />
        </>
    )
}