import { z } from 'zod'

export const RegisterUserSchema = z
	.object({
		name: z
			.string({
				message: 'Name is required',
			})
			.min(1, 'Name is required'),
		email: z.email('Invalid email').min(1, 'Email is required'),
		password: z
			.string({
				message: 'Password is required',
			})
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters'),
		passwordConfirmation: z
			.string({
				message: 'Password confirmation is required',
			})
			.min(1, 'Password confirmation is required'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	})

export const LoginUserSchema = z.object({
	email: z.email('Invalid email').min(1, 'Email is required'),
	password: z
		.string({
			message: 'Password is required',
		})
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters'),
})

export type LoginUserInput = z.infer<typeof LoginUserSchema>
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
