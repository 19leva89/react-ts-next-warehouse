import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdmin, requireAuth } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET() {
	try {
		await requireAuth()

		const warehouses = await prisma.warehouse.findFirst()

		if (!warehouses) {
			return SuccessResponse({
				warehouse: null,
			})
		}

		return SuccessResponse({
			warehouse: {
				id: warehouses?.id,
				name: warehouses?.name,
			},
		})
	} catch {}
}

export async function POST(req: NextRequest) {
	try {
		await requireAdmin()

		const body = await req.json()
		const { name } = body

		if (!name) {
			return GlobalError({
				message: 'Name is required',
				errorCode: 400,
			})
		}

		const warehouse = await prisma.warehouse.create({
			data: {
				name,
			},
		})

		return SuccessResponse(warehouse)
	} catch (error: any) {
		return GlobalError(error)
	}
}
