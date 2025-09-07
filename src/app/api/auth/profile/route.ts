import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

export async function GET() {
	try {
		const user = await getCurrentUser()

		return handleApiSuccess(
			{
				user: {
					role: user?.role,
					email: user?.email,
					name: user?.name,
					isOAuth: user?.accounts?.length ?? 0 > 0,
					isTwoFactorEnabled: user?.isTwoFactorEnabled,
				},
			},
			'GET /api/auth/profile',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/auth/profile')
	}
}

export async function PUT(req: NextRequest) {
	try {
		const user = await getCurrentUser()

		const { name, email, isTwoFactorEnabled } = await req.json()

		const updatedUser = await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				name,
				email,
				isTwoFactorEnabled,
			},
		})

		return handleApiSuccess(
			{
				user: {
					name: updatedUser.name,
					email: updatedUser.email,
					isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
				},
			},
			'PUT /api/auth/profile',
		)
	} catch (error) {
		return handleApiError(error, 'PUT /api/auth/profile')
	}
}
