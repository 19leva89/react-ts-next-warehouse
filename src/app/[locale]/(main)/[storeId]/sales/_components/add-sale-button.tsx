'use client'

import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useSaleModal } from '@/hooks/use-sale-modal'

export const AddSaleButton = () => {
	const t = useTranslations('Sales')
	const saleStore = useSaleModal()

	return (
		<Button onClick={() => saleStore.onOpen()}>
			<PlusIcon className='mr-2 size-4' />

			{t('addSaleButton')}
		</Button>
	)
}
