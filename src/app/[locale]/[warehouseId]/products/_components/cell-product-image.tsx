import { useTranslations } from 'next-intl'

import { ProductImage } from './product-image'

export const ProductImageCell = ({ image, name }: { image: string; name: string }) => {
	const t = useTranslations('Products')

	if (image === '') {
		const parts = t('noImage').split(' ')

		return (
			<div className='flex items-center justify-center'>
				<div className='flex size-20 items-center justify-center rounded-lg bg-gray-300 p-1 text-center text-xs leading-tight'>
					{parts.length > 1 ? (
						<span>
							{parts[0]}
							<br />
							{parts[1]}
							<br />
							{parts[2]}
						</span>
					) : (
						<span className='break-words'>{t('noImage')}</span>
					)}
				</div>
			</div>
		)
	}

	return <ProductImage imageUrl={image} productName={name} />
}
