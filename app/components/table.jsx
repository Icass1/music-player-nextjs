import clsx from "clsx"
import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import { apiFetch } from "../utils/apiFetch";
import { getTime } from "../utils/getTime";


export function Table({ data, onSearch, limits, handleScroll }) {

    const search = useRef({});
    const scrollRef = useRef();


    const [rowShowing, setRowShowing] = useState('')


    useEffect(() => {

        if (!scrollRef.current) { return }

        const element = scrollRef.current

        // console.log(scrollRef.current, handleScroll)

        // console.log("ADD event listeners")
        scrollRef.current.addEventListener('scroll', handleScroll)

        return () => {
            // console.log('clean up')
            element.removeEventListener('scroll', handleScroll)
        }
    }, [scrollRef])





    return (
        <>
            {rowShowing == '' ?
                <></>
                :
                <RowMenu originalRowShowing={rowShowing} data={data} />
            }
            <div ref={scrollRef} className="overflow-scroll absolute top-8 left-0 right-2 bottom-2 rounded-lg" onClick={() => { rowShowing == '' ? '' : setRowShowing('') }}>
                <table className={clsx("h-fit transition-[opacity]", { 'opacity-25': rowShowing !== '' })}>
                    <thead className="sticky top-0 ">
                        <tr>
                            <td className="bg-1 border-b min-w-10 border-neutral-700 border-solid sticky top-0 left-0 z-10"></td>
                            {data.columns.map(column =>
                                <td key={column.name} className="bg-1 border-neutral-700 border border-solid min-w-52">
                                    <div className="m-1 flex flex-col">
                                        <label className="flex flex-row">
                                            <label className="ml-0 mr-auto">{column.name}</label>
                                            <label className="ml-auto mr-0">{column.type}</label>
                                        </label>
                                        <input className="bg-3 rounded-sm pl-1 pr2" placeholder={`Search by ${column.name}`} onInput={(e) => { search.current[column.name] = e.target.value; onSearch(search.current) }}></input>
                                    </div>
                                </td>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, index) =>
                            <tr key={row.id} className="hover:brightness-125" onDoubleClick={() => { setRowShowing(row) }}>
                                <td className="bg-1 min-w-10 text-center border-neutral-700 border-r border-solid sticky left-0">{index + 1 + limits.bottom}</td>
                                {data.columns.map(column =>
                                    <td key={column.name} className={clsx("bg-2 h-8 items-center", { 'bg-3': index % 2 == 1 })}>
                                        <label className=" max-w-96 block overflow-hidden ml-1 mr-1 text-nowrap">
                                            {row[column.name]?.toString()}
                                        </label>
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}


function RowMenu({ originalRowShowing, data }) {

    const [showRaw, setShowRaw] = useState(true)
    const [rowData, setRowData] = useState({})

    const [rowShowing, setRowShowing] = useState({ ...originalRowShowing })

    const [difference, setDifference] = useState({})

    useEffect(() => {
        if (originalRowShowing == '') { return }
        if ('current_list' in originalRowShowing) {
            setRowData(oldValue => {
                return {
                    ...oldValue, current_list: {
                        name: 'Loading',
                        author: 'Loading',
                    }
                }
            })
            apiFetch(`/api/list/${originalRowShowing['current_list']}`).then(response => response.json()).then(data => { setRowData(oldValue => { return { ...oldValue, current_list: data } }) })
        }
        if ('current_song' in originalRowShowing) {
            setRowData(oldValue => {
                return {
                    ...oldValue, current_list: {
                        title: 'Loading',
                        artist: 'Loading',
                    }
                }
            })
            apiFetch(`/api/song/info/${originalRowShowing['current_song']}`).then(response => response.json()).then(data => { setRowData(oldValue => { return { ...oldValue, current_song: data } }) })
        }

        if ('lists' in originalRowShowing) {
            JSON.parse(originalRowShowing.lists).map(list => {

                setRowData(oldValue => {
                    return {
                        ...oldValue,
                        lists: {
                            ...oldValue.lists,
                            [`${list}`]: {
                                name: 'Loading',
                                author: 'Loading',
                            }
                        }
                    }
                })

                apiFetch(`/api/list/${list}`).then(response => response.json()).then(data => {
                    setRowData(oldValue => {
                        return {
                            ...oldValue,
                            lists: {
                                ...oldValue.lists,
                                [`${list}`]: data
                            }
                        }
                    })
                })
            })
        }

        if ('songs' in originalRowShowing) {
            JSON.parse(originalRowShowing.songs).slice(0, 10).map(song => {
                setRowData(oldValue => {
                    return {
                        ...oldValue,
                        songs: {
                            ...oldValue.songs,
                            [`${song}`]: {
                                title: 'Loading',
                                artist: 'Loading',
                            }
                        }
                    }
                })
                apiFetch(`/api/song/info/${song}`).then(response => response.json()).then(data => {
                    setRowData(oldValue => {
                        return {
                            ...oldValue,
                            songs: {
                                ...oldValue.songs,
                                [`${song}`]: data
                            }
                        }
                    })
                })
            })
        }
    }, [originalRowShowing])

    function capitalFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleRawChange = (e, key) => {
        // console.log(e.target.value, key)
        // rowShowing[key] = e.target.value
        let newRow;
        setRowShowing(oldValue => {
            newRow = {
                ...oldValue,
                [key]: e.target.value
            }
            setDifference(getDifference(newRow, originalRowShowing))

            return newRow
        })
    }

    useEffect(() => {

        const handleKey = (e) => {
            if (e.keyCode == 27) { 
                setRowShowing('')
            }
        }

        document.addEventListener("keydown", handleKey)

        return () => {
            document.removeEventListener("keydown", handleKey)
        }
    }, [])

    return (
        <div className="bg-neutral-600 shadow-lg rounded-lg absolute left-10 right-20 top-20 bottom-20 z-10 text-white overflow-y-auto">
            <div className="ml-4 relative w-fit flex flex-row gap-1 mt-3 bg-neutral-700 rounded-sm p-1 pl-2 pr-2">
                <input type="checkbox" onChange={(e) => setShowRaw(e.target.checked)} checked={showRaw} className="bg-neutral-700"></input>
                <button className="text-white-300 text-sm">Raw</button>
            </div>
            {showRaw ?
                Object.keys(rowShowing).map((key, index) =>
                    <div key={index} className="flex flex-col m-3 gap-1">
                        <label className="grid items-center gap-1" style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                            <label className="">{key}</label>
                            {key in difference ?
                                <div className="bg-green-600 rounded-full h-3 w-3"></div>
                                :
                                <label></label>
                            }

                            <label className="">{data.columns.filter(el => el.name == key)[0].type}</label>
                        </label>
                        <input className="bg-neutral-700 rounded-md p-1" onInput={(e) => { handleRawChange(e, key) }} value={rowShowing[key]}></input>
                    </div>
                )
                :
                Object.keys(rowShowing).map((key, index) =>
                    <div key={index} className="flex flex-col m-3 gap-1">
                        <>
                            {
                                function () {
                                    switch (key) {
                                        case 'current_list':
                                            return (
                                                <>
                                                    <label className="">Current list</label>
                                                    <div className="flex flex-row gap-2 bg-neutral-700 rounded-md">
                                                        <Image className='rounded-tl-md rounded-bl-md' src={`https://api.music.rockhosting.org/api/list/image/${rowShowing[key]}_300x300`} height={50} width={50} alt="" />
                                                        <div className="flex flex-col">
                                                            <label className="text-lg">{rowData?.current_list?.name}</label>
                                                            <label className="text-sm">{rowData?.current_list?.author}</label>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        case 'current_song':
                                            return (
                                                <>
                                                    <label className="">Current song</label>
                                                    <div className="flex flex-row gap-2 bg-neutral-700 rounded-md">
                                                        <Image className='rounded-tl-md rounded-bl-md' src={`https://api.music.rockhosting.org/api/song/image/${rowShowing[key]}_300x300`} height={50} width={50} alt="" />
                                                        <div className="flex flex-col">
                                                            <label className="text-lg">{rowData?.current_song?.title}</label>
                                                            <label className="text-sm">{rowData?.current_song?.artist}</label>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        case 'current_time':
                                            return (
                                                <div className="flex flex-row gap-2">
                                                    <label className="">Current time</label>
                                                    <label>{getTime(rowShowing[key])}</label>
                                                </div>
                                            )
                                        case 'lists':
                                            return (
                                                <>
                                                    <label className="">Lists</label>
                                                    <div className="bg-neutral-700 grid grid-cols-2 gap-2 p-2 rounded-md">
                                                        {
                                                            JSON.parse(rowShowing.lists).map(list =>
                                                                <div key={list} className="bg-neutral-600 rounded-sm flex flex-row gap-1 w-full">
                                                                    <Image alt="" className="rounded-sm" src={rowData?.lists?.[list]?.cover_url} width={50} height={50} />
                                                                    <div className="flex flex-col max-w-full min-w-0 w-full">
                                                                        <label className="text-lg fade-out-neutral-50 min-w-0 max-w-full">
                                                                            {rowData?.lists?.[list]?.name}
                                                                        </label>
                                                                        <label className="text-sm fade-out-neutral-100 min-w-0 max-w-full">
                                                                            {rowData?.lists?.[list]?.author}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )
                                        case 'songs':
                                            return (
                                                <>
                                                    <label className="">Songs</label>
                                                    <div className="bg-neutral-700 grid grid-cols-2 gap-2 p-2 rounded-md">
                                                        {
                                                            JSON.parse(rowShowing.songs).slice(0, 10).map(song =>
                                                                <div key={song} className="bg-neutral-600 rounded-sm flex flex-row gap-1 w-full">
                                                                    <Image alt="" className="rounded-sm" src={`https://api.music.rockhosting.org/api/song/image/${song}_100x100`} width={50} height={50} />
                                                                    <div className="flex flex-col max-w-full min-w-0 w-full">
                                                                        <label className="text-lg fade-out-neutral-50 min-w-0 max-w-full">
                                                                            {rowData?.songs?.[song]?.title}
                                                                        </label>
                                                                        <label className="text-sm fade-out-neutral-100 min-w-0 max-w-full">
                                                                            {rowData?.songs?.[song]?.artist}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                </>
                                            )
                                        case 'picture_url':
                                            return (
                                                <>
                                                    <label className="">Picture</label>
                                                    <Image alt="" className="ml-3 rounded-xl" height={100} width={100} src={rowShowing[key]} />
                                                </>
                                            )
                                        default:
                                            if (data.columns.filter(el => el.name == key)[0].type == "BOOLEAN") {
                                                return (
                                                    <div className="flex flex-row gap-2">
                                                        <label className="">{capitalFirst(key.replace(/_/g, ' '))}</label>
                                                        <input type="checkbox" checked={rowShowing[key]} />
                                                    </div>
                                                )
                                            }
                                            return (
                                                <>
                                                    <label className="">{capitalFirst(key.replace(/_/g, ' '))}</label>
                                                    <input className="bg-neutral-700 rounded-md p-1" onChange={() => { }} value={rowShowing[key]}></input>
                                                </>
                                            )
                                    }
                                }()
                            }
                        </>
                    </div>
                )
            }
            <div className="-translate-x-1/2 left-1/2 relative w-fit flex flex-row gap-6 mb-3">
                <button className="text-red-300 hover:bg-red-600 hover:text-white rounded-lg p-1">Delete</button>
                <button className="bg-green-600 rounded-lg p-1 disabled:opacity-50" disabled={Object.keys(difference).length == 0}>Comit changes</button>
            </div>
        </div >
    )
}


function getDifference(obj1, obj2) {
    const diff = {};

    // Iterate through the first object
    for (const key in obj1) {
        // Check if the key exists in the second object
        if (obj2.hasOwnProperty(key)) {
            // If the value is an object, do a deep comparison
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                const nestedDiff = getDifference(obj1[key], obj2[key]);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (obj1[key].toString() !== obj2[key].toString()) {
                diff[key] = { obj1: obj1[key], obj2: obj2[key] };
            }
        } else {
            // If the key does not exist in the second object
            diff[key] = { obj1: obj1[key], obj2: undefined };
        }
    }

    // Check for keys that exist in the second object but not in the first
    for (const key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            diff[key] = { obj1: undefined, obj2: obj2[key] };
        }
    }
    return diff;
}