import { z } from 'zod'

export const createRegisterSchema = (t: (key: string) => string) => {
	const passwordSchema = z
		.string()
		.min(8, { message: t('passwordMinLength') })
		.regex(/[A-Z]/, { message: t('passwordUppercase') })
		.regex(/[a-z]/, { message: t('passwordLowercase') })
		.regex(/\d/, { message: t('passwordDigit') })

	return createLoginSchema(t)
		.omit({ rememberMe: true })
		.extend({
			name: z.string().min(2, { message: t('nameRequired') }),
			confirmPassword: passwordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordsNotMatch'),
			path: ['confirmPassword'],
		})
}

export const createLoginSchema = (t: (key: string) => string) => {
	const passwordSchema = z
		.string()
		.min(8, { message: t('passwordMinLength') })
		.regex(/[A-Z]/, { message: t('passwordUppercase') })
		.regex(/[a-z]/, { message: t('passwordLowercase') })
		.regex(/\d/, { message: t('passwordDigit') })

	return z.object({
		email: z
			.email({ message: t('emailInvalid') })
			.trim()
			.toLowerCase(),
		password: passwordSchema,
		code: z.optional(z.string()),
		rememberMe: z.preprocess((val) => (typeof val === 'string' ? val === 'true' : val), z.boolean()),
	})
}

export const createNewPasswordSchema = (t: (key: string) => string) => {
	const passwordSchema = z
		.string()
		.min(8, { message: t('passwordMinLength') })
		.regex(/[A-Z]/, { message: t('passwordUppercase') })
		.regex(/[a-z]/, { message: t('passwordLowercase') })
		.regex(/\d/, { message: t('passwordDigit') })

	return z
		.object({
			password: passwordSchema,
			confirmPassword: z.string().min(1, { message: t('confirmPasswordRequired') }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordsNotMatch'),
			path: ['confirmPassword'],
		})
}

export const createChangePasswordSchema = (t: (key: string) => string) => {
	const passwordSchema = z
		.string()
		.min(8, { message: t('passwordMinLength') })
		.regex(/[A-Z]/, { message: t('passwordUppercase') })
		.regex(/[a-z]/, { message: t('passwordLowercase') })
		.regex(/\d/, { message: t('passwordDigit') })

	return z
		.object({
			oldPassword: z.string().min(1, { message: t('oldPasswordRequired') }),
			password: passwordSchema,
			confirmPassword: z.string().min(1, { message: t('confirmPasswordRequired') }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordsNotMatch'),
			path: ['confirmPassword'],
		})
}

export const createResetSchema = (t: (key: string) => string) => {
	return z.object({
		email: z
			.email({
				message: t('emailRequired'),
			})
			.trim()
			.toLowerCase(),
	})
}

export type TRegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>
export type TLoginValues = z.infer<ReturnType<typeof createLoginSchema>>
export type TNewPasswordValues = z.infer<ReturnType<typeof createNewPasswordSchema>>
export type TChangePasswordValues = z.infer<ReturnType<typeof createChangePasswordSchema>>
export type TResetValues = z.infer<ReturnType<typeof createResetSchema>>
