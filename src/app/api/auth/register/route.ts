import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse } from '@/lib/helper'
import { RegisterUserInput, RegisterUserSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as RegisterUserInput
		const data = RegisterUserSchema.parse(body)

		const hashedPassword = await hash(data.password, 12)

		const users = await prisma.user.findMany()

		if (users.length === 0) {
			const user = await prisma.user.create({
				data: {
					name: data.name,
					email: data.email,
					password: hashedPassword,
					role: 'ADMIN',
				},
			})

			return SuccessResponse({
				status: 'success',
				message: 'Successfully registered.',
				data: {
					user: {
						...user,
						password: undefined,
					},
				},
			})
		} else {
			return GlobalError({
				message: 'You are not allowed to register.',
				errorCode: 400,
			})
		}
	} catch (error: any) {
		return GlobalError(error)
	}
}
