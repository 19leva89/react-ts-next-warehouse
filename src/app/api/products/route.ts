import { NextRequest } from 'next/server'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { prisma } from '@/lib/prisma'
import { storage } from '@/lib/firebase'
import { requireAdminOrProduct } from '@/lib/auth'
import { handleErrorApi } from '@/lib/handle-error-server'
import { handleApiSuccess } from '@/lib/handle-success'

export async function GET() {
	try {
		await requireAdminOrProduct()

		const products = await prisma.product.findMany({
			select: {
				id: true,
				name: true,
				imageUrl: true,
				description: true,
				price: true,
				stock: true,
				stockThreshold: true,
				isActive: true,
			},
		})

		return handleApiSuccess(
			{
				products,
			},
			'GET /api/products',
		)
	} catch (error) {
		return handleErrorApi(error, 'GET /api/products')
	}
}

export async function POST(req: NextRequest) {
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
			},
		})

		return handleApiSuccess(product, 'POST /api/products', 201)
	} catch (error) {
		return handleErrorApi(error, 'POST /api/products')
	}
}
