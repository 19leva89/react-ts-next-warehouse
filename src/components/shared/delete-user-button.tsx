'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'
import { AlertModal } from '@/components/shared/modals'

interface Props {
	userId: string
	setUsers: any
}

export const DeleteUserButton = ({ userId, setUsers }: Props) => {
	const t = useTranslations('ManageUser')

	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const onConfirmDelete = async () => {
		try {
			setLoading(true)
			const response = await axios.delete(`/api/auth/users/${userId}`)

			toast.success(t('deleteUserSuccess'))
			setUsers(response.data?.users)
		} catch {
			toast.error(t('deleteUserError'))
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
				<Trash2Icon className='size-6' />
			</Button>
		</>
	)
}
