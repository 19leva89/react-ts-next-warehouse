'use client'

import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { useProductModal } from '@/hooks/use-product-modal'

export const AddProductButton = () => {
	const t = useTranslations('Products')
	const productModalStore = useProductModal()

	return (
		<Button onClick={() => productModalStore.onOpen()}>
			<PlusIcon className='mr-2 size-4' />

			{t('addProductButton')}
		</Button>
	)
}
