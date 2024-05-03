

import { useState } from 'react';
// import '../components/slider.css';
// import _JSXStyle from 'styled-jsx/style'
import styled, { createGlobalStyle } from 'styled-components';

export default function Slider({ value, setValue }) {

    const [mouseOver, setMouseOver] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const sliderMouseEnter = () => {
        setMouseOver(true)
    }
    const sliderMouseLeave = () => {
        setMouseOver(false)
    }

    const sliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    // const Input = styled.input.attrs((/* props */) => ({ tabIndex: 0 }))`
    //     &[mouseover]::-webkit-slider-thumb {
    //         /* -webkit-appearance: none; */
    //         /* background-color: rgb(150 150 150); */
    //         height: 8px;
    //         width: 8px;

    //         /* border-radius: 100%; */
    //     }

    //     &::-webkit-slider-thumb {
    //         -webkit-appearance: none;
    //         background-color: rgb(150 150 150);
    //         height: 0.4rem;
    //         width: 0.4rem;
    //         border-radius: 100%;
    //     }
    // `


    const Input = () => ( <input
        {...mouseOver && { mouseover: '' }}
        id='current-time-slider'
        type='range'
        className='min-w-0 w-full h-[0.4rem] rounded-full appearance-none'
        {...(mouseOver ? {
            style: { background: `linear-gradient(90deg, #ca8a04 0%, #ca8a04 calc(0.2rem + (100% - 0.4rem)*${sliderValue}), black calc(0.2rem + (100% - 0.4rem)*${sliderValue}), black 100%)` }
        } : {
            style: { background: `linear-gradient(90deg, rgb(150, 150, 150) 0%, rgb(150, 150, 150) calc(0.2rem + (100% - 0.4rem)*${sliderValue}), black calc(0.2rem + (100% - 0.4rem)*${sliderValue}), black 100%)` }
        })}
        min='0'
        max='1'
        value={sliderValue}
        step='0.005'
        // onInput={onInput}
        onMouseEnter={sliderMouseEnter}
        onMouseLeave={sliderMouseLeave}
        onChange={sliderChange}
    />)

    const StyledInput = styled(Input)`
        &[mouseover]::-webkit-slider-thumb {
            /* -webkit-appearance: none; */
            /* background-color: rgb(150 150 150); */
            height: 8px;
            width: 8px;
            /* border-radius: 100%; */
        }
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            background-color: rgb(150 150 150);
            height: 0.4rem;
            width: 0.4rem;
            border-radius: 100%;
        }   
    `



    return (
        <StyledInput/>

    )
}