import { NextResponse } from "next/server";

const requestCounts: Record<string, number> = {};

export async function GET(request: Request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";
    const key = `${ip}-${ua}`;

    if (!requestCounts[key]) requestCounts[key] = 0;
    requestCounts[key] += 1;

    return NextResponse.json({ total: requestCounts[key] });
}
