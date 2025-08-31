'use client'

import Image from 'next/image'

import { Modal } from '@/components/shared/modals'
import { useImageModal } from '@/hooks/use-image-modal'

export const ImageModal = () => {
	const imageStore = useImageModal()

	return (
		<Modal
			title='Foto Produk'
			description={imageStore.productName ?? ''}
			isOpen={imageStore.isOpen}
			onClose={() => {
				imageStore.onClose()
			}}
		>
			<div>
				<Image
					src={imageStore.imageUrl ?? ''}
					alt='Product Image'
					width={1200}
					height={1200}
					loading='lazy'
				/>
			</div>
		</Modal>
	)
}
