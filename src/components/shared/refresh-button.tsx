import { ComponentProps } from 'react'
import { useTranslations } from 'next-intl'
import { RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui'

interface Props extends Omit<ComponentProps<typeof Button>, 'onClick' | 'children'> {
	isRefreshing: boolean
	onRefresh: () => void | Promise<void>
}

export const RefreshButton = ({
	variant = 'ghost',
	size = 'sm',
	disabled = false,
	isRefreshing,
	onRefresh,
	...buttonProps
}: Props) => {
	const t = useTranslations('Interface')

	return (
		<Button
			variant={variant}
			size={size}
			disabled={disabled || isRefreshing}
			onClick={onRefresh}
			{...buttonProps}
		>
			<RefreshCwIcon className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />

			{isRefreshing ? t('refreshing') : t('refresh')}
		</Button>
	)
}
