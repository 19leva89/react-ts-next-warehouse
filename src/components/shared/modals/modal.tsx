'use client'

import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui'

interface Props {
	title: string
	description: string
	isOpen: boolean
	onClose: () => void
	children?: ReactNode
}

export const Modal = ({ title, description, isOpen, onClose, children }: Props) => {
	const onChange = (open: boolean) => {
		if (!open) {
			onClose()
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>

					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div>{children}</div>
			</DialogContent>
		</Dialog>
	)
}
