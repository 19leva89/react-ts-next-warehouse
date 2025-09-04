import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

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
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || (user?.role !== 'ADMIN' && user?.role !== 'SALES_MANAGER')) {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

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
