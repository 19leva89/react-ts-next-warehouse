import { ReactNode } from 'react'
import { Nunito } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'

import { routing } from '@/i18n/routing'
import { constructMetadata } from '@/lib'
import { SessionProvider, ToasterProvider } from '@/providers'

import './globals.css'

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata = constructMetadata()

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

interface Props {
	children: ReactNode
	params: Promise<{ locale: string }>
}

const LocaleLayout = async ({ children, params }: Props) => {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	return (
		<html lang={locale}>
			<body className={nunito.variable}>
				<NextIntlClientProvider>
					<SessionProvider>
						{children}

						<ToasterProvider />
					</SessionProvider>
				</NextIntlClientProvider>

				{/* Allow track page views for Vercel */}
				<Analytics />
			</body>
		</html>
	)
}

export default LocaleLayout
