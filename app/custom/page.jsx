
'use client'

import { useCallback, useContext, useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import SVG from "../utils/renderSVG";


function Sliders({ initialColor, setColor }) {

    const [red, setRed] = useState(initialColor[0]);
    const [green, setGreen] = useState(initialColor[1]);
    const [blue, setBlue] = useState(initialColor[2]);


    useEffect(() => {
        // console.log(initialColor)

        setRed(initialColor[0])
        setGreen(initialColor[1])
        setBlue(initialColor[2])

    }, [initialColor])

    const handleRed = useCallback((e) => {
        const newRed = Number(e.target.value)
        setRed(newRed)
        setColor([newRed, green, blue])

    }, [green, blue, setColor])

    const handleGreen = useCallback((e) => {
        const newGreen = Number(e.target.value)
        setGreen(newGreen)
        setColor([red, newGreen, blue])
    }, [red, blue, setColor])

    const handleBlue = useCallback((e) => {
        const newBlue = Number(e.target.value)
        setBlue(newBlue)
        setColor([red, green, newBlue])
    }, [red, green, setColor])

    return (
        <>
            <div className="flex flex-row gap-4 items-center">
                <label className="w-14">Red</label>
                <input
                    type="range"
                    className="custom-slider appearance-none rounded-full"
                    style={{ background: `linear-gradient(90deg, rgb(0, ${green}, ${blue}) 0%, rgb(255, ${green}, ${blue}) 100%` }}
                    value={red}
                    onChange={handleRed}
                    min={0}
                    max={255}
                />
                <label className="w-10">{red}</label>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <label className="w-14">Green</label>
                <input
                    type="range"
                    className="custom-slider appearance-none rounded-full"
                    style={{ background: `linear-gradient(90deg, rgb(${red}, 0, ${blue}) 0%, rgb(${red}, 255, ${blue}) 100%` }}
                    value={green}
                    onChange={handleGreen}
                    min={0}
                    max={255}
                />
                <label className="w-10">{green}</label>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <label className="w-14">Blue</label>
                <input
                    type="range"
                    className="custom-slider appearance-none rounded-full"
                    style={{ background: `linear-gradient(90deg, rgb(${red}, ${green}, 0) 0%, rgb(${red}, ${green}, 255) 100%` }}
                    value={blue}
                    onChange={handleBlue}
                    min={0}
                    max={255}
                />
                <label className="w-10">{blue}</label>
            </div>
        </>
    )

}


const GlobalStyles = createGlobalStyle`

.custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: rgb(150 150 150);
    height: 1rem;
    width: 1rem;
    border-radius: 100%;
}
.custom-slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;

    background: rgb(150 150 150);
    height: 1rem;
    width: 1rem;
    border-radius: 100%;
}
`;

export default function Custom() {

    const [background1, setBackground1] = useState([0, 0, 0])
    const [background2, setBackground2] = useState([0, 0, 0])
    const [background3, setBackground3] = useState([0, 0, 0])
    const [foreground1, setForeground1] = useState([0, 0, 0])
    const [foreground2, setForeground2] = useState([0, 0, 0])

    useEffect(() => {
        setBackground1(getComputedStyle(document.body).getPropertyValue("--background-1").split(" ").map(value => Number(value)))
        setBackground2(getComputedStyle(document.body).getPropertyValue("--background-2").split(" ").map(value => Number(value)))
        setBackground3(getComputedStyle(document.body).getPropertyValue("--background-3").split(" ").map(value => Number(value)))
        setForeground1(getComputedStyle(document.body).getPropertyValue("--foreground-1").split(" ").map(value => Number(value)))
        setForeground2(getComputedStyle(document.body).getPropertyValue("--foreground-2").split(" ").map(value => Number(value)))
    }, [])

    const handleApply = useCallback(() => {
        document.documentElement.style.setProperty('--background-1', background1.join(" "))
        document.documentElement.style.setProperty('--background-2', background2.join(" "))
        document.documentElement.style.setProperty('--background-3', background3.join(" "))
        document.documentElement.style.setProperty('--foreground-1', foreground1.join(" "))
        document.documentElement.style.setProperty('--foreground-2', foreground2.join(" "))
    }, [background1, background2, background3, foreground1, foreground2])

    return (
        <>
            <GlobalStyles />
            <div className="flex flex-col items-center gap-4 mt-4  mb-4">
                <label>Background 1</label>
                <Sliders initialColor={background1} setColor={setBackground1} />
                <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}></div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4  mb-4">
                <label>Background 2</label>
                <Sliders initialColor={background2} setColor={setBackground2} />
                <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}>
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: '4px',
                            bottom: '50%',
                        }}
                    />
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: 'calc(20% + 4px)',
                            right: '4px',
                            top: '4px',
                            bottom: '4px',
                        }}
                    />
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: 'calc(50% + 4px)',
                            bottom: '4px',
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4 mb-4">
                <label>Background 3</label>
                <Sliders initialColor={background3} setColor={setBackground3} />
                <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}>
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: '4px',
                            bottom: '50%',
                        }}
                    />
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: 'calc(20% + 4px)',
                            right: '4px',
                            top: '4px',
                            bottom: '4px',
                        }}
                    >
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '1%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        />

                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '34%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        />
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '67%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        />

                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '1%',
                                top: '28px',
                                height: '20px',
                                width: '32%'
                            }}
                        />

                    </div>
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: 'calc(50% + 4px)',
                            bottom: '4px',
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4  mb-4">
                <label>Foreground 1</label>
                <Sliders initialColor={foreground1} setColor={setForeground1} />
                <div className="flex flex-row gap-3">



                    <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}>
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: '4px',
                                right: '80%',
                                top: '4px',
                                bottom: '50%',
                            }}
                        />

                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: 'calc(20% + 4px)',
                                right: '4px',
                                top: '4px',
                                bottom: '4px',
                            }}
                        >
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                    left: '1%',
                                    top: '4px',
                                    height: '20px',
                                    width: '32%'
                                }}
                            >
                                <div
                                    className="absolute rounded-sm"
                                    style={{
                                        background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                        left: '4px',
                                        right: '60%',
                                        top: '4px',
                                        bottom: '50%',
                                    }}
                                />
                            </div>

                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                    left: '34%',
                                    top: '4px',
                                    height: '20px',
                                    width: '32%'
                                }}
                            >
                                <div
                                    className="absolute rounded-sm"
                                    style={{
                                        background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                        left: '4px',
                                        right: '50%',
                                        top: '4px',
                                        bottom: '50%',
                                    }}
                                />
                            </div>
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                    left: '67%',
                                    top: '4px',
                                    height: '20px',
                                    width: '32%'
                                }}
                            >
                                <div
                                    className="absolute rounded-sm"
                                    style={{
                                        background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                        left: '4px',
                                        right: '30%',
                                        top: '4px',
                                        bottom: '50%',
                                    }}
                                />
                            </div>

                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                    left: '1%',
                                    top: '28px',
                                    height: '20px',
                                    width: '32%'
                                }}
                            >
                                <div
                                    className="absolute rounded-sm"
                                    style={{
                                        background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                        left: '4px',
                                        right: '20%',
                                        top: '4px',
                                        bottom: '50%',
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: '4px',
                                right: '80%',
                                top: 'calc(50% + 4px)',
                                bottom: '4px',
                            }}
                        />
                    </div>
                    <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}>
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: '4px',
                                right: '80%',
                                top: '4px',
                                bottom: '50%',
                            }}
                        />
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `linear-gradient(180deg, rgb(93 42 48) 0%, rgb(${background2[0]}, ${background2[1]}, ${background2[2]}) 90%, rgb(${background2[0]}, ${background2[1]}, ${background2[2]}) 100%)`,
                                // background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: 'calc(20% + 4px)',
                                right: '4px',
                                top: '4px',
                                bottom: '4px',
                            }}
                        >
                            <div
                                className="absolute bg-rose-400 rounded-sm"
                                style={{
                                    left: '4px',
                                    top: '4px',
                                    height: '50px',
                                    width: '50px',
                                }}
                            />
                            <div
                                className="absolute rounded-full"
                                style={{
                                    background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                    left: '58px',
                                    top: '10px',
                                    height: '16px',
                                    width: '16px',
                                }}
                            >
                                <SVG
                                    className='relative ml-auto mr-auto top-1/2 -translate-y-1/2'

                                    src='https://api.music.rockhosting.org/images/play.svg'
                                    height={10}
                                    width={10}
                                    color='black'
                                />
                            </div>
                            <div
                                className="absolute rounded-sm bg-neutral-200"
                                style={{
                                    left: '58px',
                                    top: '30px',
                                    height: '8px',
                                    width: '30px',
                                }}
                            />
                            <div
                                className="absolute rounded-sm bg-neutral-400"
                                style={{
                                    left: '58px',
                                    top: '40px',
                                    height: '6px',
                                    width: '30px',
                                }}
                            />
                        </div>
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                                left: '4px',
                                right: '80%',
                                top: 'calc(50% + 4px)',
                                bottom: '4px',
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4  mb-4">
                <label>Foreground 2</label>
                <Sliders initialColor={foreground2} setColor={setForeground2} />
                <div className="relative w-96 h-52 rounded-md" style={{ background: `rgb(${background1[0]}, ${background1[1]}, ${background1[2]})` }}>

                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: '4px',
                            bottom: '50%',
                        }}
                    />

                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: 'calc(20% + 4px)',
                            right: '4px',
                            top: '4px',
                            bottom: '4px',
                        }}
                    >
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '1%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        >
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                    left: '4px',
                                    right: '60%',
                                    top: '4px',
                                    bottom: '50%',
                                }}
                            />
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground2[0]}, ${foreground2[1]}, ${foreground2[2]})`,
                                    left: '4px',
                                    right: '40%',
                                    top: 'calc(50% + 2px)',
                                    bottom: '4px',
                                }}
                            />
                        </div>

                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '34%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        >
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                    left: '4px',
                                    right: '70%',
                                    top: '4px',
                                    bottom: '50%',
                                }}
                            />
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground2[0]}, ${foreground2[1]}, ${foreground2[2]})`,
                                    left: '4px',
                                    right: '20%',
                                    top: 'calc(50% + 2px)',
                                    bottom: '4px',
                                }}
                            />
                        </div>
                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '67%',
                                top: '4px',
                                height: '20px',
                                width: '32%'
                            }}
                        >
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                    left: '4px',
                                    right: '30%',
                                    top: '4px',
                                    bottom: '50%',
                                }}
                            />
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground2[0]}, ${foreground2[1]}, ${foreground2[2]})`,
                                    left: '4px',
                                    right: '40%',
                                    top: 'calc(50% + 2px)',
                                    bottom: '4px',
                                }}
                            />                        </div>

                        <div
                            className="absolute rounded-sm"
                            style={{
                                background: `rgb(${background3[0]}, ${background3[1]}, ${background3[2]})`,
                                left: '1%',
                                top: '28px',
                                height: '20px',
                                width: '32%'
                            }}
                        >
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground1[0]}, ${foreground1[1]}, ${foreground1[2]})`,
                                    left: '4px',
                                    right: '20%',
                                    top: '4px',
                                    bottom: '50%',
                                }}
                            />
                            <div
                                className="absolute rounded-sm"
                                style={{
                                    background: `rgb(${foreground2[0]}, ${foreground2[1]}, ${foreground2[2]})`,
                                    left: '4px',
                                    right: '60%',
                                    top: 'calc(50% + 2px)',
                                    bottom: '4px',
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="absolute rounded-sm"
                        style={{
                            background: `rgb(${background2[0]}, ${background2[1]}, ${background2[2]})`,
                            left: '4px',
                            right: '80%',
                            top: 'calc(50% + 4px)',
                            bottom: '4px',
                        }}
                    />
                </div>
            </div>
            <button className="relative block ml-auto mr-auto mt-4 mb-4 bg-neutral-800 p-3 pl-6 pr-6 rounded-lg text-green-300" onClick={handleApply}>Apply</button>
            <div className="flex flex-col ml-auto mr-auto w-fit gap-1 mt-20 mb-4 bg-neutral-800 p-3 rounded-lg">
                <label>--background-1: <label style={{ color: 'rgb(180, 133, 137)' }}>{background1.join(' ')}</label>;</label>
                <label>--background-2: <label style={{ color: 'rgb(180, 133, 137)' }}>{background2.join(' ')}</label>;</label>
                <label>--background-3: <label style={{ color: 'rgb(180, 133, 137)' }}>{background3.join(' ')}</label>;</label>
                <label>--foreground-1: <label style={{ color: 'rgb(180, 133, 137)' }}>{foreground1.join(' ')}</label>;</label>
                <label>--foreground-2: <label style={{ color: 'rgb(180, 133, 137)' }}>{foreground2.join(' ')}</label>;</label>
            </div>
        </>
    )
}
