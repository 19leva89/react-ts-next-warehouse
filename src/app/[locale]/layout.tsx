import { ReactNode } from 'react'
import { Nunito } from 'next/font/google'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { hasLocale, NextIntlClientProvider } from 'next-intl'

import { routing } from '@/i18n/routing'
import { constructMetadata } from '@/lib'
import { ToasterProvider } from '@/providers/toaster-provider'

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

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={nunito.variable}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					{children}

					<ToasterProvider />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
