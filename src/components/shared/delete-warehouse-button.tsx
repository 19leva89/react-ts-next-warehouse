'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { useRouter } from '@/i18n/navigation'
import { AlertModal } from '@/components/shared/modals'
import { useWarehouseList } from '@/hooks/use-warehouse-list-modal'

interface Props {
	warehouseId: string
}

export const DeleteWarehouseButton = ({ warehouseId }: Props) => {
	const router = useRouter()
	const t = useTranslations('Warehouse')
	const warehouseListWarehouse = useWarehouseList()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/warehouses/${warehouseId}`)

			const warehouseList = warehouseListWarehouse.warehouseList ?? []
			const newWarehouseList = warehouseList.filter((warehouse) => warehouse.id !== warehouseId)

			warehouseListWarehouse.setWarehouseList(newWarehouseList)

			toast.success(t('deleteWarehouseSuccess'))

			router.push('/')
		} catch {
			toast.error(t('deleteWarehouseError'))
		} finally {
			setLoading(false)
			setOpen(false)
		}
	}

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onConfirmDelete}
				loading={loading}
			/>

			<Button
				variant='ghost'
				onClick={() => {
					setOpen(true)
				}}
			>
				<Trash2Icon className='size-4' />
			</Button>
		</>
	)
}
