import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'management.lanyardcustombandung.com',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
