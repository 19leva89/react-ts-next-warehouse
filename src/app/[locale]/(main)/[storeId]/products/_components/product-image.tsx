import Image from 'next/image'

import { useImageModal } from '@/hooks/use-image-modal'

interface Props {
	imageUrl: string
	productName: string
}

export const ProductImage = ({ imageUrl, productName }: Props) => {
	const imageStore = useImageModal()

	return (
		<div className='flex cursor-pointer items-center justify-center'>
			<Image
				src={imageUrl}
				width={200}
				height={200}
				alt='Product Image'
				className='h-20 w-20 rounded-lg'
				onClick={() => {
					imageStore.imageUrl = imageUrl
					imageStore.productName = productName
					imageStore.onOpen()
				}}
			/>
		</div>
	)
}
