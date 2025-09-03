import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		const products = await prisma.product.findMany({
			where: {
				warehouseId: warehouseId,
				stock: {
					lt: prisma.product.fields.stockThreshold,
				},
			},
			select: {
				id: true,
				name: true,
				stockThreshold: true,
				stock: true,
			},
			orderBy: {
				stock: 'asc',
			},
			take: 10,
		})

		return SuccessResponse({
			products,
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
