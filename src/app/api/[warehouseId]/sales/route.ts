import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		const sales = await prisma.sales.findMany({
			where: {
				warehouseId,
			},
			include: {
				product: true,
				customer: true,
				user: true,
			},
		})

		return SuccessResponse({
			sales: sales.map((sale) => ({
				id: sale.id,
				addedBy: sale.user?.name ?? 'Deleted user',
				customerId: sale.customerId,
				customerName: sale.customer?.name ?? 'Deleted customer',
				productId: sale.productId,
				productName: sale.product?.name ?? 'Deleted product',
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
	const { warehouseId } = await params

	try {
		const user = await requireAdminOrSales()

		const body = await req.json()
		const { customerId, productId, quantity, saleDate } = body

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
				totalAmount: product.price * quantity, // Calculate total amount
				saleDate: saleDate,
				customerId,
				warehouseId,
				userId: user.id,
				productId: productId,
			},
		})

		return SuccessResponse(sales)
	} catch (error: any) {
		console.error(error)

		return GlobalError(error)
	}
}
