'use client'

import { useEffect } from 'react'

import { ProductData } from '@/lib/types'
import { useProduct } from '@/hooks/use-product'

export const SetProduct = ({ products }: { products: ProductData[] }) => {
	const productStore = useProduct()

	useEffect(() => {
		productStore.setProducts(products)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
