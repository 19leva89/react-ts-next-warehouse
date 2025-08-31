'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { GlobeIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { useRouter, usePathname } from '@/i18n/navigation'

export const LocaleSwitcher = () => {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()

	const [isPending, startTransition] = useTransition()

	const targetLocale = locale === 'en' ? 'ua' : 'en'

	console.log('Current locale:', locale)
	console.log('Target locale:', targetLocale)
	console.log('Current pathname:', pathname)

	const handleToggleLocale = () => {
		startTransition(() => {
			router.replace(pathname, { locale: targetLocale })
		})
	}

	return (
		<Button variant='ghost' onClick={handleToggleLocale}>
			<GlobeIcon className='size-6' />
		</Button>
	)
}
