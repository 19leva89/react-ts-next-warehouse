import { prisma } from '@/lib/prisma'

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				role: true,
				name: true,
				email: true,
				emailVerified: true,
				isTwoFactorEnabled: true,
				// Only include non-sensitive account identifiers
				accounts: {
					select: {
						provider: true,
						providerAccountId: true,
						type: true,
					},
				},
			},
		})

		return user
	} catch {
		return null
	}
}

export const getUserByEmail = async (email: string) => {
	try {
		const normalized = email.trim().toLowerCase()
		const user = await prisma.user.findUnique({
			where: { email: normalized },
			select: {
				id: true,
				role: true,
				name: true,
				email: true,
				password: true,
				emailVerified: true,
				isTwoFactorEnabled: true,
				accounts: {
					select: {
						provider: true,
						providerAccountId: true,
						type: true,
					},
				},
			},
		})

		return user
	} catch {
		return null
	}
}
