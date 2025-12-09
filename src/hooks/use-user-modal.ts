import { create } from 'zustand'

import { User } from '@/generated/prisma/client'

export interface UseUserModalWarehouse {
	isOpen: boolean
	isEditing: boolean
	userData?: User
	userSetter?: (user: User[]) => void
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setUserData: (userData: User) => void
	setUserSetter: (userSetter: (user: User[]) => void) => void
}

export const useUserModal = create<UseUserModalWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setUserData: (userData) => set({ userData }),
	setUserSetter: (userSetter) => set({ userSetter }),
}))
