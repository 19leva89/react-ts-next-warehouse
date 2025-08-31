'use client'

import { useEffect, useState } from 'react'

import { SaleModal } from '@/components/shared/modals/sale-modal'
import { UserModal } from '@/components/shared/modals/user-modal'
import { ImageModal } from '@/components/shared/modals/image-modal'
import { StoreModal } from '@/components/shared/modals/store-modal'
import { ProductModal } from '@/components/shared/modals/product-modal'
import { StoreListModal } from '@/components/shared/modals/store-list-modal'
import { AddMerchantModal } from '@/components/shared/modals/add-merchant-modal'
import { MerchantListModal } from '@/components/shared/modals/merchant-list-modal'

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

			<StoreListModal />

			<ImageModal />

			<UserModal />

			<StoreModal />

			<ProductModal />

			<SaleModal />
		</>
	)
}
