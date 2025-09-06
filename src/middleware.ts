import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from '@/i18n/routing'

const secret = process.env.AUTH_SECRET

const authRoutes = ['/auth/reset', '/auth/new-password', '/auth/not-auth']

// Utility function to get locale from pathname
function getLocaleFromPath(pathname: string): string {
	const locale = pathname.split('/')[1]

	return routing.locales.includes(locale as any) ? locale : routing.defaultLocale
}

async function handleWebAuth(req: NextRequest, intlResponse?: NextResponse) {
	const { pathname, protocol } = req.nextUrl

	//! Important to set secureCookie
	const token = await getToken({ req, secret, secureCookie: protocol === 'https:' })
	const isLoggedIn = !!token

	const locale = getLocaleFromPath(pathname)

	const isLoginPage = pathname.includes('/auth/login')
	const isAuthRoute = authRoutes.some((route) => pathname.includes(route))

	// Logged in users should not see auth pages (except Logout)
	if (isLoggedIn && (isLoginPage || isAuthRoute)) {
		return NextResponse.redirect(new URL(`/${locale}`, req.url))
	}

	// Not logged in users should be redirected to Login (except for the auth pages themselves)
	if (!isLoggedIn && !isLoginPage && !isAuthRoute) {
		return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
	}

	return intlResponse || NextResponse.next()
}

export default async function middleware(req: NextRequest) {
	// Handle internationalization
	const handleI18nRouting = createMiddleware(routing)
	const intlResponse = handleI18nRouting(req)

	// If internationalization requires a redirect, return it
	if (intlResponse && [302, 307].includes(intlResponse.status)) {
		return intlResponse
	}

	// Handle authorization
	return handleWebAuth(req, intlResponse)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|uploads).*)'],
}
