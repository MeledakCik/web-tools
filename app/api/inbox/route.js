import { NextResponse } from 'next/server'

const headers = {
    accept: 'application/json',
    'user-agent': 'Mozilla/5.0',
}

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    try {
        const url = `https://tempmail.plus/api/mails?email=${email}`
        const res = await fetch(url, { headers })

        if (!res.ok) throw new Error(`Status: ${res.status}`)

        const data = await res.json()
        const mails = data.mail_list || []

        return NextResponse.json({ mails }) // <== kirim semua email
    } catch (err) {
        console.error('Inbox fetch error:', err)
        return NextResponse.json({ mails: [] })
    }
}
