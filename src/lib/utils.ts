import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string): string {
	// If in a browser, return the relative path
	if (typeof window !== 'undefined') {
		return path
	}

	// Define the base URL
	const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: `http://localhost:${process.env.PORT || 3000}`

	// Remove extra slashes to avoid format errors
	return new URL(path, baseUrl).toString()
}

export const formatter = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
})

export function constructMetadata({
	title = 'Warehouse',
	description = 'Modern warehouse management system. Accounting of goods, control of balances, automation of warehouse processes.',
	image = '/img/thumbnail.webp',
	icons = '/favicon.ico',
	noIndex = false,
}: {
	title?: string
	description?: string
	image?: string
	icons?: string
	noIndex?: boolean
} = {}): Metadata {
	return {
		title: {
			default: title,
			template: title ? `%s | ${title}` : `%s`,
		},
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: absoluteUrl(image),
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [absoluteUrl(image)],
			creator: '@sobolev',
		},
		icons: {
			icon: icons,
			shortcut: icons,
			apple: icons,
			other: {
				rel: 'icon',
				url: icons,
			},
		},
		metadataBase: new URL(absoluteUrl('')),
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	}
}
