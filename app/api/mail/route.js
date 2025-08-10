import { NextResponse } from 'next/server'

function generateEmail() {
    const names = [
        'cikawanmasdadela',
        'masdasdasantaobesae',
        'measdasdasdsieaf',
        'afadjajajaaIiuasd',
        'asdhhhsadaahs',
        'MantaaaraosajJas',
    ]
    const domains = [
        'chitthi.in',
        'any.pink',
        'mailto.plus',
        'fexpost.com',
        'fexbox.org',
        'mailbox.in.ua',
        'rover.info',
        'fextemp.com',
        'merepost.com',
    ]

    const name = names[Math.floor(Math.random() * names.length)]
    const randomNum = Math.floor(Math.random() * (10000000 - 1000)) + 1000
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${name.toLowerCase().replace(/\s/g, '')}${randomNum}@${domain}`
}

export async function GET() {
    const email = generateEmail()
    return NextResponse.json({ email })
}
