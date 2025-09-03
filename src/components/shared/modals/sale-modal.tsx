'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Button,
	Calendar,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { cn } from '@/lib'
import { ProductData } from '@/lib/types'
import { useRouter } from '@/i18n/navigation'
import { useProduct } from '@/hooks/use-product'
import { Modal } from '@/components/shared/modals'
import { useSaleModal } from '@/hooks/use-sale-modal'
import { useMerchantList } from '@/hooks/use-merchant-list-modal'

const formSchema = z.object({
	id: z.string().min(1),
	merchantId: z.string().min(1),
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
	const merchantListWarehouse = useMerchantList()

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
					merchantId: '',
					productId: '',
					saleDate: new Date(),
					quantity: '',
				},
	})

	useEffect(() => {
		if (saleModalWarehouse.isEditing) {
			form.setValue('merchantId', saleModalWarehouse.saleData?.merchantId ?? '')
			form.setValue('productId', saleModalWarehouse.saleData?.productId ?? '')
			form.setValue('quantity', saleModalWarehouse.saleData?.quantity ?? '')
			form.setValue('saleDate', saleModalWarehouse.saleData?.saleDate ?? new Date())
		}
	}, [saleModalWarehouse.isEditing, saleModalWarehouse.saleData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)
			const sale = {
				merchantId: values.merchantId,
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
								<FormField
									name='merchantId'
									control={form.control}
									defaultValue={saleModalWarehouse.saleData?.merchantId}
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>{t('merchant')}</FormLabel>

											<Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={t('merchantPlaceholder')} />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{merchantListWarehouse.merchantList!.map((merchant) => (
														<SelectItem value={merchant.id} key={merchant.id}>
															{merchant.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />

											<Button
												type='button'
												variant='secondary'
												onClick={() => {
													merchantListWarehouse.onOpen()
												}}
												className='mt-2'
											>
												{t('manageMerchantButton')}
											</Button>
										</FormItem>
									)}
								/>

								<FormField
									name='productId'
									control={form.control}
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>{t('product')}</FormLabel>

											<Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={t('productPlaceholder')} />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													<ScrollArea className='min-h-[50px]'>
														{products.length === 0 ? (
															<p>{t('noProduct')}</p>
														) : (
															products.map((product) => (
																<SelectItem value={product.id} key={product.id}>
																	{product.name}
																</SelectItem>
															))
														)}
													</ScrollArea>
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='saleDate'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('saleDate')}</FormLabel>

											<FormControl>
												<div className='block'>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant='outline'
																disabled={loading}
																className={cn(
																	'w-full justify-start text-left font-normal',
																	!field.value && 'text-muted-foreground',
																)}
															>
																<CalendarIcon className='mr-2 size-4' />
																{field.value ? (
																	format(new Date(field.value), 'PPP')
																) : (
																	<span>{t('saleDatePlaceholder')}</span>
																)}
															</Button>
														</PopoverTrigger>

														<PopoverContent className='w-auto p-0'>
															<Calendar
																mode='single'
																autoFocus
																selected={field.value ? new Date(field.value) : new Date()}
																onSelect={(date) => {
																	if (date) field.onChange(date)
																}}
															/>
														</PopoverContent>
													</Popover>
												</div>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									name='quantity'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('quantity')}</FormLabel>

											<FormControl>
												<Input
													type='number'
													disabled={loading}
													placeholder={t('quantityPlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='flex w-full items-center justify-end space-x-2 pt-6'>
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
