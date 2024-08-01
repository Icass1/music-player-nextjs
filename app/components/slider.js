
import { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import classNames from 'classnames';

const GlobalStyles = createGlobalStyle`
.default-slider[mouseover]::-webkit-slider-thumb {
    height: 8px;
    width: 8px;
}

.default-slider[mouseover]::-moz-range-thumb {
    height: 8px;
    width: 8px;
}

.default-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: rgb(150 150 150);
    height: 0.4rem;
    width: 0.4rem;
    border-radius: 100%;
}
.default-slider::-moz-range-thumb {
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
                className={classNames(className, 'default-slider min-w-0 w-full h-[0.4rem] rounded-full appearance-none')}
                {...(mouseOver ? {
                    style: { background: `linear-gradient(90deg, rgb(${getComputedStyle(document.body).getPropertyValue("--foreground-1")}) 0%, rgb(${getComputedStyle(document.body).getPropertyValue("--foreground-2")}) calc(0.2rem + (100% - 0.4rem)*${value}), black calc(0.2rem + (100% - 0.4rem)*${value}), black 100%)` }
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