import { create } from 'zustand'

interface useAddCustomerModalStore {
	isOpen: boolean
	isEditing: boolean
	customerData?: {
		id: string
		name: string
	}
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setCustomerData: (customerData: { id: string; name: string }) => void
}

export const useAddCustomerModal = create<useAddCustomerModalStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setCustomerData: (customerData) => set({ customerData }),
}))
