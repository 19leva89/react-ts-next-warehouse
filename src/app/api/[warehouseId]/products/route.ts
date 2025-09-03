import { NextRequest } from 'next/server'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { prisma } from '@/lib/prisma'
import { storage } from '@/lib/firebase'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

interface Props {
	params: Promise<{ warehouseId: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		const products = await prisma.product.findMany({
			where: {
				warehouseId: warehouseId,
			},
		})

		return SuccessResponse({
			products,
		})
	} catch (error: any) {
		console.error(error)
		return GlobalError(error)
	}
}

export async function POST(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || (user?.role !== 'ADMIN' && user?.role !== 'PRODUCT_MANAGER')) {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

		const body = await req.formData()

		const name = body.get('name') as string
		const description = body.get('description') as string
		const stockThreshold = parseInt(body.get('stockThreshold') as string)
		const stock = parseInt(body.get('stock') as string)
		const price = parseFloat(body.get('price') as string) || 0
		const isActive = body.get('isActive') === 'true' // or use a checkbox/select in your form
		const image: File | null = body.get('image') as unknown as File

		let imageId = 'default'
		let imageUrl = '/uploads/default.jpg'

		if (image) {
			const bytes = await image.arrayBuffer()
			const buffer = Buffer.from(bytes)

			const fileName = image.name
			const fileExtension = fileName.split('.').pop()
			const newFileName = `${Date.now()}.${fileExtension}`

			const fileRef = ref(storage, `products/${newFileName}`)
			await uploadBytes(fileRef, buffer)

			// getDownloadURL
			const url = await getDownloadURL(fileRef)
			imageId = newFileName
			imageUrl = url
		}

		const product = await prisma.product.create({
			data: {
				name,
				imageId,
				imageUrl,
				description,
				price,
				stock,
				stockThreshold,
				isActive,
				warehouseId,
			},
		})

		return SuccessResponse(product)
	} catch (error: any) {
		console.error(error)
		return GlobalError(error)
	}
}
