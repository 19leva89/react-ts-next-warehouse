import { NextRequest } from 'next/server'
import { compare, hash } from 'bcrypt-ts'

import { prisma } from '@/lib/prisma'
import { getCurrentUserWithPassword } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function PUT(req: NextRequest) {
	try {
		const user = await getCurrentUserWithPassword()

		const { oldPassword, password } = await req.json()

		if (!user?.id || !user?.password) {
			return GlobalError({ message: 'Unauthorized', errorCode: 401 })
		}

		const isOldPasswordValid = await compare(oldPassword, user.password)
		if (!isOldPasswordValid) {
			return GlobalError({ message: 'Old password is incorrect', errorCode: 400 })
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

		return SuccessResponse({
			message: 'Successfully changed password',
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
