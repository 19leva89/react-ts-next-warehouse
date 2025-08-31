import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ storeId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { storeId } = await params

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

		const body = await req.json()
		const { name } = body

		const store = await prisma.store.update({
			where: {
				id: storeId,
			},
			data: {
				name: name,
			},
		})

		return SuccessResponse(store)
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { storeId } = await params

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

		await prisma.store.delete({
			where: {
				id: storeId,
			},
		})

		return SuccessResponse({
			status: 'success',
			message: 'Store deleted successfully.',
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
