'use client'

import { useEffect, useState } from 'react'

import { SaleModal } from '@/components/shared/modals/sale-modal'
import { UserModal } from '@/components/shared/modals/user-modal'
import { ImageModal } from '@/components/shared/modals/image-modal'
import { ProductModal } from '@/components/shared/modals/product-modal'
import { WarehouseModal } from '@/components/shared/modals/warehouse-modal'
import { AddMerchantModal } from '@/components/shared/modals/add-merchant-modal'
import { MerchantListModal } from '@/components/shared/modals/merchant-list-modal'
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
			<AddMerchantModal />

			<MerchantListModal />

			<WarehouseListModal />

			<ImageModal />

			<UserModal />

			<WarehouseModal />

			<ProductModal />

			<SaleModal />
		</>
	)
}
