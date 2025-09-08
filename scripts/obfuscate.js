import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { execSync } from 'child_process'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Check if obfuscation should be skipped
const shouldObfuscate = process.env.NODE_ENV === 'production' &&
	(process.env.OBFUSCATE_BUILD === 'true' || process.argv.includes('--force'))

if (!shouldObfuscate) {
	console.log('🔧 Obfuscation skipped (not production or OBFUSCATE_BUILD !== true)')
	console.log('   Use --force to override or set OBFUSCATE_BUILD=true')

	process.exit(0)
}

console.log('🚀 Starting Next.js 15 build obfuscation...')

// Obfuscation config
const obfuscationConfig = {
	compact: true, 																								// Better for performance
	controlFlowFlattening: false, 																// Disabled for stability on Vercel
	deadCodeInjection: false, 																		// Dead code injection is disabled for stability on Vercel
	debugProtection: false, 																			// Debug protection is disabled for stability on Vercel
	disableConsoleOutput: process.env.NODE_ENV === 'production', 	// Disable console output in production
	identifierNamesGenerator: 'mangled', 													// Better for performance
	rotateStringArray: true, 																			// Balance between obfuscation and size
	selfDefending: false, 																				// Critically disabled for serverless
	stringArray: true, 																						// Balance between obfuscation and size
	stringArrayThreshold: 0.6, 																		// Balance between obfuscation and size
	transformObjectKeys: false, 																	// May break React
	unicodeEscapeSequence: false, 																// Unicode escape sequence is disabled for stability on Vercel
	ignoreImports: true, 																					// Important for ES modules
	target: 'browser-no-eval', 																		// Safer for Vercel

	// Extended exceptions for Next.js 15 and Turbopack
	reservedNames: [
		// Next.js core
		'^__next',
		'^_next',
		'^__webpack',
		'^__turbopack',
		'^__webpack_require__',
		'^webpack',
		'^webpackChunk',
		'^_app',
		'^_document',
		'^_error',

		// React and Next.js hooks/functions
		'^use[A-Z]', // React hooks
		'^get[A-Z]', // getServerSideProps, getStaticProps
		'^default$',
		'^__esModule$',

		// Node.js and CommonJS
		'^require',
		'^exports',
		'^module',
		'^global',
		'^process',

		// Vercel and runtime
		'^__NEXT_DATA__',
		'^__BUILD_MANIFEST',
		'^__REACT_DEVTOOLS_GLOBAL_HOOK__',

		// Turbopack specific
		'^__turbopack_',
		'^TURBOPACK',
	],

	// Exclude strings that may be important
	reservedStrings: [
		'__next',
		'_app',
		'_document',
		'_error',
		'next/router',
		'next/head',
		'next/image',
		'react',
		'react-dom'
	]
}

// Configuration for pages (more conservative)
const pageConfig = {
	...obfuscationConfig,
	stringArrayThreshold: 0.4,
	rotateStringArray: false,
	transformObjectKeys: false,
	controlFlowFlattening: false,
}

// Configuration for components (most conservative)
const componentConfig = {
	...obfuscationConfig,
	stringArray: false,
	stringArrayThreshold: 0,
	rotateStringArray: false,
	transformObjectKeys: false,
}

function shouldSkipFile(filePath, code) {
	// Skip license files
	if (code.includes('/*! For license information')) return true

	// Skip polyfills and critical libraries
	if (filePath.includes('polyfill')) return true
	if (filePath.includes('webpack')) return true
	if (filePath.includes('runtime')) return true

	// Skip too small files (likely service files)
	if (code.length < 10) return true

	// Skip files with critical Next.js strings
	const criticalPatterns = [
		/__webpack_require__/,
		/__turbopack_require__/,
		/webpackChunkName/,
		/"use strict";.*__webpack_require__/,
	]

	return criticalPatterns.some(pattern => pattern.test(code))
}

