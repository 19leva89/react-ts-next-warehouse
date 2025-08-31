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
	const t = useTranslations('ManageUser')
	const lang = useLocale()
	const params = useParams()
	const router = useRouter()

	return (
		<DropdownMenuContent align='end'>
			<DropdownMenuLabel>{name}</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${lang}/${params.storeId}/profile`)
				}}
			>
				{t('profileButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${lang}/${params.storeId}/manage-user`)
				}}
			>
				{t('manageUserButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push(`/${lang}/logout`)
				}}
			>
				Logout
			</DropdownMenuItem>
		</DropdownMenuContent>
	)
}
