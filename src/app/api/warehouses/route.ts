import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

export async function GET(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		if (!userId) {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

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
