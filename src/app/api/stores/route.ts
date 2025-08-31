import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { GlobalError, SuccessResponse, UnauthorizedError } from '@/lib/helper'

export async function GET(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		if (!userId) {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

		const stores = await prisma.store.findFirst()

		if (!stores) {
			return SuccessResponse({
				store: null,
			})
		}

		return SuccessResponse({
			store: {
				id: stores?.id,
				name: stores?.name,
			},
		})
	} catch {}
}

export async function POST(req: NextRequest) {
	try {
		const userId = req.cookies.get('userId')?.value

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!userId || user?.role !== 'ADMIN') {
			return UnauthorizedError({
				message: 'You are not authorized to access this resource',
			})
		}

		const body = await req.json()
		const { name } = body

		if (!name) {
			return GlobalError({
				message: 'Name is required',
				errorCode: 400,
			})
		}

		const store = await prisma.store.create({
			data: {
				name,
			},
		})

		return SuccessResponse(store)
	} catch (error: any) {
		return GlobalError(error)
	}
}
