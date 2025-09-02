'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

const LogoutPage = () => {
	const router = useRouter()
	const t = useTranslations('Logout')

	useEffect(() => {
		const getLogout = async () => {
			try {
				const response = await axios.post('/api/auth/logout', {
					key: 'static_key',
				})

				if (response.status === 200) {
					router.push('/auth/login')
				}
			} catch (error) {
				console.log(error)

				toast.error(t('logoutFailed'))
			}
		}

		getLogout()
	}, [t, router])

	return null
}

export default LogoutPage
