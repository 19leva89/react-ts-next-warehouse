import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET() {
	try {
		const user = await getCurrentUser()

		return SuccessResponse({
			user: {
				name: user?.name,
				email: user?.email,
				role: user?.role,
			},
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function PUT(req: NextRequest) {
	try {
		const user = await getCurrentUser()

		const { name, email } = await req.json()

		await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				name,
				email,
			},
		})

		return SuccessResponse({
			user: {
				name: user?.name,
				email: user?.email,
			},
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
