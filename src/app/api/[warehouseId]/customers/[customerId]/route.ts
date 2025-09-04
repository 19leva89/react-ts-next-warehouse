import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ customerId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { customerId } = await params

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

		const customer = await prisma.customer.update({
			where: {
				id: customerId,
			},
			data: {
				name,
			},
		})

		return SuccessResponse(customer)
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { customerId } = await params

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

		const customer = await prisma.customer.delete({
			where: {
				id: customerId,
			},
		})

		return SuccessResponse(customer)
	} catch (error: any) {
		return GlobalError(error)
	}
}
