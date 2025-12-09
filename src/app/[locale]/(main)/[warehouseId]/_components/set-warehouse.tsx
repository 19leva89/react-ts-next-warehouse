'use client'

import { useEffect } from 'react'

import { Warehouse } from '@/generated/prisma/client'
import { useWarehouseList } from '@/hooks/use-warehouse-list-modal'

export const SetWarehouse = ({ warehouses }: { warehouses: Warehouse[] }) => {
	const warehouseList = useWarehouseList()

	useEffect(() => {
		warehouseList.setWarehouseList(warehouses)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
