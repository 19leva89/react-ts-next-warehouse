'use client'

import { useEffect } from 'react'

import { Customer } from '@/generated/prisma/client'
import { useCustomerList } from '@/hooks/use-customer-list-modal'

export const SetCustomer = ({ customers }: { customers: Customer[] }) => {
	const customerWarehouse = useCustomerList()

	useEffect(() => {
		customerWarehouse.setCustomerList(customers)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
