import crypto from 'crypto'

import { prisma } from '@/lib/prisma'

export const getVerificationTokenByToken = async (token: string) => {
	try {
		const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token: tokenHash },
		})

		return verificationToken
	} catch {
		return null
	}
}

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await prisma.verificationToken.findFirst({
			where: { email },
		})

		return verificationToken
	} catch {
		return null
	}
}
