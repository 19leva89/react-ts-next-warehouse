import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from '@/i18n/routing'

const secret = process.env.AUTH_SECRET

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

	// If the user is logged in and is on the login page - redirect to the main page
	if (isLoggedIn && isLoginPage) {
		return NextResponse.redirect(new URL(`/${locale}`, req.url))
	}

	// If the user is not logged in and not on the login page - redirect to login
	if (!isLoggedIn && !isLoginPage) {
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
