import axios from 'axios'

export const handleErrorClient = (error: unknown, context: string) => {
	if (axios.isAxiosError(error)) {
		console.error(`🌐 Client API error [${context}]:`, error.response?.status, error.message)
	} else if (error instanceof Error) {
		console.error(`🚨 Client unexpected error [${context}]:`, error.message)
	} else {
		console.error(`❌ Client unknown error [${context}]:`, error)
	}

	// On the client, simply forward it further
	throw error
}
