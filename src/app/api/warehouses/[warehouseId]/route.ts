import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		await requireAdmin()

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

export async function DELETE(_req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		await requireAdmin()

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
