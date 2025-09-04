import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string; salesId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { salesId } = await params

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
		const { customerId, productId, saleDate, quantity, previousQuantity } = body

		const oldProduct = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		})

		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				stock: oldProduct?.stock + previousQuantity,
			},
		})

		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		})

		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				stock: (product?.stock ?? 0) - quantity,
			},
		})

		const sales = await prisma.sales.update({
			where: {
				id: salesId,
			},
			data: {
				customerId,
				productId,
				saleDate,
				quantity,
			},
		})

		return SuccessResponse(sales)
	} catch (error: any) {
		console.log(error)

		return GlobalError(error)
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { salesId } = await params

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
		const { productId, quantity } = body

		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		})

		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				stock: product?.stock + quantity,
			},
		})

		await prisma.sales.delete({
			where: {
				id: salesId,
			},
		})

		return SuccessResponse({
			status: 'success',
			message: 'Sales has been deleted',
		})
	} catch (error: any) {
		console.error(error)

		return GlobalError(error)
	}
}
