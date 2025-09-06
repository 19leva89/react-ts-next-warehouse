'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ArrowLeftIcon, RefreshCwIcon, UserIcon } from 'lucide-react'

import { cn } from '@/lib'
import { Button } from '@/components/ui'
import { Title } from '@/components/shared'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'

interface Props {
	type: 'auth' | 'not-found'
	title: string
	text: string
	imageUrl: string
	className?: string
}

export const InfoBlock = ({ title, text, imageUrl, type, className }: Props) => {
	const router = useRouter()
	const t = useTranslations('InfoBlock')

	const [loading, setLoading] = useState<boolean>(false)

	const handleRefresh = () => {
		setLoading(true)

		router.refresh()

		// Reset loading state after a short delay to ensure the animation is visible
		setTimeout(() => setLoading(false), 1000)
	}

	return (
		<div className={cn(className, 'm-4 flex flex-wrap items-center justify-center gap-12')}>
			<div className='flex flex-col'>
				<div className='w-full'>
					<Title size='lg' text={title} className='font-extrabold' />

					<p className='text-lg text-gray-400'>{text}</p>
				</div>

				<div className='mt-11 flex gap-5'>
					<Button
						variant='default'
						size='lg'
						onClick={() => router.push('/')}
						className='rounded-xl text-white transition-colors duration-300 ease-in-out'
					>
						<ArrowLeftIcon size={16} />

						{t('back')}
					</Button>

					{type === 'auth' ? (
						<Button
							variant='outline'
							size='lg'
							onClick={() => router.push('/auth/login')}
							className='rounded-xl transition-colors duration-300 ease-in-out'
						>
							<UserIcon size={16} />

							{t('signIn')}
						</Button>
					) : (
						<Button
							variant='outline'
							size='lg'
							onClick={handleRefresh}
							className='rounded-xl transition-colors duration-300 ease-in-out'
						>
							<RefreshCwIcon size={16} className={`size-4 ${loading ? 'animate-spin' : ''}`} />

							{t('refresh')}
						</Button>
					)}
				</div>
			</div>

			<Image src={imageUrl} alt={title} width={300} height={300} />
		</div>
	)
}
