import { create } from 'zustand'

interface useImageStore {
	isOpen: boolean
	isLoading: boolean
	productName: string
	imageUrl?: string
	onOpen: () => void
	onClose: () => void
	setIsLoading: (isEditing: boolean) => void
	setProductName: (productName: string) => void
	setImageUrl: (imageUrl: string) => void
}

export const useImageModal = create<useImageStore>((set) => ({
	isOpen: false,
	isLoading: false,
	productName: '',
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsLoading: (isEditing) => set({ isLoading: isEditing }),
	setProductName: (productName) => set({ productName }),
	setImageUrl: (imageUrl) => set({ imageUrl }),
}))
