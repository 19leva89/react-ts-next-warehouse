import { NextRequest } from 'next/server'

import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function POST(req: NextRequest) {
	const { key } = await req.json()

	if (key === 'static_key') {
		const response = SuccessResponse({ message: 'Logout successful' })

		await Promise.all([
			response.cookies.delete('token'),
			response.cookies.delete('userId'),
			response.cookies.delete('loggedIn'),
		])

		return response
	} else {
		return GlobalError({
			message: 'Invalid key',
			errorCode: 400,
		})
	}
}
