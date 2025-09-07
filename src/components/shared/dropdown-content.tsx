'use client'

import { toast } from 'sonner'
import { signOut, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui'
import { useRouter } from '@/i18n/navigation'
import { handleError } from '@/lib/handle-error'

interface Props {
	name: string
}

export const DropdownContent = ({ name }: Props) => {
	const router = useRouter()
	const locale = useLocale()
	const { data: session } = useSession()

	const tAuth = useTranslations('Auth')
	const tUser = useTranslations('ManageUser')
	const tProducts = useTranslations('Products')

	const handleLogout = async () => {
		try {
			await signOut({ callbackUrl: `/${locale}/auth/login` })
		} catch (error) {
			handleError(error, 'LOGOUT')

			toast.error(tAuth('logoutFailed'))
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
				{tUser('profileButton')}
			</DropdownMenuItem>

			{session?.user?.role === 'ADMIN' && (
				<DropdownMenuItem
					onClick={() => {
						router.push('/manage-user')
					}}
				>
					{tUser('manageUserButton')}
				</DropdownMenuItem>
			)}

			{(session?.user?.role === 'ADMIN' || session?.user?.role === 'PRODUCT_MANAGER') && (
				<DropdownMenuItem
					onClick={() => {
						router.push('/products')
					}}
				>
					{tProducts('productsButton')}
				</DropdownMenuItem>
			)}

			<DropdownMenuItem onClick={handleLogout}>{tUser('logoutButton')}</DropdownMenuItem>
		</DropdownMenuContent>
	)
}
