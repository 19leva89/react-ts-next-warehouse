'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { PackageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { use, useEffect, useState } from 'react'

import { useProduct } from '@/hooks/use-product'
import { ProductData, UserData } from '@/lib/types'
import { AddProductButton } from './_components/add-product-button'
import { DataTable, Heading, LoadingIndicator } from '@/components/shared'
import { ProductColumn, ProductColumns, ProductColumnsWithoutAction } from './_components/columns'

interface Props {
	params: Promise<{ storeId: string }>
}

const ProductPage = ({ params }: Props) => {
	const productStore = useProduct()
	const t = useTranslations('Products')

	const { storeId } = use(params)

	const [user, setUser] = useState<UserData>()
	const [loading, setLoading] = useState<boolean[]>([true, true])
	const [formattedProduct, setFormattedProduct] = useState<ProductColumn[]>([])

	useEffect(() => {
		async function getProducts() {
			try {
				const response = await axios.get(`/api/${storeId}/products`)
				const products = response.data.products as ProductData[]

				const tempProducts: ProductColumn[] = products.map((product) => ({
					id: product.id,
					imageId: product.imageId ?? '',
					image: product.imageUrl ?? '',
					name: product.name,
					description: product.description ?? '-',
					stockThreshold: product.stockThreshold.toString(),
					stock: product.stock.toString(),
				}))

				setFormattedProduct(tempProducts)
			} catch (error) {
				console.log(error)
				toast.error(t('loadProductFailed'))
			} finally {
				setLoading((prev: any) => [false, prev[1]])
			}
		}

		async function getUserData() {
			try {
				const response = await axios.get('/api/auth/profile')
				const user = response.data.user as UserData

				setUser(user)
			} catch (error) {
				console.log(error)
				toast.error(t('loadUserFailed'))
			} finally {
				setLoading((prev) => [prev[0], false])
			}
		}

		if (productStore.productUpdated) {
			productStore.setProductUpdated(false)
		}
		getProducts()
		getUserData()
	}, [storeId, productStore, t])

	if (loading.some((load) => load)) {
		return <LoadingIndicator />
	}

	return (
		<section className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<header className='flex flex-col items-center md:flex-row'>
				<Heading icon={PackageIcon} title={t('title')} description={t('description')} />

				<div className='ml-auto flex'>
					{(user?.role === 'ADMIN' || user?.role === 'PRODUCT_MANAGER') && <AddProductButton />}
				</div>
			</header>

			<div className='mt-8'>
				<DataTable
					columns={
						user?.role === 'ADMIN' || user?.role === 'PRODUCT_MANAGER'
							? ProductColumns
							: ProductColumnsWithoutAction
					}
					data={formattedProduct}
					searchKey='name'
					placeholder={t('searchPlaceholder')}
				/>
			</div>
		</section>
	)
}

export default ProductPage
