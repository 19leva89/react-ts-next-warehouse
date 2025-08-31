import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { verifyJWT } from '@/lib/token'
import { routing } from '@/i18n/routing'
import { GlobalError, UnauthorizedError } from '@/lib/helper'

interface AuthenticatedRequest extends NextRequest {
	user: {
		id: string
	}
}

export default createMiddleware(routing)

let redirectToLogin = false

export async function middleware(req: NextRequest) {
	let token: string | undefined

	if (req.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL('/en', req.url))
	}

	if (req.cookies.has('token')) {
		token = req.cookies.get('token')?.value
	} else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
		token = req.headers.get('Authorization')?.replace('Bearer ', '')
	}

	if (req.nextUrl.pathname.includes('/login') && (!token || redirectToLogin)) return

	if (
		!token &&
		(req.nextUrl.pathname.startsWith('/api/users') || req.nextUrl.pathname.startsWith('/api/auth/logout'))
	) {
		return UnauthorizedError({ message: 'You are not authorized' })
	}

	const response = NextResponse.next()

	try {
		if (token) {
			const { sub } = await verifyJWT<{ sub: string }>(token)
			response.headers.set('X-USER-ID', sub)
			;(req as AuthenticatedRequest).user = { id: sub }
		}
	} catch (error: any) {
		redirectToLogin = true
		if (req.nextUrl.pathname.startsWith('/api')) {
			return GlobalError({ message: error.message })
		}

		return NextResponse.redirect(new URL(`/en/login`, req.url))
	}

	const authUser = (req as AuthenticatedRequest).user

	if (!authUser) {
		return NextResponse.redirect(new URL(`/en/login`, req.url))
	}

	if (req.url.includes('/login') && authUser) {
		return NextResponse.redirect(new URL('/en', req.url))
	}

	return response
}

export const config = {
	matcher: ['/', '/login', '/api/users/:path*', '/api/auth/logout', '/((?!api|_next|.*\\..*).*)'],
}
