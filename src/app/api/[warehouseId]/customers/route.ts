import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET() {
	try {
		const customers = await prisma.customer.findMany()

		return SuccessResponse(customers)
	} catch (error: any) {
		return GlobalError(error)
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

		return SuccessResponse(customer)
	} catch (error: any) {
		return GlobalError(error)
	}
}
