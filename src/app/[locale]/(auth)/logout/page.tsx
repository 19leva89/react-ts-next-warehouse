'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

const LogoutPage = () => {
	const t = useTranslations('Logout')

	useEffect(() => {
		const getLogout = async () => {
			try {
				const response = await axios.post('/api/auth/logout', {
					key: 'static_key',
				})

				if (response.status === 200) {
					window.location.assign('/en/login')
				}
			} catch (error) {
				console.log(error)
				toast.error(t('logoutFailed'))
			}
		}

		getLogout()
	}, [t])

	return null
}

export default LogoutPage
