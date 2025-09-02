'use client'

import { useEffect } from 'react'
import { Merchant } from '@prisma/client'

import { useMerchantList } from '@/hooks/use-merchant-list-modal'

export const SetMerchant = ({ merchants }: { merchants: Merchant[] }) => {
	const merchantStore = useMerchantList()

	useEffect(() => {
		merchantStore.setMerchantList(merchants)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
