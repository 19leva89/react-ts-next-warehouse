'use server'

import { getUserByEmail } from '@/data/user'
// import { sendPasswordResetEmail } from '@/lib/send-email'
import { generatePasswordResetToken } from '@/lib/tokens'
import { createResetSchema, TResetValues } from '@/lib/validations/user-schema'

export const resetPassword = async (values: TResetValues) => {
	const validatedFields = createResetSchema((key: string) => key).safeParse(values)

	if (!validatedFields.success) {
		return { error: 'Invalid emaiL!' }
	}

	const { email } = validatedFields.data

	const existingUser = await getUserByEmail(email)

	if (!existingUser) {
		return { error: 'Email not found!' }
	}

	// Check if user has a password (not a social login)
	if (!existingUser.password) {
		return { error: 'This email is linked to a social login. Please use GitHub or Google' }
	}

	const passwordResetToken = await generatePasswordResetToken(email)
	// await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

	return { success: 'Reset email sent!' }
}
