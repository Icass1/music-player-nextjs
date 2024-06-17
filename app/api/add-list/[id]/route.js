import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { NextResponse } from "next/server";

// 92632013
// 101225446396537279574

export async function GET(req, {params}) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Not authorized', session: session }, { status: 400 })
    }

    const response = await fetch(`https://api.music.rockhosting.org/api/user/add-list`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.id}` // Pass user id in the headers
        },
        body: JSON.stringify({
            list_id: params.id,
        })
    })
    return NextResponse.json({ message: response.text }, { status: response.status })
}