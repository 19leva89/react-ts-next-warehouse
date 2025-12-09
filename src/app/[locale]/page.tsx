'use client'

import axios from 'axios'
import { useLocale } from 'use-intl/react'
import { useEffect, useState } from 'react'

import { WarehouseData } from '@/lib/types'
import { redirect } from '@/i18n/navigation'
import { LoadingIndicator } from '@/components/shared'
import { WarehouseModal } from '@/components/shared/modals'
import { handleErrorClient } from '@/lib/handle-error-client'
import { useAddWarehouseModal } from '@/hooks/use-add-warehouse-modal'

const MainPage = () => {
	const currentLocale = useLocale()

	const [loading, setLoading] = useState<boolean>(true)
	const [warehouse, setWarehouse] = useState<WarehouseData>()

	const { isOpen, onOpen } = useAddWarehouseModal()

	useEffect(() => {
		async function getWarehouse() {
			try {
				const response = await axios.get('/api/warehouses')

				setWarehouse(response.data.warehouse)
			} catch (error) {
				handleErrorClient(error, 'GET_WAREHOUSE')
			} finally {
				setLoading(false)
			}
		}

		getWarehouse()
	}, [])

	useEffect(() => {
		if (loading) {
			return
		}

		if (!warehouse) {
			if (!isOpen) {
				onOpen()
			}
		}
	}, [isOpen, onOpen, warehouse, loading])

	if (loading) {
		return <LoadingIndicator />
	}

	if (warehouse) {
		redirect({ href: `/${warehouse.id}`, locale: currentLocale })
	}

	return <WarehouseModal />
}

export default MainPage
