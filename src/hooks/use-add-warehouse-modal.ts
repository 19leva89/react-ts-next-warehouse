import { create } from 'zustand'
import { Warehouse } from '@prisma/client'

interface useAddWarehouseModalWarehouse {
	isOpen: boolean
	isEditing: boolean
	warehouseData?: Warehouse
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setWarehouseData: (WarehouseData: Warehouse) => void
}

export const useAddWarehouseModal = create<useAddWarehouseModalWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setWarehouseData: (warehouseData) => set({ warehouseData }),
}))
