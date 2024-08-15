'use client'

import { Table } from "@/app/components/table"
import { apiFetch } from "@/app/utils/apiFetch"
import { debounce } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"


export default function Users({ }) {

    const [data, setData] = useState(null)
    const [limits, setLimits] = useState({ 'bottom': 0, 'top': 50 })
    const [search, setSearch] = useState({})
    const loading = useRef(true)

    useEffect(() => {
        console.log(search)
        loading.current = true
        apiFetch(`http://12.12.12.3:8000/api/admin/users?r=${limits.bottom}:${limits.top}&${Object.keys(search).map(key => `${key}=${search[key]}`).join('&')}`).then(data => data.json()).then(data => {
            setData({ columns: data.columns, rows: data.users, total: data.total_lists })
            loading.current = false
        })
    }, [loading, limits, search])

    const handleScroll = useCallback((e) => {
        if (e.target.scrollTop == e.target.scrollHeight - e.target.offsetHeight + 10) {
            if (loading.current) { return }
            setLimits(oldLimits => { return { 'bottom': 0, 'top': oldLimits.top + 10 } })
        }
    }, [loading])

    const onSearch = debounce((search) => {
        console.log(search)
        setSearch({ ...search })
        // loading.current = true
        // apiFetch(`http://12.12.12.3:8000/api/admin/lists?r=${limits.bottom}:${limits.top}&${Object.keys(search).map(key => `${key}=${search[key]}`).join('&')}`).then(data => data.json()).then(data => {
        //     setData({ columns: data.columns, rows: data.lists, total: data.total_lists })
        //     loading.current = false
        // })
    }, 1000);

    return (
        <>
            <div>
                {data == null ?
                    <></>
                    :
                    <>
                        <label>Rows: {data.total} </label>
                        {
                            loading.current ?
                                <label className="text-sm">Loading...</label>
                                :
                                <></>
                        }

                    </>

                }
            </div>
                {data == null ?
                    <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">Loading...</label>
                    :
                    <Table data={data} onSearch={onSearch} limits={limits} handleScroll={handleScroll} />
                }
        </>
    )
}