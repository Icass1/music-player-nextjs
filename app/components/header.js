
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {

    const session = useSession();

    return (
        <div className="grid h-full w-full items-center" style={{gridTemplateColumns: '1fr 300px'}}>
            <label></label>
            {session.data ? (
                <div>{session.data.user.name}</div>
            ) : (
                <Link href='/login'>Login</Link>
            )}
        </div>
    )
}