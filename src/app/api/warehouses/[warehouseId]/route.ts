import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { handleErrorApi } from '@/lib/handle-error-server'
import { handleApiSuccess } from '@/lib/handle-success'

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

		return handleApiSuccess(warehouse, 'PUT /api/warehouses/[warehouseId]')
	} catch (error) {
		return handleErrorApi(error, 'PUT /api/warehouses/[warehouseId]')
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

		return handleApiSuccess(
			{
				status: 'success',
				message: 'Warehouse deleted successfully',
			},
			'DELETE /api/warehouses/[warehouseId]',
		)
	} catch (error) {
		return handleErrorApi(error, 'DELETE /api/warehouses/[warehouseId]')
	}
}
