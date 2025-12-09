'use client'

import { toast } from 'sonner'
import { useTransition } from 'react'
import { GlobeIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { useRouter, usePathname } from '@/i18n/navigation'
import { handleErrorClient } from '@/lib/handle-error-client'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'

export const LocaleSwitcher = () => {
	const router = useRouter()
	const pathname = usePathname()
	const currentLocale = useLocale()

	const t = useTranslations('Interface')

	const [isPending, startTransition] = useTransition()

	const targetLocale = currentLocale === 'en' ? 'uk' : 'en'

	const handleToggleLocale = () => {
		startTransition(() => {
			try {
				router.replace(pathname, { locale: targetLocale })
			} catch (error) {
				handleErrorClient(error, 'CHANGE_LOCALE')

				toast.error('Failed to change language')
			}
		})
	}

	const tooltipText = targetLocale === 'en' ? t('switchToEnglish') : t('switchToUkrainian')

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant='ghost' onClick={handleToggleLocale} disabled={isPending} aria-label={tooltipText}>
						<GlobeIcon className='size-6' />
					</Button>
				</TooltipTrigger>

				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
