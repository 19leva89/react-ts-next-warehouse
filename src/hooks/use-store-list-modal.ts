import { Store } from '@prisma/client'
import { create } from 'zustand'

interface useStoreListStore {
	isOpen: boolean
	isEditing: boolean
	storeList?: Store[]
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setStoreList: (storeList: Store[]) => void
}

export const useStoreList = create<useStoreListStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setStoreList: (storeList) => set({ storeList }),
}))
