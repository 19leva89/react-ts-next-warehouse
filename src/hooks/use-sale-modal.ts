import { create } from 'zustand'

interface useSaleModalStore {
	isOpen: boolean
	isEditing: boolean
	saleUpdated: boolean
	saleData?: {
		id: string
		merchantId: string
		productId: string
		saleDate: Date
		quantity: string
	}
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setSaleData: (saleData: {
		id: string
		merchantId: string
		productId: string
		saleDate: Date
		quantity: string
	}) => void
	setSaleUpdated: (saleUpdated: boolean) => void
}

export const useSaleModal = create<useSaleModalStore>((set) => ({
	isOpen: false,
	isEditing: false,
	saleUpdated: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setSaleData: (saleData) => set({ saleData }),
	setSaleUpdated: (saleUpdated) => set({ saleUpdated }),
}))
