import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { handleErrorApi } from '@/lib/handle-error-server'
import { handleApiSuccess } from '@/lib/handle-success'

interface Props {
	params: Promise<{ userId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	try {
		await requireAdmin()

		const { name, email, role, password, updatePassword } = await req.json()
		const { userId } = await params

		if (!userId) {
			return handleErrorApi(new Error('User not found'), 'PUT /api/auth/users')
		}

		let hashedPassword = ''

		if (updatePassword) {
			hashedPassword = await hash(password, 12)
		}

		if (updatePassword) {
			await prisma.user.update({
				where: { id: userId },
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
				where: { id: userId },
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

		return handleApiSuccess(
			{
				message: 'Successfully updated user',
				users,
			},
			'PUT /api/auth/users',
		)
	} catch (error) {
		return handleErrorApi(error, 'PUT /api/auth/users')
	}
}

export async function DELETE(_req: NextRequest, { params }: Props) {
	const { userId } = await params

	try {
		const user = await requireAdmin()

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

		return handleApiSuccess(
			{
				message: 'Successfully deleted user',
				currentUser: user.id,
				users,
			},
			'DELETE /api/auth/users',
		)
	} catch (error) {
		return handleErrorApi(error, 'DELETE /api/auth/users')
	}
}
