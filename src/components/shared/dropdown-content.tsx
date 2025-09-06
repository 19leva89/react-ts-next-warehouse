'use client'

import { toast } from 'sonner'
import { signOut } from 'next-auth/react'
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
	const router = useRouter()
	const t = useTranslations('ManageUser')
	const tProducts = useTranslations('Products')

	const handleLogout = async () => {
		try {
			await signOut({ callbackUrl: '/auth/login' })
		} catch (error) {
			console.log(error)

			toast.error(t('logoutFailed'))
		}
	}

	return (
		<DropdownMenuContent align='end'>
			<DropdownMenuLabel>{name}</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				onClick={() => {
					router.push('/profile')
				}}
			>
				{t('profileButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push('/manage-user')
				}}
			>
				{t('manageUserButton')}
			</DropdownMenuItem>

			<DropdownMenuItem
				onClick={() => {
					router.push('/products')
				}}
			>
				{tProducts('productsButton')}
			</DropdownMenuItem>

			<DropdownMenuItem onClick={handleLogout}>{t('logoutButton')}</DropdownMenuItem>
		</DropdownMenuContent>
	)
}
