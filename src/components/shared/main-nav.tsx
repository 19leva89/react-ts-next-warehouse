'use client'

import { HTMLAttributes } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib'
import { Link } from '@/i18n/navigation'

export const MainNav = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
	const params = useParams()
	const pathname = usePathname()
	const t = useTranslations('Navigation')

	const routes = [
		{
			href: `/${params.storeId}`,
			label: t('dashboard'),
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/products`,
			label: t('products'),
			active: pathname === `/${params.storeId}/products`,
		},
		{
			href: `/${params.storeId}/sales`,
			label: t('sales'),
			active: pathname === `/${params.storeId}/sales`,
		},
	]

	return (
		<nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'hover:text-primary text-sm font-medium transition-colors',
						route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	)
}
