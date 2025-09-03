import { create } from 'zustand'
import { User } from '@prisma/client'

interface useUserModalWarehouse {
	isOpen: boolean
	isEditing: boolean
	userData?: User
	userSetter?: any
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setUserData: (userData: User) => void
	setUserSetter: (userSetter: any) => void
}

export const useUserModal = create<useUserModalWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setUserData: (userData) => set({ userData }),
	setUserSetter: (userSetter) => set({ userSetter }),
}))
