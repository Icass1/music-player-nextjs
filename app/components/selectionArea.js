import React, { useState, useEffect, useContext, useRef, useCallback, cloneElement } from 'react';

export default function SelectionArea({ children }) {

    const [initialPos, setInitialPos] = useState(null);
    const [pos, setPos] = useState([0, 0]);
    const [size, setSize] = useState([0, 0]);

    const mainRef = useRef();
    const initialPosRef = useRef(pos);
    const childRefs = useRef([]);
    const childOnSelectRefs = useRef([]);

    useEffect(() => {
        initialPosRef.current = initialPos;
    }, [initialPos]);

    const handleMouseDown = (e) => {
        console.log(e)

        if (e.button != 0) { return }
        setInitialPos([e.clientX, e.clientY])
        for (let index in childRefs.current) {
            childRefs.current[index].removeAttribute("data-selected")
        }
    }

    const handleMouseMove = (e) => {
        if (e.button != 0) { return }

        if (initialPosRef.current == null) { return }

        const boundingRect = mainRef.current.getBoundingClientRect();

        let width = Math.abs(e.clientX - initialPosRef.current[0])
        let height = Math.abs(e.clientY - initialPosRef.current[1])
        let xPos = Math.min(e.clientX, initialPosRef.current[0])
        let yPos = Math.min(e.clientY, initialPosRef.current[1])

        setSize([width, height])
        setPos([xPos, yPos])

        for (let index in childRefs.current) {
            let childBoundings = childRefs.current[index].getBoundingClientRect()

            if (
                childBoundings.x < xPos + width &&
                childBoundings.x + childBoundings.width > xPos &&
                childBoundings.y < yPos + height &&
                childBoundings.y + childBoundings.height > yPos
            ) {
                childRefs.current[index].setAttribute("data-selected", "true")
            } else {
                childRefs.current[index].removeAttribute("data-selected")
            }
        }
    }

    const handleMouseUp = () => {
        setInitialPos(null)
        setPos([0, 0])
        setSize([0, 0])
    }

    useEffect(() => {
        if (!mainRef.current) { return }

        mainRef.current.addEventListener("mousedown", handleMouseDown)
        mainRef.current.addEventListener("mousemove", handleMouseMove)
        mainRef.current.addEventListener("mouseup", handleMouseUp)

        return () => {
            if (mainRef.current == null) {return}
            mainRef.current.removeEventListener("mousedown", handleMouseDown)
            mainRef.current.removeEventListener("mousemove", handleMouseMove)
            mainRef.current.removeEventListener("mouseup", handleMouseUp)
        }

    }, [mainRef])

    let refIndex = -1;

    // Function to apply the style to all children
    const applyStyleToChildren = (children) => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {

                // console.log(child.props)

                let newProps = {
                    ...child.props,
                    // style: { ...child.props.style, userSelect: 'none' },
                    children: applyStyleToChildren(child.props.children),
                };

                console.log(child.props.ref)

                if (child.props.selectable === '') {
                    refIndex++;
                    const currentRefIndex = refIndex;
                    newProps.ref = (el) => { childRefs.current[currentRefIndex] = el };
                }

                // console.log(newProps)

                return cloneElement(child, newProps);
            }
            return child;
        });
    };

    let a = applyStyleToChildren(children)
    // let a = children

    console.log(a)

    return (
        <div ref={mainRef} id="TESTREMOVE">
            <div className='fixed bg-[#4645456e] border-neutral-400 rounded-sm border-[1px] border-solid' style={{ left: pos[0], top: pos[1], width: size[0], height: size[1] }}></div>
            {a}
        </div>
    )
}
