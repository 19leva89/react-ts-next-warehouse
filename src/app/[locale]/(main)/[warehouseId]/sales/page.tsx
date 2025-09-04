'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { PackageCheckIcon } from 'lucide-react'
import { use, useEffect, useState } from 'react'

import { SalesData, UserData } from '@/lib/types'
import { useSaleModal } from '@/hooks/use-sale-modal'
import { AddSaleButton } from './_components/add-sale-button'
import { DataTable, Heading, LoadingIndicator } from '@/components/shared'
import { SalesColumn, SalesColumns, SalesColumnsWithoutAction } from './_components/columns'

interface Props {
	params: Promise<{ warehouseId: string }>
}

const SalesPage = ({ params }: Props) => {
	const t = useTranslations('Sales')
	const saleModalWarehouse = useSaleModal()

	const { warehouseId } = use(params)

	const [user, setUser] = useState<UserData>()
	const [loading, setLoading] = useState<boolean[]>([true, true])
	const [formattedSales, setFormattedSales] = useState<SalesColumn[]>([])

	useEffect(() => {
		async function getSalesData() {
			try {
				const response = await axios.get(`/api/${warehouseId}/sales`)
				const sales = response.data.sales as SalesData[]

				const tempSales: SalesColumn[] = sales.map((sales) => ({
					id: sales.id,
					addedBy: sales.addedBy,
					customer: {
						id: sales.customerId,
						name: sales.customerName,
					},
					product: {
						id: sales.productId,
						name: sales.productName,
					},
					saleDate: new Date(sales.saleDate),
					quantity: sales.quantity.toString(),
				}))

				setFormattedSales(tempSales)
			} catch (error) {
				console.log(error)
				toast.error(t('loadSaleFailed'))
			} finally {
				setLoading((prev) => [false, prev[1]])
			}
		}

		async function getUserData() {
			try {
				const response = await axios.get('/api/auth/profile')
				setUser(response.data.user)
			} catch (error) {
				console.log(error)
				toast.error(t('loadUserFailed'))
			} finally {
				setLoading((prev) => [prev[0], false])
			}
		}

		if (saleModalWarehouse.saleUpdated) {
			saleModalWarehouse.setSaleUpdated(false)
		}
		getSalesData()
		getUserData()
	}, [warehouseId, saleModalWarehouse, t])

	if (loading.some((load) => load)) {
		return <LoadingIndicator />
	}

	return (
		<section className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<header className='flex flex-col items-center md:flex-row'>
				<Heading icon={PackageCheckIcon} title={t('title')} description={t('description')} />

				<div className='ml-auto flex gap-4'>
					{(user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER') && <AddSaleButton />}
				</div>
			</header>

			<div className='mt-8'>
				<DataTable
					columns={
						user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER'
							? SalesColumns
							: SalesColumnsWithoutAction
					}
					data={formattedSales}
					searchKey='product'
					placeholder={t('searchPlaceholder')}
				/>
			</div>
		</section>
	)
}

export default SalesPage
