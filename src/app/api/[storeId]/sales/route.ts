import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ storeId: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
	const { storeId } = await params

	try {
		const sales = await prisma.sales.findMany({
			where: {
				storeId,
			},
			include: {
				product: true,
				merchant: true,
				user: true,
			},
		})

		return SuccessResponse({
			sales: sales.map((sale) => ({
				id: sale.id,
				addedBy: sale.user?.name ?? 'Deleted User',
				merchantId: sale.merchantId,
				merchantName: sale.merchant?.name ?? 'Deleted Merchant',
				productId: sale.productId,
				productName: sale.product?.name ?? 'Deleted Product',
				saleDate: sale.saleDate,
				quantity: sale.quantity,
			})),
		})
	} catch (error: any) {
		console.error(error)

		return GlobalError(error)
	}
}

export async function POST(req: NextRequest, { params }: Props) {
	const { storeId } = await params

	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || (user?.role !== 'ADMIN' && user?.role !== 'SALES_MANAGER')) {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource.',
			})
		}

		const body = await req.json()
		const { merchantId, productId, quantity, saleDate } = body

		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		})

		if (!product) {
			return GlobalError({
				message: 'Product not found',
				errorCode: 404,
			})
		}

		if (product.stock !== 0) {
			if (product.stock < quantity) {
				return GlobalError({
					message: 'The quantity is greater than the stock',
					errorCode: 400,
				})
			}

			await prisma.product.update({
				where: {
					id: productId,
				},
				data: {
					stock: product?.stock - quantity,
				},
			})
		}

		const sales = await prisma.sales.create({
			data: {
				quantity,
				unitPrice: product.price, // Use the product's price as unit price
				totalAmount: product.price.mul(quantity), // Calculate total amount
				saleDate: saleDate,
				merchantId,
				storeId,
				userId,
				productId: productId,
			},
		})

		return SuccessResponse(sales)
	} catch (error: any) {
		console.error(error)

		return GlobalError(error)
	}
}
