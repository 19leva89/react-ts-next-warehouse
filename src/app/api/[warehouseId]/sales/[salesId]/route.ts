import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAdminOrSales } from '@/lib/auth'
import { handleErrorApi } from '@/lib/handle-error-server'
import { handleApiSuccess } from '@/lib/handle-success'

interface Props {
	params: Promise<{ warehouseId: string; salesId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
	const { salesId } = await params

	try {
		await requireAdminOrSales()

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

		return handleApiSuccess(sales, 'PUT /api/[warehouseId]/sales/[salesId]')
	} catch (error) {
		console.log(error)

		return handleErrorApi(error, 'PUT /api/[warehouseId]/sales/[salesId]')
	}
}

export async function DELETE(req: NextRequest, { params }: Props) {
	const { salesId } = await params

	try {
		await requireAdminOrSales()

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

		return handleApiSuccess(
			{
				status: 'success',
				message: 'Sales has been deleted',
			},
			'DELETE /api/[warehouseId]/sales/[salesId]',
		)
	} catch (error) {
		return handleErrorApi(error, 'DELETE /api/[warehouseId]/sales/[salesId]')
	}
}
