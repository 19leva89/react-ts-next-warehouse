import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { verifyJWT } from '@/lib/token'
import { routing } from '@/i18n/routing'

// Utility function to extract token
function getToken(req: NextRequest): string | undefined {
	return req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '')
}

// Utility function to get locale from pathname
function getLocaleFromPath(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean)

	return segments[0] && routing.locales.includes(segments[0] as any) ? segments[0] : routing.defaultLocale
}

async function handleWebAuth(req: NextRequest, intlResponse?: NextResponse) {
	const token = getToken(req)
	const pathname = req.nextUrl.pathname
	const locale = getLocaleFromPath(pathname)
	const isLoginPage = pathname.includes('/auth/login')

	// If this is a login page and there is no token, continue
	if (isLoginPage && !token) {
		return intlResponse || NextResponse.next()
	}

	// If there is a token, check it
	if (token) {
		try {
			const { sub } = await verifyJWT<{ sub: string }>(token)
			const response = intlResponse || NextResponse.next()

			response.headers.set('X-USER-ID', sub)

			// If user is authenticated and on the login page, redirect to home
			if (isLoginPage) {
				return NextResponse.redirect(new URL(`/${locale}`, req.url))
			}

			return response
		} catch {
			// Invalid token - redirect to login
			return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
		}
	}

	// No token and not login page - redirect to login
	if (!isLoginPage) {
		return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
	}

	return intlResponse || NextResponse.next()
}

export default async function middleware(req: NextRequest) {
	// Handle internationalization
	const handleI18nRouting = createMiddleware(routing)
	const intlResponse = handleI18nRouting(req)

	// If internationalization requires a redirect, return it
	if (intlResponse?.status === 307 || intlResponse?.status === 302) {
		return intlResponse
	}

	// Handle authorization
	return handleWebAuth(req, intlResponse)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
}
