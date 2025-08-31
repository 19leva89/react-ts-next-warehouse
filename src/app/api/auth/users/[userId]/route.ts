import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ userId: string }>
}

export async function PUT(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || user?.role !== 'ADMIN') {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource.',
			})
		}

		const { id, name, email, role, password, updatePassword } = await req.json()
		let hashedPassword = ''

		if (updatePassword) {
			hashedPassword = await hash(password, 12)
		}

		if (updatePassword) {
			await prisma.user.update({
				where: {
					id,
				},
				data: {
					name,
					email,
					role,
					password: hashedPassword,
				},
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
				},
			})
		} else {
			await prisma.user.update({
				where: {
					id,
				},
				data: {
					name,
					email,
					role,
				},
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
				},
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
			message: 'Successfully updated user.',
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { userId } = await params

	try {
		const currentUserId = req.cookies.get('userId')?.value

		const currentUser = await prisma.user.findUnique({
			where: {
				id: currentUserId,
			},
		})

		if (!currentUserId || currentUser?.role !== 'ADMIN') {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource.',
			})
		}

		await prisma.user.delete({
			where: {
				id: userId,
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
			message: 'Successfully deleted user.',
			currentUser: currentUserId,
			users,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
