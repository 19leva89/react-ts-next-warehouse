'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { PackageXIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { StockDataTable } from './data-table'
import { StockColumn, StockColumns } from './columns'
import { handleErrorClient } from '@/lib/handle-error-client'
import { LoadingIndicator, RefreshButton, Subheading } from '@/components/shared'

export const Stock = () => {
	const params = useParams()
	const t = useTranslations('StockPage')

	const [loading, setLoading] = useState<boolean>(true)
	const [stocks, setStocks] = useState<StockColumn[]>([])
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const getStock = useCallback(async () => {
		try {
			const response = await axios.get(`/api/${params.warehouseId}/stocks`)
			const data = response.data.products as StockColumn[]

			setStocks(data)
		} catch (error) {
			handleErrorClient(error, 'GET_STOCK')
		}
	}, [params.warehouseId])

	const handleRefresh = async () => {
		setRefreshing(true)

		try {
			await getStock()
		} finally {
			setRefreshing(false)
		}
	}

	useEffect(() => {
		const loadInitialData = async () => {
			await getStock()

			setLoading(false)
		}

		loadInitialData()
	}, [getStock])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<div className='flex items-center justify-between'>
				<Subheading icon={PackageXIcon} title={t('title')} description={t('description')} />

				<RefreshButton onRefresh={handleRefresh} isRefreshing={refreshing} />
			</div>

			<div className='mt-4'>
				{stocks.length > 0 ? (
					<StockDataTable
						columns={StockColumns}
						data={stocks}
						searchKey='name'
						placeholder={t('searchPlaceholder')}
					/>
				) : (
					<div className='flex items-center justify-center p-16'>
						<p className='text-gray-500'>{t('noEmptyStock')}</p>
					</div>
				)}
			</div>
		</div>
	)
}
