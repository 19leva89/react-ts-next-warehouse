import { create } from 'zustand'

import { Warehouse } from '@/generated/prisma/client'

interface UseWarehouseListWarehouse {
	isOpen: boolean
	isEditing: boolean
	warehouseList?: Warehouse[]
	onOpen: () => void
	onClose: () => void
	setIsEditing: (isEditing: boolean) => void
	setWarehouseList: (warehouseList: Warehouse[]) => void
}

export const useWarehouseList = create<UseWarehouseListWarehouse>((set) => ({
	isOpen: false,
	isEditing: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setIsEditing: (isEditing) => set({ isEditing }),
	setWarehouseList: (warehouseList) => set({ warehouseList }),
}))
