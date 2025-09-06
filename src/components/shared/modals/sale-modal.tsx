'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProductData } from '@/lib/types'
import { useRouter } from '@/i18n/navigation'
import { Button, Form } from '@/components/ui'
import { useProduct } from '@/hooks/use-product'
import { Modal } from '@/components/shared/modals'
import { useSaleModal } from '@/hooks/use-sale-modal'
import { useCustomerList } from '@/hooks/use-customer-list-modal'
import { FormCalendar, FormCombobox, FormInput } from '@/components/shared/form'

const formSchema = z.object({
	id: z.string().min(1),
	customerId: z.string().min(1),
	productId: z.string().min(1),
	saleDate: z.date({
		message: 'Date is required',
	}),
	quantity: z.string().min(1),
})

export const SaleModal = () => {
	const params = useParams()
	const router = useRouter()
	const saleModalWarehouse = useSaleModal()
	const productListWarehouse = useProduct()
	const customerListWarehouse = useCustomerList()

	const t = useTranslations('Sales')
	const tProducts = useTranslations('Products')

	const [loading, setLoading] = useState<boolean>(true)
	const [products, setProducts] = useState<ProductData[]>([])

	useEffect(() => {
		async function getProducts() {
			try {
				const response = await axios.get(`/api/${params.warehouseId}/products`)
				const products = response.data.products as ProductData[]

				setProducts(products)
			} catch (error) {
				console.log(error)
				toast.error(tProducts('loadProductFailed'))
			} finally {
				setLoading(false)
			}
		}

		if (productListWarehouse.productUpdated) {
			productListWarehouse.setProductUpdated(false)
		}
		getProducts()
	}, [params.warehouseId, productListWarehouse, tProducts])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: saleModalWarehouse.isEditing
			? saleModalWarehouse.saleData
			: {
					customerId: '',
					productId: '',
					saleDate: new Date(),
					quantity: '',
				},
	})

	useEffect(() => {
		if (saleModalWarehouse.isEditing) {
			form.setValue('customerId', saleModalWarehouse.saleData?.customerId ?? '')
			form.setValue('productId', saleModalWarehouse.saleData?.productId ?? '')
			form.setValue('quantity', saleModalWarehouse.saleData?.quantity ?? '')
			form.setValue('saleDate', saleModalWarehouse.saleData?.saleDate ?? new Date())
		}
	}, [saleModalWarehouse.isEditing, saleModalWarehouse.saleData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)
			const sale = {
				customerId: values.customerId,
				productId: values.productId,
				saleDate: values.saleDate,
				quantity: parseInt(values.quantity),
			}

			if (saleModalWarehouse.isEditing) {
				await axios.put(`/api/${params.warehouseId}/sales/${saleModalWarehouse.saleData?.id}`, {
					...sale,
					previousQuantity: saleModalWarehouse.saleData?.quantity
						? parseInt(saleModalWarehouse.saleData.quantity)
						: 0,
				})
				toast.success(t('updateSaleSuccess'))
				saleModalWarehouse.setIsEditing(false)
			} else {
				await axios.post(`/api/${params.warehouseId}/sales`, {
					...sale,
					type: 'single',
				})
				toast.success(t('addSaleSuccess'))
			}

			form.reset()
			router.refresh()
			saleModalWarehouse.setSaleUpdated(true)
			saleModalWarehouse.onClose()
		} catch (error) {
			console.log(error)
			toast.error(t('saleError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={saleModalWarehouse.isEditing ? t('updateSaleTitle') : t('addSaleTitle')}
			description={saleModalWarehouse.isEditing ? t('updateSaleDescription') : t('addSaleDescription')}
			isOpen={saleModalWarehouse.isOpen}
			onClose={() => {
				if (saleModalWarehouse.isEditing) {
					saleModalWarehouse.setIsEditing(false)
				}
				form.reset()
				saleModalWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<Form {...form}>
							<form className='space-y-4'>
								<FormCombobox
									name='customerId'
									label={t('customer')}
									placeholder={t('customerPlaceholder')}
									noResultsText={t('noResults')}
									selectPlaceholder={t('customerPlaceholder')}
									valueKey='id'
									labelKey='name'
									mapTable={customerListWarehouse.customerList}
									required
								/>

								<Button
									type='button'
									variant='secondary'
									onClick={() => {
										customerListWarehouse.onOpen()
									}}
									className='mt-2 w-full'
								>
									{t('manageCustomerButton')}
								</Button>

								<FormCombobox
									name='productId'
									label={t('product')}
									placeholder={t('productPlaceholder')}
									noResultsText={t('noResults')}
									selectPlaceholder={t('productPlaceholder')}
									valueKey='id'
									labelKey='name'
									mapTable={products}
									required
								/>

								<FormCalendar
									name='saleDate'
									label={t('deliveryDate')}
									placeholder={t('deliveryDatePlaceholder')}
									required
								/>

								<FormInput
									name='quantity'
									type='number'
									label={t('quantity')}
									placeholder={t('quantityPlaceholder')}
									required
								/>

								<div className='flex w-full items-center justify-end gap-2 pt-6'>
									<Button
										variant='outline'
										disabled={loading}
										onClick={() => {
											if (saleModalWarehouse.isEditing) {
												saleModalWarehouse.setIsEditing(false)
											}
											form.reset()
											saleModalWarehouse.onClose()
										}}
									>
										{t('cancelButton')}
									</Button>

									<Button
										type='button'
										disabled={loading}
										onClick={() => {
											onSubmit(form.getValues())
										}}
									>
										{saleModalWarehouse.isEditing ? t('updateSaleButton') : t('addSaleButton')}
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</Modal>
	)
}
