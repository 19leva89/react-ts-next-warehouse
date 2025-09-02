'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui'
import { AlertModal } from '@/components/shared/modals'
import { useMerchantList } from '@/hooks/use-merchant-list-modal'

interface Props {
	merchantId: string
}

export const DeleteMerchantButton = ({ merchantId }: Props) => {
	const router = useRouter()
	const params = useParams()
	const t = useTranslations('Merchant')
	const merchantListStore = useMerchantList()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.storeId}/merchants/${merchantId}`)

			const merchantList = merchantListStore.merchantList ?? []
			const newMerchantList = merchantList.filter((merchant) => merchant.id !== merchantId)

			merchantListStore.setMerchantList(newMerchantList)

			toast.success(t('deleteMerchantSuccess'))
			router.refresh()
		} catch {
			toast.error(t('deleteMerchantError'))
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
