import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedPaths = ['/dashboard','/exploit','/dump-facebook','/','/mail','/post-instagram','/a2f-instagram']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        !allowedPaths.includes(pathname) &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/api')
    ) {
        return NextResponse.rewrite(new URL('/not-found', request.url))
    }

    return NextResponse.next()
}
