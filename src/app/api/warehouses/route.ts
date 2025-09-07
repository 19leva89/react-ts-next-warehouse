import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/handle-error'
import { requireAdmin, requireAuth } from '@/lib/auth'
import { handleApiSuccess } from '@/lib/handle-success'

export async function GET() {
	try {
		await requireAuth()

		const warehouses = await prisma.warehouse.findFirst()

		if (!warehouses) {
			return handleApiSuccess({ warehouse: null }, 'GET /api/warehouses')
		}

		return handleApiSuccess(
			{
				warehouse: {
					id: warehouses?.id,
					name: warehouses?.name,
				},
			},
			'GET /api/warehouses',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/warehouses')
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireAdmin()

		const body = await req.json()
		const { name } = body

		if (!name) {
			return handleApiError(new Error('Name is required'), 'POST /api/warehouses')
		}

		const warehouse = await prisma.warehouse.create({
			data: {
				name,
			},
		})

		return handleApiSuccess(warehouse, 'POST /api/warehouses', 201)
	} catch (error) {
		return handleApiError(error, 'POST /api/warehouses')
	}
}
