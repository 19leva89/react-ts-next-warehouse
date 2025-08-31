import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

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
		const userId = req.cookies.get('userId')?.value
		const { name, email } = await req.json()

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				name,
				email,
			},
		})

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
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
