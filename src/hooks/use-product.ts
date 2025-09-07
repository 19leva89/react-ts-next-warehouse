import { create } from 'zustand'
import { ProductData } from '@/lib/types'

interface UseProductWarehouse {
	products: ProductData[]
	productUpdated: boolean
	setProducts: (products: ProductData[]) => void
	setProductUpdated: (productUpdated: boolean) => void
}

export const useProduct = create<UseProductWarehouse>((set) => ({
	products: [],
	productUpdated: false,
	setProducts: (products) => set({ products }),
	setProductUpdated: (productUpdated) => set({ productUpdated }),
}))
