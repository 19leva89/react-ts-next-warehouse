import { NextResponse } from 'next/server'

export function UnauthorizedError({ message }: { message?: any }) {
	return NextResponse.json({ error: 'Unauthorized', message }, { status: 401 })
}

export function GlobalError({ message, errorCode }: { message: any; errorCode?: number }) {
	console.log(message)

	return NextResponse.json({ error: 'Something went wrong', message }, { status: errorCode || 500 })
}

export function SuccessResponse(data: any) {
	return NextResponse.json(data, {
		status: 200,
	})
}
