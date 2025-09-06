import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { GlobalError, SuccessResponse } from '@/lib/helper'

export async function GET() {
	try {
		const user = await getCurrentUser()

		return SuccessResponse({
			user: {
				role: user?.role,
				email: user?.email,
				name: user?.name,
				isOAuth: user?.accounts?.length ?? 0 > 0,
				isTwoFactorEnabled: user?.isTwoFactorEnabled,
			},
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}

export async function PUT(req: NextRequest) {
	try {
		const user = await getCurrentUser()

		const { name, email, isTwoFactorEnabled } = await req.json()

		const updatedUser = await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				name,
				email,
				isTwoFactorEnabled,
			},
		})

		return SuccessResponse({
			user: {
				name: updatedUser.name,
				email: updatedUser.email,
				isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
			},
		})
	} catch (error: any) {
		return GlobalError(error)
	}
}
