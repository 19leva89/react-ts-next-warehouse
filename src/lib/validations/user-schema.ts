import { z } from 'zod'

import { createRegisterSchema, TRegisterValues } from '@/lib/validations/auth-schema'

export const createUserFormSchema = (t: (key: string) => string) => {
	return createRegisterSchema(t).safeExtend({
		role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER', 'VIEWER']),
	})
}

export type TUserFormValues = TRegisterValues & {
	role: 'ADMIN' | 'PRODUCT_MANAGER' | 'SALES_MANAGER' | 'VIEWER'
}
