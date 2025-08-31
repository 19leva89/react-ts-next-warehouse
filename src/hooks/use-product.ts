import { ProductData } from '@/lib/types'
import { create } from 'zustand'

interface useProductStore {
	products: ProductData[]
	productUpdated: boolean
	setProducts: (products: ProductData[]) => void
	setProductUpdated: (productUpdated: boolean) => void
}

export const useProduct = create<useProductStore>((set) => ({
	products: [],
	productUpdated: false,
	setProducts: (products) => set({ products }),
	setProductUpdated: (productUpdated) => set({ productUpdated }),
}))
