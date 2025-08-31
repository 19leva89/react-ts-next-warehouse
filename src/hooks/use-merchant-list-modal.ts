import { create } from 'zustand'

interface useMerchantListStore {
	isOpen: boolean
	isEditing: boolean
	merchantList?: {
		id: string
		name: string
	}[]
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setMerchantList: (
		merchantList: {
			id: string
			name: string
		}[],
	) => void
}

export const useMerchantList = create<useMerchantListStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setMerchantList: (merchantList) => set({ merchantList }),
}))
