'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui'
import { useRouter } from '@/i18n/navigation'

interface Props {
	name: string
}

export const DropdownContent = ({ name }: Props) => {
	const params = useParams()
	const router = useRouter()
	const t = useTranslations('ManageUser')

	return (
		<DropdownMenuContent align='end'>
			<DropdownMenuLabel>{name}</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${params.storeId}/profile`)
				}}
			>
				{t('profileButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${params.storeId}/manage-user`)
				}}
			>
				{t('manageUserButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/auth/logout`)
				}}
			>
				{t('logoutButton')}
			</DropdownMenuItem>
		</DropdownMenuContent>
	)
}
