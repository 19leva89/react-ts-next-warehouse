import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getCurrentUser = async () => {
	const session = await auth()

	if (!session?.user?.id) {
		return null
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			role: true,
			email: true,
			name: true,
		},
	})

	return user
}

export const getCurrentUserWithPassword = async () => {
	const session = await auth()

	if (!session?.user?.id) {
		return null
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			role: true,
			email: true,
			name: true,
			password: true,
		},
	})

	return user
}

export const getCurrentRole = async () => {
	const session = await auth()

	return session?.user?.role
}

export const requireAuth = async () => {
	const user = await getCurrentUser()

	if (!user) {
		throw new Error('You are not authorized to access this resource')
	}

	return user
}

export const requireAdmin = async () => {
	const user = await requireAuth()

	if (user.role !== 'ADMIN') {
		throw new Error('You are not authorized to access this resource')
	}

	return user
}

export const requireAdminOrProduct = async () => {
	const user = await requireAuth()

	if (user.role !== 'ADMIN' && user.role !== 'PRODUCT_MANAGER') {
		throw new Error('You are not authorized to access this resource')
	}

	return user
}

export const requireAdminOrSales = async () => {
	const user = await requireAuth()

	if (user.role !== 'ADMIN' && user.role !== 'SALES_MANAGER') {
		throw new Error('You are not authorized to access this resource')
	}

	return user
}
