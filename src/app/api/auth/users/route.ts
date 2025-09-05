import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET() {
	try {
		const user = await requireAdmin()

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		})

		return SuccessResponse({
			currentUser: user.id,
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireAdmin()

		const { name, email, role, password, confirmPassword } = await req.json()

		if (password !== confirmPassword) {
			return GlobalError({
				message: 'Password and Confirm Password does not match',
				errorCode: 400,
			})
		}

		const hashedPassword = await hash(password, 12)

		await prisma.user.create({
			data: {
				name,
				email,
				role,
				password: hashedPassword,
			},
		})

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		})

		return SuccessResponse({
			message: 'Successfully created user',
			currentUser: user.id,
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
