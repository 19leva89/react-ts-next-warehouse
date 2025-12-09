import { NextRequest } from 'next/server'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { prisma } from '@/lib/prisma'
import { storage } from '@/lib/firebase'
import { requireAdminOrProduct } from '@/lib/auth'
import { handleErrorApi } from '@/lib/handle-error-server'
import { handleApiSuccess } from '@/lib/handle-success'

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

		return handleApiSuccess(
			{
				products,
			},
			'GET /api/[warehouseId]/products',
		)
	} catch (error) {
		return handleErrorApi(error, 'GET /api/[warehouseId]/products')
	}
}

export async function POST(req: NextRequest, { params }: Props) {
	const { warehouseId } = await params

	try {
		await requireAdminOrProduct()

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

		return handleApiSuccess(product, 'POST /api/[warehouseId]/products', 201)
	} catch (error) {
		return handleErrorApi(error, 'POST /api/[warehouseId]/products')
	}
}
