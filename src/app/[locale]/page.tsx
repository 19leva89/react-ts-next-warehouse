'use client'

import axios from 'axios'
import { useLocale } from 'use-intl/react'
import { useEffect, useState } from 'react'

import { StoreData } from '@/lib/types'
import { redirect } from '@/i18n/navigation'
import { LoadingIndicator } from '@/components/shared'
import { StoreModal } from '@/components/shared/modals'
import { useAddStoreModal } from '@/hooks/use-add-store-modal'

const MainPage = () => {
	const currentLocale = useLocale()

	const [store, setStore] = useState<StoreData>()
	const [loading, setLoading] = useState<boolean>(true)

	const { isOpen, onOpen } = useAddStoreModal()

	useEffect(() => {
		async function getStore() {
			try {
				const response = await axios.get('/api/stores')

				setStore(response.data.store)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		getStore()
	}, [])

	useEffect(() => {
		if (loading) {
			return
		}
		if (!store) {
			if (!isOpen) {
				onOpen()
			}
		}
	}, [isOpen, onOpen, store, loading])

	if (loading) {
		return <LoadingIndicator />
	}

	if (store) {
		redirect({ href: `/${store.id}`, locale: currentLocale })
	}

	return <StoreModal />
}

export default MainPage
