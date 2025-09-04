'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { PackageXIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { StockDataTable } from './data-table'
import { StockColumn, StockColumns } from './columns'
import { LoadingIndicator, Subheading } from '@/components/shared'

export const Stock = () => {
	const params = useParams()
	const t = useTranslations('StockPage')

	const [loading, setLoading] = useState<boolean>(true)
	const [stocks, setStocks] = useState<StockColumn[]>([])

	useEffect(() => {
		const getStocks = async () => {
			const response = await axios.get(`/api/${params.warehouseId}/stocks`)
			const data = response.data.products as StockColumn[]

			setStocks(data)
			setLoading(false)
		}

		getStocks()

		const interval = setInterval(() => {
			getStocks()
		}, 5000)

		return () => clearInterval(interval)
	}, [params.warehouseId])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<Subheading icon={PackageXIcon} title={t('title')} description={t('description')} />

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
