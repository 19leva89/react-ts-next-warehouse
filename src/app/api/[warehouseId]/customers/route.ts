import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

export async function GET() {
	try {
		const customers = await prisma.customer.findMany()

		return handleApiSuccess(customers, 'GET /api/[warehouseId]/customers')
	} catch (error) {
		return handleApiError(error, 'GET /api/[warehouseId]/customers')
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireAdminOrSales()

		const body = await req.json()
		const { name } = body

		const customer = await prisma.customer.create({
			data: {
				name,
			},
		})

		return handleApiSuccess(customer, 'POST /api/[warehouseId]/customers', 201)
	} catch (error) {
		return handleApiError(error, 'POST /api/[warehouseId]/customers')
	}
}