function obfuscateFile(filePath, config) {
	try {
		const code = fs.readFileSync(filePath, 'utf8')

		if (shouldSkipFile(filePath, code)) {
			return { success: false, reason: 'skipped (critical file)' }
		}

		const obfuscated = JavaScriptObfuscator.obfuscate(code, config)
		const newCode = obfuscated.getObfuscatedCode()

		// Check if obfuscation failed
		if (newCode.length === 0 || newCode === code) {
			return { success: false, reason: 'obfuscation failed' }
		}

		// Remove sourcemap comments
		const cleaned = newCode.replace(/\n\/\/# sourceMappingURL=.*$/gm, '')

		// Atomic write through temporary file
		const tmp = `${filePath}.tmp`
		fs.writeFileSync(tmp, cleaned, 'utf8')
		fs.renameSync(tmp, filePath)

		// Remove old source maps
		const mapPath = `${filePath}.map`
		if (fs.existsSync(mapPath)) fs.unlinkSync(mapPath)

		return { success: true, originalSize: code.length, newSize: cleaned.length }
	} catch (error) {
		return { success: false, reason: error.message }
	}
}

function getFilePatterns() {
	// Define patterns based on build configuration
	const buildDir = '.next'

	return {
		// Application chunks (main obfuscation target)
		chunks: [
			`${buildDir}/static/chunks/**/*.js`,
			`!${buildDir}/static/chunks/polyfills-*.js`,
			`!${buildDir}/static/chunks/webpack-*.js`,
			`!${buildDir}/static/chunks/main-*.js`,
			`!${buildDir}/static/chunks/framework-*.js`,
			`!${buildDir}/static/chunks/commons-*.js`,
			`!${buildDir}/static/chunks/runtime-*.js`,
		],

		// Application pages
		pages: [
			`${buildDir}/static/chunks/pages/**/*.js`,
			`${buildDir}/static/chunks/app/**/*.js`,
		],

		// Components (if any)
		components: [
			`${buildDir}/static/chunks/components/**/*.js`,
		]
	}
}

async function obfuscateNextJSBuild() {
	const startTime = Date.now()
	let stats = {
		processed: 0,
		skipped: 0,
		failed: 0,
		totalOriginalSize: 0,
		totalNewSize: 0
	}

	const patterns = getFilePatterns()

	// Obfuscation chunks
	console.log('🔄 Processing chunks...')
	const chunkFiles = glob.sync(patterns.chunks)
	console.log(`📁 Found ${chunkFiles.length} chunk files`)

	for (const file of chunkFiles) {
		const result = obfuscateFile(file, obfuscationConfig)

		updateStats(stats, result, file, 'chunk')
	}

	// Obfuscation pages (more conservative)
	console.log('\n🔄 Processing pages...')
	const pageFiles = glob.sync(patterns.pages)
	console.log(`📄 Found ${pageFiles.length} page files`)

	for (const file of pageFiles) {
		const result = obfuscateFile(file, pageConfig)

		updateStats(stats, result, file, 'page')
	}

	// Obfuscation components (most conservative)
	console.log('\n🔄 Processing components...')
	const componentFiles = glob.sync(patterns.components)
	if (componentFiles.length > 0) {
		console.log(`🧩 Found ${componentFiles.length} component files`)

		for (const file of componentFiles) {
			const result = obfuscateFile(file, componentConfig)

			updateStats(stats, result, file, 'component')
		}
	}

	const endTime = Date.now()
	const duration = endTime - startTime

	printResults(stats, duration)
}

function updateStats(stats, result, file, type) {
	const fileName = path.basename(file)

	if (result.success) {
		stats.processed++
		stats.totalOriginalSize += result.originalSize
		stats.totalNewSize += result.newSize

		const compression = ((result.originalSize - result.newSize) / result.originalSize * 100).toFixed(1)
		console.log(`✅ ${type}: ${fileName} (${compression}% size change)`)
	} else if (result.reason.includes('skipped')) {
		stats.skipped++

		console.log(`⏭️  ${type}: ${fileName} (${result.reason})`)
	} else {
		stats.failed++

		console.warn(`❌ ${type}: ${fileName} (${result.reason})`)
	}
}

function printResults(stats, duration) {
	const compressionRatio = stats.totalOriginalSize > 0
		? ((stats.totalOriginalSize - stats.totalNewSize) / stats.totalOriginalSize * 100).toFixed(1)
		: '0'

	console.log('\n🎉 Obfuscation completed!')
	console.log('📊 Statistics:')
	console.log(`   • Processed: ${stats.processed} files`)
	console.log(`   • Skipped: ${stats.skipped} files`)
	console.log(`   • Failed: ${stats.failed} files`)
	console.log(`   • Size change: ${compressionRatio}%`)
	console.log(`   • Time: ${duration}ms`)

	// Check final build size
	try {
		const buildSize = getBuildSize()

		console.log(`   • Total build size: ${buildSize}MB`)
	} catch {
		console.log(`   • Build size: unable to calculate`)
	}

	// Warnings
	if (stats.failed > 0) {
		console.warn(`\n⚠️  ${stats.failed} files failed to obfuscate - check for runtime errors`)
	}
}

function getBuildSize() {
	try {
		// More reliable size definition for different systems
		let output

		if (process.platform === 'win32') {
			// Windows
			output = execSync('powershell -Command "(Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB"',
				{ encoding: 'utf8' })

			return parseFloat(output.trim()).toFixed(1)
		} else {
			// Unix-like systems
			output = execSync('du -sm .next', { encoding: 'utf8' })

			return parseInt(output.split('\t')[0])
		}
	} catch {
		throw new Error('Cannot calculate build size')
	}
}

// Improved error handling
process.on('uncaughtException', (error) => {
	console.error('💥 Critical obfuscation error:')
	console.error(error)

	// Attempt to clean up temporary files
	try {
		const tempFiles = glob.sync('.next/**/*.tmp')

		tempFiles.forEach(file => fs.unlinkSync(file))
	} catch {
		// Ignore cleanup errors
	}

	process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('💥 Unhandled rejection in:', promise)
	console.error('Reason:', reason)
	process.exit(1)
})

// Add graceful shutdown
process.on('SIGINT', () => {
	console.log('\n🛑 Obfuscation interrupted')
	process.exit(0)
})

process.on('SIGTERM', () => {
	console.log('\n🛑 Obfuscation terminated')
	process.exit(0)
})

// Run obfuscation
obfuscateNextJSBuild().catch((error) => {
	console.error('💥 Error running obfuscation:')
	console.error(error)
	process.exit(1)
})