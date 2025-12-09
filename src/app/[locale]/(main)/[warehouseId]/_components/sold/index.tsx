'use client'

import axios from 'axios'
import { TruckIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { handleErrorClient } from '@/lib/handle-error-client'
import { LoadingIndicator, Overview, RefreshButton, Subheading } from '@/components/shared'

export const Sold = () => {
	const params = useParams()
	const t = useTranslations('SoldPage')

	const [data, setData] = useState([])
	const [loading, setLoading] = useState<boolean>(true)
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const getSold = useCallback(async () => {
		try {
			const response = await axios.get(`/api/${params.warehouseId}/sold`)
			const data = response.data.data

			setData(data)
		} catch (error) {
			handleErrorClient(error, 'GET_SOLD')
		}
	}, [params.warehouseId])

	const handleRefresh = async () => {
		setRefreshing(true)

		try {
			await getSold()
		} finally {
			setRefreshing(false)
		}
	}

	useEffect(() => {
		const loadInitialData = async () => {
			await getSold()

			setLoading(false)
		}

		loadInitialData()
	}, [getSold])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<div className='flex items-center justify-between'>
				<Subheading icon={TruckIcon} title={t('title')} description={t('description')} />

				<RefreshButton onRefresh={handleRefresh} isRefreshing={refreshing} />
			</div>

			<div className='mt-8'>
				<Overview data={data} />
			</div>
		</div>
	)
}
