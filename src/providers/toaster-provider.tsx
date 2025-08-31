'use client'

import { Toaster } from '@/components/ui'

export const ToasterProvider = () => {
	return <Toaster position='bottom-right' expand={false} richColors />
}
