'use client'

import { useEffect } from 'react'
import { Store } from '@prisma/client'

import { useStoreList } from '@/hooks/use-store-list-modal'

export const SetStore = ({ stores }: { stores: Store[] }) => {
	const storeList = useStoreList()

	useEffect(() => {
		storeList.setStoreList(stores)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}


