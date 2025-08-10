import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch("https://dump-facebook-api-v2-production.up.railway.app/dork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: (error as Error).message },
            { status: 500 }
        );
    }
}
