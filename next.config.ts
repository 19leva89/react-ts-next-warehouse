import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createNextJsObfuscator from 'nextjs-obfuscator'

import { obfuscatorOptions, pluginOptions } from './obfuscator-options'

const withNextJsObfuscator = createNextJsObfuscator(obfuscatorOptions, pluginOptions)

const nextConfig: NextConfig = withNextJsObfuscator({
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
})

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
