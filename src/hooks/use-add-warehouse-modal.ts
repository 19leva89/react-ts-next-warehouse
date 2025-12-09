import { create } from 'zustand'

import { Warehouse } from '@/generated/prisma/client'

interface UseAddWarehouseModalWarehouse {
	isOpen: boolean
	isEditing: boolean
	warehouseData?: Warehouse
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setWarehouseData: (WarehouseData: Warehouse) => void
}

export const useAddWarehouseModal = create<UseAddWarehouseModalWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setWarehouseData: (warehouseData) => set({ warehouseData }),
}))
