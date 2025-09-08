
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { execSync } from 'child_process'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Check if obfuscation is enabled
const shouldObfuscate = process.env.NODE_ENV === 'production' &&
	process.env.OBFUSCATE_BUILD === 'true'

if (!shouldObfuscate) {
	console.log('🔧 Obfuscation skipped (not production or OBFUSCATE_BUILD !== true)')

	process.exit(0)
}

console.log('🚀 Starting Next.js build obfuscation...')

const obfuscationConfig = {
	compact: true, 														// Minify code
	controlFlowFlattening: true, 							// Control flow flattening
	controlFlowFlatteningThreshold: 0.5, 			// Control flow flattening threshold
	deadCodeInjection: false, 								// Disable for Vercel (may increase size)
	debugProtection: false,   								// May cause problems in serverless
	disableConsoleOutput: true, 							// Disable console output
	identifierNamesGenerator: 'hexadecimal',	// Identifier names generator
	rotateStringArray: true,									// Rotate string array
	selfDefending: false, 										// Disable for serverless
	stringArray: true, 												// String array
	stringArrayThreshold: 0.7, 								// String array threshold
	transformObjectKeys: true, 								// Transform object keys
	unicodeEscapeSequence: false, 						// Unicode escape sequence

	// Next.js exceptions
	reservedNames: [
		'^__next',
		'^__webpack',
		'^_app',
		'^_document',
		'^require',
		'^exports',
		'^module'
	]
}

function obfuscateFile(filePath, config) {
	try {
		const code = fs.readFileSync(filePath, 'utf8')

		// Skip already minified files
		if (code.includes('/*! For license information please see') ||
			!code.includes('\n') && code.length > 1000) {

			return false
		}

		const obfuscated = JavaScriptObfuscator.obfuscate(code, config)
		fs.writeFileSync(filePath, obfuscated.getObfuscatedCode())

		return true
	} catch (error) {
		console.warn(`⚠️  Obfuscation error ${filePath}:`, error.message)

		return false
	}
}

async function obfuscateNextJSBuild() {
	const startTime = Date.now()
	let processedFiles = 0
	let skippedFiles = 0

	// Obfuscate static JS files
	const staticJsFiles = glob.sync('.next/static/chunks/**/*.js', {
		ignore: [
			'.next/static/chunks/polyfills-*.js',
			'.next/static/chunks/webpack-*.js',
			'.next/static/chunks/main-*.js' // Be careful with main chunk
		]
	})

	console.log(`📁 Found ${staticJsFiles.length} static JS files`)

	for (const file of staticJsFiles) {
		const success = obfuscateFile(file, obfuscationConfig)
		if (success) {
			processedFiles++

			console.log(`✅ ${path.basename(file)}`)
		} else {
			skippedFiles++

			console.log(`⏭️  ${path.basename(file)} (skipped)`)
		}
	}

	// Obfuscate pages (be careful!)
	const pageFiles = glob.sync('.next/static/chunks/pages/**/*.js')

	console.log(`📄 Found ${pageFiles.length} page files`)

	// More lenient configuration for pages
	const pageConfig = {
		...obfuscationConfig,
		controlFlowFlattening: false, // Disable for stability
		stringArrayThreshold: 0.5,    // Reduce aggressiveness
	}

	for (const file of pageFiles) {
		const success = obfuscateFile(file, pageConfig)
		if (success) {
			processedFiles++

			console.log(`✅ page: ${path.basename(file)}`)
		} else {
			skippedFiles++
		}
	}

	const endTime = Date.now()
	const duration = endTime - startTime

	console.log('\n🎉 Obfuscation completed!')
	console.log(`📊 Statistics:`)
	console.log(`   • Processed: ${processedFiles} files`)
	console.log(`   • Skipped: ${skippedFiles} files`)
	console.log(`   • Time: ${duration}ms`)

	// Check final build size
	const buildSize = getBuildSize()
	console.log(`   • Build size: ${buildSize}MB`)
}

function getBuildSize() {
	try {
		const output = execSync('du -sm .next', { encoding: 'utf8' })

		return parseInt(output.split('\t')[0])
	} catch {
		return 'N/A'
	}
}

// Error handling
process.on('uncaughtException', (error) => {
	console.error('💥 Critical obfuscation error:', error)

	process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('💥 Unhandled rejection in:', promise, 'reason:', reason)

	process.exit(1)
})

// Run obfuscation
obfuscateNextJSBuild().catch((error) => {
	console.error('💥 Error running obfuscation:', error)

	process.exit(1)
})