import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

interface RankingData {
	productId: string
	productName: string
	quantity: number
}

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		const sales = await prisma.sales.findMany({
			where: {
				warehouseId,
				saleDate: {
					gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
					lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
				},
			},
			include: {
				product: true,
			},
		})

		const ranking: RankingData[] = []

		sales.forEach((sale) => {
			const product = ranking.find((product) => product.productId === sale.productId)

			if (product) {
				product.quantity += sale.quantity
			} else {
				ranking.push({
					productId: sale.productId,
					productName: sale.product.name,
					quantity: sale.quantity,
				})
			}
		})

		const sortedRanking = ranking.sort((a, b) => b.quantity - a.quantity)

		let topFive: RankingData[] = []
		let bottomFive: RankingData[] = []

		if (sortedRanking.length > 10) {
			topFive = sortedRanking.slice(0, 5)
			bottomFive = sortedRanking.slice(-5)
		} else if (sortedRanking.length > 5) {
			topFive = sortedRanking.slice(0, 5)
			bottomFive = sortedRanking.slice(5 - sortedRanking.length)
		} else {
			topFive = sortedRanking
		}

		return handleApiSuccess(
			{
				status: 'success',
				topFive,
				bottomFive,
			},
			'GET /api/[warehouseId]/rank',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/[warehouseId]/rank')
	}
}
