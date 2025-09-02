'use client'

import axios from 'axios'
import { TruckIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { LoadingIndicator, Overview, Subheading } from '@/components/shared'

export const Sold = () => {
	const params = useParams()
	const t = useTranslations('SoldPage')

	const [data, setData] = useState([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const getSold = async () => {
			const response = await axios.get(`/api/${params.storeId}/sold`)
			const data = response.data.data

			setData(data)
			setLoading(false)
		}

		getSold()

		const interval = setInterval(() => {
			getSold()
		}, 5000)

		return () => clearInterval(interval)
	}, [params.storeId])

	if (loading) {
		return <LoadingIndicator />
	}

	return (
		<div className='mt-4 w-full rounded-lg p-4'>
			<Subheading icon={TruckIcon} title={t('title')} description={t('description')} />

			<div className='mt-8'>
				<Overview data={data} />
			</div>
		</div>
	)
}
