import { create } from 'zustand'

interface useCustomerListWarehouse {
	isOpen: boolean
	isEditing: boolean
	customerList?: {
		id: string
		name: string
	}[]
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setCustomerList: (
		customerList: {
			id: string
			name: string
		}[],
	) => void
}

export const useCustomerList = create<useCustomerListWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setCustomerList: (customerList) => set({ customerList }),
}))
