'use client'

import axios from 'axios'
import { MedalIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { LoadingIndicator, Subheading } from '@/components/shared'

interface RankingData {
	productId: string
	productName: string
	quantity: number
}

export const Rank = () => {
	const t = useTranslations('RankPage')
	const params = useParams()

	const [topFive, setTopFive] = useState<RankingData[]>([])
	const [bottomFive, setBottomFive] = useState<RankingData[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const getSold = async () => {
			const response = await axios.get(`/api/${params.storeId}/rank`)
			const top = response.data.topFive
			const bottom = response.data.bottomFive

			setTopFive(top)
			setBottomFive(bottom)
			setLoading(false)
		}

		getSold()
	}, [params.storeId])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<Subheading icon={<MedalIcon className='size-8' />} title={t('title')} description={t('description')} />

			<div className='mt-8'>
				<div className='flex flex-col gap-4 md:flex-row'>
					<div className='w-full md:w-1/2'>
						<div className='w-full rounded-lg bg-slate-200 p-4'>
							<Subheading title={t('5topTitle')} description={t('5topDescription')} icon />
						</div>

						<div className='mt-4'>
							<ul className='w-full'>
								{topFive.length ? (
									topFive.map((product) => (
										<li
											key={product.productId}
											className='mb-2 flex items-center justify-between rounded-lg bg-slate-200 p-4'
										>
											<p className='text-lg font-semibold'>{product.productName}</p>

											<p className='text-lg font-semibold'>{product.quantity} pcs</p>
										</li>
									))
								) : (
									<div className='flex w-full items-center justify-center p-4'>
										<p className='text-lg font-semibold'>{t('noProduct')}</p>
									</div>
								)}
							</ul>
						</div>
					</div>

					<div className='w-full md:w-1/2'>
						<div className='w-full rounded-lg bg-slate-200 p-4'>
							<Subheading title={t('5bottomTitle')} description={t('5bottomDescription')} icon />
						</div>

						<div className='mt-4'>
							<ul className='w-full'>
								{bottomFive.length ? (
									bottomFive.map((product) => (
										<li
											key={product.productId}
											className='mb-2 flex items-center justify-between rounded-lg bg-slate-200 p-4'
										>
											<p className='text-lg font-semibold'>{product.productName}</p>

											<p className='text-lg font-semibold'>{product.quantity} pcs</p>
										</li>
									))
								) : (
									<div className='flex w-full items-center justify-center p-4'>
										<p className='text-lg font-semibold'>{t('noProduct')}</p>
									</div>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
