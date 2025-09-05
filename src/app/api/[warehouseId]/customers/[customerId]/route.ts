import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

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

		return SuccessResponse(customer)
	} catch (error: any) {
		return GlobalError(error)
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

		return SuccessResponse(customer)
	} catch (error: any) {
		return GlobalError(error)
	}
}
