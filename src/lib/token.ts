import { SignJWT, jwtVerify } from 'jose'

export const signJWT = async (payload: { sub: string }, options: { expiresIn: string }) => {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET_TOKEN)
		const alg = 'HS256'
		return new SignJWT(payload)
			.setProtectedHeader({ alg })
			.setExpirationTime(options.expiresIn)
			.setIssuedAt()
			.setSubject(payload.sub)
			.sign(secret)
	} catch (error) {
		throw error
	}
}

export const verifyJWT = async <T>(token: string): Promise<T> => {
	try {
		return (await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_TOKEN))).payload as T
	} catch {
		throw new Error('Your token has expired.')
	}
}
