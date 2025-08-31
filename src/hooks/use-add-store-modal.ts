import { Store } from '@prisma/client'
import { create } from 'zustand'

interface useAddStoreModalStore {
	isOpen: boolean
	isEditing: boolean
	storeData?: Store
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setStoreData: (storeData: Store) => void
}

export const useAddStoreModal = create<useAddStoreModalStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setStoreData: (storeData) => set({ storeData }),
}))
