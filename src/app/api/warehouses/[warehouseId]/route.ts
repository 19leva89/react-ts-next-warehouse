import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

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

		const body = await req.json()
		const { name } = body

		const warehouse = await prisma.warehouse.update({
			where: {
				id: warehouseId,
			},
			data: {
				name: name,
			},
		})

		return SuccessResponse(warehouse)
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

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

		await prisma.warehouse.delete({
			where: {
				id: warehouseId,
			},
		})

		return SuccessResponse({
			status: 'success',
			message: 'Warehouse deleted successfully',
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
