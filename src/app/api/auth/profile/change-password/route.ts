import { NextRequest } from 'next/server'
import { compare, hash } from 'bcrypt-ts'

import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/handle-error'
import { getCurrentUserWithPassword } from '@/lib/auth'
import { handleApiSuccess } from '@/lib/handle-success'

export async function PUT(req: NextRequest) {
	try {
		const user = await getCurrentUserWithPassword()

		const { oldPassword, password } = await req.json()

		if (!user?.id || !user?.password) {
			return handleApiError(new Error('User not found'), 'PUT /api/auth/profile/change-password')
		}

		const isOldPasswordValid = await compare(oldPassword, user.password)
		if (!isOldPasswordValid) {
			return handleApiError(new Error('Invalid old password'), 'PUT /api/auth/profile/change-password')
		}

		const hashedPassword = await hash(password, 12)

		await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				password: hashedPassword,
			},
		})

		return handleApiSuccess(
			{
				message: 'Successfully changed password',
			},
			'PUT /api/auth/profile/change-password',
		)
	} catch (error) {
		return handleApiError(error, 'PUT /api/auth/profile/change-password')
	}
}
