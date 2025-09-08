export const obfuscatorOptions = {
	compact: true,
	controlFlowFlattening: true,
	controlFlowFlatteningThreshold: 0.5,
	deadCodeInjection: false,
	debugProtection: false,
	disableConsoleOutput: true,
	identifierNamesGenerator: 'hexadecimal',
	rotateStringArray: true,
	selfDefending: false,
	stringArray: true,
	stringArrayThreshold: 0.7,
	transformObjectKeys: true,
	unicodeEscapeSequence: false,
	reservedNames: [
		'^__next', // Next.js runtime
		'^__webpack', // Webpack chunks
		'^_app', // Next.js App component
		'^_document', // Next.js Document
		'^require', // CommonJS require
		'^exports', // CommonJS/ES6 exports
		'^module', // Module system
	],
}

export const pluginOptions = {
	enabled: process.env.NODE_ENV === 'production',
	patterns: ['**/*.js'],
	obfuscateFiles: {
		buildManifest: true,
		ssgManifest: true,
		webpack: true,
	},
	log: true,
}
