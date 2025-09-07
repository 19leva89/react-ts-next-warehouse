import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { handleApiError } from '@/lib/handle-error'
import { handleApiSuccess } from '@/lib/handle-success'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
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

		return handleApiSuccess(
			{
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
			},
			'GET /api/[warehouseId]/sales',
		)
	} catch (error) {
		return handleApiError(error, 'GET /api/[warehouseId]/sales')
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
			return handleApiError(new Error('Product not found'), 'POST /api/[warehouseId]/sales')
		}

		if (product.stock !== 0) {
			if (product.stock < quantity) {
				return handleApiError(new Error('Product stock is not enough'), 'POST /api/[warehouseId]/sales')
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

		return handleApiSuccess(sales, 'POST /api/[warehouseId]/sales', 201)
	} catch (error) {
		return handleApiError(error, 'POST /api/[warehouseId]/sales')
	}
}
