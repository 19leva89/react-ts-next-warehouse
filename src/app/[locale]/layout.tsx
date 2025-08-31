import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'

import { routing } from '@/i18n/routing'
import { appDesc, appName } from '@/lib/static'
import { ToasterProvider } from '@/providers/toaster-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: appName,
	description: appDesc,
}

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

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider locale={locale}>
					{children}

					<ToasterProvider />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
