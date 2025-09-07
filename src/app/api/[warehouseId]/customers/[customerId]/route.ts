import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

interface Props {
	params: Promise<{ customerId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { customerId } = await params

	try {
		await requireAdminOrSales()

		const body = await req.json()
		const { name } = body

		const customer = await prisma.customer.update({
			where: {
				id: customerId,
			},
			data: {
				name,
			},
		})

		return handleApiSuccess(customer, 'PUT /api/[warehouseId]/customers/[customerId]')
	} catch (error) {
		return handleApiError(error, 'PUT /api/[warehouseId]/customers/[customerId]')
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { customerId } = await params

	try {
		await requireAdminOrSales()

		const customer = await prisma.customer.delete({
			where: {
				id: customerId,
			},
		})

		return handleApiSuccess(customer, 'DELETE /api/[warehouseId]/customers/[customerId]')
	} catch (error) {
		return handleApiError(error, 'DELETE /api/[warehouseId]/customers/[customerId]')
	}
}
