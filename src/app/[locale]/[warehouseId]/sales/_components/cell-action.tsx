'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui'
import { SalesColumn } from './columns'
import { useRouter } from '@/i18n/navigation'
import { useSaleModal } from '@/hooks/use-sale-modal'
import { AlertModal } from '@/components/shared/modals'

interface Props {
	data: SalesColumn
}

export const CellAction = ({ data }: Props) => {
	const router = useRouter()
	const params = useParams()
	const t = useTranslations('Sales')
	const saleModalWarehouse = useSaleModal()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)

			await axios.delete(`/api/${params.warehouseId}/sales/${data.id}`, {
				data: {
					productId: data.product.id,
					quantity: parseInt(data.quantity),
				},
			})

			toast.success(t('deleteSaleSuccess'))
			router.refresh()
		} catch {
			toast.error(t('deleteSaleFailed'))
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

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='size-8 p-0'>
						<span className='sr-only'>Open menu</span>

						<MoreHorizontalIcon className='size-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>{t('action')}</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => {
							saleModalWarehouse.setIsEditing(true)
							saleModalWarehouse.setSaleData({
								id: data.id,
								merchantId: data.merchant.id,
								productId: data.product.id,
								saleDate: data.saleDate,
								quantity: data.quantity,
							})
							saleModalWarehouse.onOpen()
						}}
					>
						<EditIcon className='mr-2 size-4' /> {t('actionUpdate')}
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setOpen(true)}>
						<TrashIcon className='mr-2 size-4' /> {t('actionDelete')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
