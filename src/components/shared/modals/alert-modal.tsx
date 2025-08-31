'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui'
import { Modal } from '@/components/shared/modals'

interface Props {
	isOpen: boolean
	loading: boolean
	onClose: () => void
	onConfirm: () => void
}

export const AlertModal = ({ isOpen, loading, onClose, onConfirm }: Props) => {
	const t = useTranslations('DeleteModal')

	const [isMounted, setIsMounted] = useState<boolean>(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<Modal title={t('title')} description={t('description')} isOpen={isOpen} onClose={onClose}>
			<div className='flex w-full items-center justify-end space-x-2 pt-6'>
				<Button variant='outline' onClick={onClose} disabled={loading}>
					{t('cancelButton')}
				</Button>

				<Button variant='destructive' onClick={onConfirm} disabled={loading}>
					{t('confirmButton')}
				</Button>
			</div>
		</Modal>
	)
}
