
'use client'

import { Table } from "@/app/components/table"
import { apiFetch } from "@/app/utils/apiFetch"
import { debounce } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"

export default function Songs({ }) {

    const [data, setData] = useState(null)
    const [limits, setLimits] = useState({ 'bottom': 0, 'top': 50 })
    const [search, setSearch] = useState({})
    const loading = useRef(true)

    useEffect(() => {
        console.log(search)
        loading.current = true
        apiFetch(`https://api.music.rockhosting.org/api/admin/songs?r=${limits.bottom}:${limits.top}&${Object.keys(search).map(key => `${key}=${search[key]}`).join('&')}`).then(data => data.json()).then(data => {
            setData({ columns: data.columns, rows: data.rows, total: data.total_rows, total_showing: data.total_rows_showing })
            loading.current = false
        }).catch(error => {
            setData('error')
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
    }, 1000);

    return (
        <>
            <div className="flex flex-row gap-7">
                <label>Total users: {data?.total}</label>
                <label>Search results: {data?.total_showing}</label>
            </div>
            {
                function () {
                    switch (data) {
                        case null:
                            return <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">Loading...</label>
                        case 'error':
                            return <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">Error</label>
                        default:
                            return <Table data={data} onSearch={onSearch} limits={limits} handleScroll={handleScroll} />
                    }
                }()
            }
        </>
    )
}