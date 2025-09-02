'use client'

import { useTranslations } from 'next-intl'
import { LayoutDashboardIcon } from 'lucide-react'

import { Sold } from './_components/sold'
import { Rank } from './_components/rank'
import { Stock } from './_components/stock'
import { Heading } from '@/components/shared'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

const DashboardPage = () => {
	const t = useTranslations('Dashboard')

	return (
		<div className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<div className='flex-1 space-y-4'>
				<Heading icon={LayoutDashboardIcon} title={t('title')} description={t('description')} />

				<Separator />

				<div className='flex w-full items-center justify-center'>
					<Tabs defaultValue='stock' className='flex w-full flex-col items-center'>
						<div className='w-full rounded-lg bg-slate-300 p-2'>
							<TabsList className='flex w-full gap-4 bg-slate-300'>
								<TabsTrigger value='stock'>
									<p className='text-lg font-semibold'>{t('productStock')}</p>
								</TabsTrigger>

								<TabsTrigger value='sold'>
									<p className='text-lg font-semibold'>{t('soldStock')}</p>
								</TabsTrigger>

								<TabsTrigger value='rank'>
									<p className='text-lg font-semibold'>{t('productRanking')}</p>
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value='stock' className='w-full'>
							<Stock />
						</TabsContent>

						<TabsContent value='sold' className='w-full'>
							<Sold />
						</TabsContent>

						<TabsContent value='rank' className='w-full'>
							<Rank />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}

export default DashboardPage
