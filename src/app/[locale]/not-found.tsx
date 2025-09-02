import { useTranslations } from 'next-intl'

import { constructMetadata } from '@/lib'
import { InfoBlock } from '@/components/shared'

export const metadata = constructMetadata({ title: 'Page not found' })

const NotFoundPage = () => {
	const t = useTranslations('InfoBlock')

	return (
		<div className='flex min-h-screen w-full items-center justify-center'>
			<InfoBlock
				type='not-found'
				title={t('notFoundTitle')}
				text={t('notFoundText')}
				imageUrl='/assets/img/not-found.png'
			/>
		</div>
	)
}

export default NotFoundPage
