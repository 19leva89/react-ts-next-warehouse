import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

export async function GET(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || user?.role !== 'ADMIN') {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		})

		return SuccessResponse({
			currentUser: userId,
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function POST(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || user?.role !== 'ADMIN') {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

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
			currentUser: userId,
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
