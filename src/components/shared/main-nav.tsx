'use client'

import { HTMLAttributes } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

import { cn } from '@/lib'
import { Link, usePathname } from '@/i18n/navigation'

export const MainNav = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
	const params = useParams()
	const pathname = usePathname()
	const t = useTranslations('Navigation')

	const routes = [
		{
			href: `/${params.warehouseId}`,
			label: t('dashboard'),
			active: pathname === `/${params.warehouseId}`,
		},
		{
			href: `/${params.warehouseId}/products`,
			label: t('products'),
			active: pathname === `/${params.warehouseId}/products`,
		},
		{
			href: `/${params.warehouseId}/sales`,
			label: t('sales'),
			active: pathname === `/${params.warehouseId}/sales`,
		},
	]

	return (
		<nav className={cn('flex items-center gap-4 lg:gap-6', className)} {...props}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
						route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	)
}
