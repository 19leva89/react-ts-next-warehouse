import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useImageModal } from '@/hooks/use-image-modal'

interface Props {
	imageUrl: string
	productName: string
}

export const ProductImage = ({ imageUrl, productName }: Props) => {
	const t = useTranslations('Products')
	const imageWarehouse = useImageModal()

	return (
		<div className='flex cursor-pointer items-center justify-center hover:cursor-zoom-in'>
			<Image
				src={imageUrl}
				alt={productName ?? t('productName')}
				width={200}
				height={200}
				onClick={() => {
					imageWarehouse.imageUrl = imageUrl
					imageWarehouse.productName = productName
					imageWarehouse.onOpen()
				}}
				className='size-20 rounded-lg'
			/>
		</div>
	)
}
