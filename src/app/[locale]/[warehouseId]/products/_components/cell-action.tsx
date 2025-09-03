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
import { ProductColumn } from './columns'
import { useRouter } from '@/i18n/navigation'
import { AlertModal } from '@/components/shared/modals'
import { useProductModal } from '@/hooks/use-product-modal'

interface Props {
	data: ProductColumn
}

export const CellAction = ({ data }: Props) => {
	const router = useRouter()
	const params = useParams()
	const t = useTranslations('Products')
	const productModal = useProductModal()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.warehouseId}/products/${data.id}`)
			toast.success(t('deleteProductSuccess'))
			router.refresh()
		} catch {
			toast.error(t('deleteProductError'))
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
							productModal.setIsEditing(true)
							productModal.setProductData({
								...data,
								id: data.id,
								imageUrl: data.image,
								imageId: data.imageId,
							})
							productModal.onOpen()
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
