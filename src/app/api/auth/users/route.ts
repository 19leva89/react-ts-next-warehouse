import { hash } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

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

		return handleApiSuccess(
			{
				currentUser: user.id,
				users,
			},
			'GET /api/auth/users',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/auth/users')
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireAdmin()

		const { name, email, role, password, confirmPassword } = await req.json()

		if (password !== confirmPassword) {
			return handleApiError(new Error('Passwords do not match'), 'POST /api/auth/users')
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

		return handleApiSuccess(
			{
				message: 'Successfully created user',
				currentUser: user.id,
				users,
			},
			'POST /api/auth/users',
			201,
		)
	} catch (error) {
		return handleApiError(error, 'POST /api/auth/users')
	}
}
