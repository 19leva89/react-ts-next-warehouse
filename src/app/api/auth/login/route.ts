import { compare } from 'bcrypt-ts'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { signJWT } from '@/lib/token'
import { GlobalError, SuccessResponse } from '@/lib/helper'
import { LoginUserInput, LoginUserSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as LoginUserInput
		const data = LoginUserSchema.parse(body)

		const user = await prisma.user.findUnique({
			where: {
				email: data.email.toLowerCase(),
			},
		})

		if (!user || !(await compare(data.password, user.password))) {
			return GlobalError({
				message: 'Invalid email or password.',
				errorCode: 400,
			})
		}

		const jwtExpiresIn = process.env.JWT_EXPIRES_IN!

		const token = await signJWT({ sub: user.id }, { expiresIn: `${jwtExpiresIn}d` })

		const tokenMaxAge = parseInt(jwtExpiresIn) * 24 * 60 * 60
		const cookieOptions = {
			name: 'token',
			value: token,
			httpOnly: true,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			maxAge: tokenMaxAge,
		}

		const response = SuccessResponse({
			status: 'success',
			message: 'Successfully logged in.',
			token,
		})

		await Promise.all([
			response.cookies.set(cookieOptions),

			response.cookies.set({
				name: 'userId',
				value: user.id,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: tokenMaxAge,
			}),

			response.cookies.set({
				name: 'loggedIn',
				value: 'true',
				secure: process.env.NODE_ENV === 'production',
				maxAge: tokenMaxAge,
			}),
		])

		return response
	} catch (error: any) {
		return GlobalError(error)
	}
}
