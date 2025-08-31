'use client'

import { useTranslations } from 'next-intl'
import { ArrowUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui'

interface Props {
	variant: string
	name: string
	onClick?: () => void
}

export const TableHeader = ({ variant, name, onClick }: Props) => {
	const t = useTranslations('TableHeader')

	if (variant === 'normal') return <div className='flex items-center justify-center'>{t(name)}</div>

	if (variant === 'sortable')
		return (
			<div className='flex'>
				<Button variant='ghost' onClick={onClick}>
					{t(name)}
					<ArrowUpDownIcon className='ml-2 size-4' />
				</Button>
			</div>
		)

	if (variant === 'sortable-center')
		return (
			<div className='flex items-center justify-center'>
				<Button variant='ghost' onClick={onClick}>
					{t(name)}
					<ArrowUpDownIcon className='ml-2 size-4' />
				</Button>
			</div>
		)

	return <div>{t(name)}</div>
}
