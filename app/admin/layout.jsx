'use client'

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import { useCallback } from "react";


function NavTab() {

    const pathname = usePathname();

    return (
        <div className="flex flex-col m-2">
            <label className="font-bold text-neutral-200">Admin panel</label>
            <Link href='/admin/general' className={clsx("text-neutral-400 hover:text-neutral-300", { "text-fg-1": pathname == '/admin/general' })}>General</Link>
            <Link href='/admin/songs' className={clsx("text-neutral-400 hover:text-neutral-300", { "text-fg-1": pathname == '/admin/songs' })}>Songs</Link>
            <Link href='/admin/lists' className={clsx("text-neutral-400 hover:text-neutral-300", { "text-fg-1": pathname == '/admin/lists' })}>Lists</Link>
            <Link href='/admin/users' className={clsx("text-neutral-400 hover:text-neutral-300", { "text-fg-1": pathname == '/admin/users' })}>Users</Link>
            <Link href='/admin/downloads' className={clsx("text-neutral-400 hover:text-neutral-300", { "text-fg-1": pathname == '/admin/downloads' })}>Downloads</Link>
        </div>
    )
}

export default function AdminLayout({ children }) {

    const session = useSession();

    // if (session.status == "authenticated" && session.data.user.admin) {

    // } else if (session.status == "loading") {
    //     return (
    //         <div>
    //             Loading
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div>
    //             Access denied
    //         </div>
    //     )
    // }

    return (
        <div className="grid h-full" style={{ gridTemplateColumns: '150px 1fr' }}>
            <NavTab />
            <div className="overflow-hiddejn relative">
                {children}
            </div>
        </div>
    )
}