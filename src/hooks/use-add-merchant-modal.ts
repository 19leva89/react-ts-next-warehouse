import { create } from 'zustand'

interface useAddMerchantModalStore {
	isOpen: boolean
	isEditing: boolean
	merchantData?: {
		id: string
		name: string
	}
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setMerchantData: (merchantData: { id: string; name: string }) => void
}

export const useAddMerchantModal = create<useAddMerchantModalStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setMerchantData: (merchantData) => set({ merchantData }),
}))
