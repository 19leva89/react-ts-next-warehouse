'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Modal } from '@/components/shared/modals'
import { useImageModal } from '@/hooks/use-image-modal'

export const ImageModal = () => {
	const t = useTranslations('Products')
	const imageWarehouse = useImageModal()

	return (
		<Modal
			title={t('productImage')}
			description={imageWarehouse.productName ?? ''}
			isOpen={imageWarehouse.isOpen}
			onClose={() => {
				imageWarehouse.onClose()
			}}
		>
			<div>
				<Image
					src={imageWarehouse.imageUrl ?? ''}
					alt={imageWarehouse.productName ?? t('productName')}
					width={1200}
					height={1200}
					loading='lazy'
				/>
			</div>
		</Modal>
	)
}
