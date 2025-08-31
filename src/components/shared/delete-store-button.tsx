'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { AlertModal } from '@/components/shared/modals'
import { useStoreList } from '@/hooks/use-store-list-modal'

interface Props {
	key: string
	storeId: string
}

export const DeleteStoreButton = ({ key, storeId }: Props) => {
	const t = useTranslations('Store')
	const router = useRouter()
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
				key={key}
			/>

			<Button
				key={key}
				variant='ghost'
				onClick={() => {
					setOpen(true)
				}}
			>
				<Trash2Icon key={key} className='size-4' />
			</Button>
		</>
	)
}
