'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { CrownIcon, HistoryIcon, MedalIcon } from 'lucide-react'

import { LoadingIndicator, RefreshButton, Subheading } from '@/components/shared'

interface RankingData {
	productId: string
	productName: string
	quantity: number
}

export const Rank = () => {
	const params = useParams()
	const t = useTranslations('RankPage')

	const [loading, setLoading] = useState<boolean>(true)
	const [topFive, setTopFive] = useState<RankingData[]>([])
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [bottomFive, setBottomFive] = useState<RankingData[]>([])

	const getRank = useCallback(async () => {
		try {
			const response = await axios.get(`/api/${params.warehouseId}/rank`)
			const top = response.data.topFive
			const bottom = response.data.bottomFive

			setTopFive(top)
			setBottomFive(bottom)
		} catch (error) {
			console.error('Failed to fetch ranking data:', error)
		}
	}, [params.warehouseId])

	const handleRefresh = async () => {
		setRefreshing(true)

		try {
			await getRank()
		} finally {
			setRefreshing(false)
		}
	}

	useEffect(() => {
		const loadInitialData = async () => {
			await getRank()

			setLoading(false)
		}

		loadInitialData()
	}, [getRank])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<div className='flex items-center justify-between'>
				<Subheading icon={MedalIcon} title={t('title')} description={t('description')} />

				<RefreshButton onRefresh={handleRefresh} isRefreshing={refreshing} />
			</div>

			<div className='mt-8'>
				<div className='flex flex-col gap-4 md:flex-row'>
					<div className='w-full md:w-1/2'>
						<div className='w-full rounded-lg bg-slate-200 p-4'>
							<Subheading icon={CrownIcon} title={t('5topTitle')} description={t('5topDescription')} />
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
							<Subheading
								icon={HistoryIcon}
								title={t('5bottomTitle')}
								description={t('5bottomDescription')}
							/>
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
