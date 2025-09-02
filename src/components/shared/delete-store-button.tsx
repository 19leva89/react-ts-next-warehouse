'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { useRouter } from '@/i18n/navigation'
import { AlertModal } from '@/components/shared/modals'
import { useStoreList } from '@/hooks/use-store-list-modal'

interface Props {
	storeId: string
}

export const DeleteStoreButton = ({ storeId }: Props) => {
	const router = useRouter()
	const t = useTranslations('Store')
	const storeListStore = useStoreList()

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/stores/${storeId}`)

			const storeList = storeListStore.storeList ?? []
			const newStoreList = storeList.filter((store) => store.id !== storeId)

			storeListStore.setStoreList(newStoreList)

			toast.success(t('deleteStoreSuccess'))

			router.push('/')
		} catch {
			toast.error(t('deleteStoreError'))
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
