'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui'
import { useRouter } from '@/i18n/navigation'
import { AlertModal } from '@/components/shared/modals'
import { useCustomerList } from '@/hooks/use-customer-list-modal'

interface Props {
	customerId: string
}

export const DeleteCustomerButton = ({ customerId }: Props) => {
	const router = useRouter()
	const params = useParams()
	const t = useTranslations('Customer')
	const customerListWarehouse = useCustomerList()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.warehouseId}/customers/${customerId}`)

			const customerList = customerListWarehouse.customerList ?? []
			const newCustomerList = customerList.filter((customer) => customer.id !== customerId)

			customerListWarehouse.setCustomerList(newCustomerList)

			toast.success(t('deleteCustomerSuccess'))
			router.refresh()
		} catch {
			toast.error(t('deleteCustomerError'))
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
