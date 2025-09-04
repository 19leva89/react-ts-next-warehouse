'use client'

import { useEffect, useState } from 'react'

import { SaleModal } from '@/components/shared/modals/sale-modal'
import { UserModal } from '@/components/shared/modals/user-modal'
import { ImageModal } from '@/components/shared/modals/image-modal'
import { ProductModal } from '@/components/shared/modals/product-modal'
import { WarehouseModal } from '@/components/shared/modals/warehouse-modal'
import { AddCustomerModal } from '@/components/shared/modals/add-customer-modal'
import { CustomerListModal } from '@/components/shared/modals/customer-list-modal'
import { WarehouseListModal } from '@/components/shared/modals/warehouse-list-modal'

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<>
			<AddCustomerModal />

			<CustomerListModal />

			<WarehouseListModal />

			<ImageModal />

			<UserModal />

			<WarehouseModal />

			<ProductModal />

			<SaleModal />
		</>
	)
}
