'use client'

import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui'

interface Props {
	name: string
}

export const DropdownContent = ({ name }: Props) => {
	const params = useParams()
	const router = useRouter()
	const currentLocale = useLocale()
	const t = useTranslations('ManageUser')

	return (
		<DropdownMenuContent align='end'>
			<DropdownMenuLabel>{name}</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${currentLocale}/${params.storeId}/profile`)
				}}
			>
				{t('profileButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${currentLocale}/${params.storeId}/manage-user`)
				}}
			>
				{t('manageUserButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${currentLocale}/auth/logout`)
				}}
			>
				{t('logoutButton')}
			</DropdownMenuItem>
		</DropdownMenuContent>
	)
}
