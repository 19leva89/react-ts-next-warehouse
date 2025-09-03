'use client'

import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { useProductModal } from '@/hooks/use-product-modal'

export const AddProductButton = () => {
	const t = useTranslations('Products')
	const productModalWarehouse = useProductModal()

	return (
		<Button onClick={() => productModalWarehouse.onOpen()}>
			<PlusIcon className='mr-2 size-4' />

			{t('addProductButton')}
		</Button>
	)
}
