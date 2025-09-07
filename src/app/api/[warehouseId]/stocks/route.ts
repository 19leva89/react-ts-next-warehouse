import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
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

		return handleApiSuccess(
			{
				products,
			},
			'GET /api/[warehouseId]/stocks',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/[warehouseId]/stocks')
	}
}
