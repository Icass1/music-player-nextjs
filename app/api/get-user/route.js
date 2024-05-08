import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET() {

    const session = await getServerSession(authOptions);
    const token = getToken()

    if (!session) {
        return NextResponse.json({ error: 'Not authorized'}, { status: 400})
    }

    return NextResponse.json({ success: session}, {status: 200})
}