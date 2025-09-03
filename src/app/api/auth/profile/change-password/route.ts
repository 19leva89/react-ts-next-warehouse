import { NextRequest } from 'next/server'
import { compare, hash } from 'bcrypt-ts'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function PUT(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value
		const { oldPassword, password } = await req.json()

		const hashedOldPassword = await hash(oldPassword, 12)

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (await compare(hashedOldPassword, user?.password || '')) {
			return GlobalError({
				message: 'Old password is incorrect',
				errorCode: 400,
			})
		}

		const hashedPassword = await hash(password, 12)

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: hashedPassword,
			},
		})

		return SuccessResponse({
			message: 'Successfully changed password',
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
