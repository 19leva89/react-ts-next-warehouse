import { User } from '@prisma/client'
import { create } from 'zustand'

interface useUserModalStore {
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

export const useUserModal = create<useUserModalStore>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setUserData: (userData) => set({ userData }),
	setUserSetter: (userSetter) => set({ userSetter }),
}))
