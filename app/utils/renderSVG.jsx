import Image from "next/image";
import { useEffect, useState } from "react";


export default function SVG({ src, height, width, color, className, onClick, title }) {

    const [svgContent, setSvgContent] = useState('');

    const [data, setData] = useState('')

    useEffect(() => {
        fetch(src).then(response => response.text()).then(data => {
            setData(data)
        })
    }, [src])

    useEffect(() => {

        let updatedSvgText;
        if (color == undefined) {
            updatedSvgText = data;
        } else {
            updatedSvgText = data.replace(/#000000/g, color);
        }

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(updatedSvgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        // Modify the width and height
        if (svgElement) {
            svgElement.setAttribute('width', width);
            svgElement.setAttribute('height', height);
            setSvgContent(svgElement.outerHTML);
        }
    }, [width, height, color, data])

    return (
        <div className={className} title={title} style={{ height: height, width: width, position: "relative" }} >
            <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} style={{ height: height, width: width, position: "absolute" }}/>
            <div className={className} title={title} style={{ height: height, width: width, position: "absolute" }} onClick={onClick} ></div>
        </div>
    )
}