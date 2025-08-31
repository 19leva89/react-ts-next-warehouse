'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'

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
	const tProducts = useTranslations('Products')
	const t = useTranslations('Sales')

	const params = useParams()
	const router = useRouter()
	const saleModalStore = useSaleModal()
	const productListStore = useProduct()
	const merchantListStore = useMerchantList()

	const [loading, setLoading] = useState<boolean>(true)
	const [products, setProducts] = useState<ProductData[]>([])

	useEffect(() => {
		async function getProducts() {
			try {
				const response = await axios.get(`/api/${params.storeId}/products`)
				const products = response.data.products as ProductData[]

				setProducts(products)
			} catch (error) {
				console.log(error)
				toast.error(tProducts('loadProductFailed'))
			} finally {
				setLoading(false)
			}
		}

		if (productListStore.productUpdated) {
			productListStore.setProductUpdated(false)
		}
		getProducts()
	}, [params.storeId, productListStore, tProducts])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: saleModalStore.isEditing
			? saleModalStore.saleData
			: {
					merchantId: '',
					productId: '',
					saleDate: new Date(),
					quantity: '',
				},
	})

	useEffect(() => {
		if (saleModalStore.isEditing) {
			form.setValue('merchantId', saleModalStore.saleData?.merchantId ?? '')
			form.setValue('productId', saleModalStore.saleData?.productId ?? '')
			form.setValue('quantity', saleModalStore.saleData?.quantity ?? '')
			form.setValue('saleDate', saleModalStore.saleData?.saleDate ?? new Date())
		}
	}, [saleModalStore.isEditing, saleModalStore.saleData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)
			const sale = {
				merchantId: values.merchantId,
				productId: values.productId,
				saleDate: values.saleDate,
				quantity: parseInt(values.quantity),
			}

			if (saleModalStore.isEditing) {
				await axios.put(`/api/${params.storeId}/sales/${saleModalStore.saleData?.id}`, {
					...sale,
					previousQuantity: saleModalStore.saleData?.quantity
						? parseInt(saleModalStore.saleData.quantity)
						: 0,
				})
				toast.success(t('updateSaleSuccess'))
				saleModalStore.setIsEditing(false)
			} else {
				await axios.post(`/api/${params.storeId}/sales`, {
					...sale,
					type: 'single',
				})
				toast.success(t('addSaleSuccess'))
			}

			form.reset()
			router.refresh()
			saleModalStore.setSaleUpdated(true)
			saleModalStore.onClose()
		} catch (error) {
			console.log(error)
			toast.error(t('saleError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={saleModalStore.isEditing ? t('updateSaleTitle') : t('addSaleTitle')}
			description={saleModalStore.isEditing ? t('updateSaleDescription') : t('addSaleDescription')}
			isOpen={saleModalStore.isOpen}
			onClose={() => {
				if (saleModalStore.isEditing) {
					saleModalStore.setIsEditing(false)
				}
				form.reset()
				saleModalStore.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<Form {...form}>
							<form className='space-y-4'>
								<FormField
									control={form.control}
									name='merchantId'
									defaultValue={saleModalStore.saleData?.merchantId}
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
													{merchantListStore.merchantList!.map((merchant) => (
														<SelectItem value={merchant.id} key={merchant.id}>
															{merchant.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />

											<Button
												variant='secondary'
												type='button'
												className='mt-2'
												onClick={() => {
													merchantListStore.onOpen()
												}}
											>
												{t('manageMerchantButton')}
											</Button>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='productId'
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
																className={cn(
																	'w-full justify-start text-left font-normal',
																	!field.value && 'text-muted-foreground',
																)}
																disabled={loading}
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
																selected={field.value ? new Date(field.value) : new Date()}
																onSelect={(date) => {
																	if (date) field.onChange(date)
																}}
																initialFocus
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
									control={form.control}
									name='quantity'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('quantity')}</FormLabel>

											<FormControl>
												<Input
													disabled={loading}
													placeholder={t('quantityPlaceholder')}
													type='number'
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='flex w-full items-center justify-end space-x-2 pt-6'>
									<Button
										disabled={loading}
										variant='outline'
										onClick={() => {
											if (saleModalStore.isEditing) {
												saleModalStore.setIsEditing(false)
											}
											form.reset()
											saleModalStore.onClose()
										}}
									>
										{t('cancelButton')}
									</Button>

									<Button
										disabled={loading}
										type='button'
										onClick={() => {
											onSubmit(form.getValues())
										}}
									>
										{saleModalStore.isEditing ? t('updateSaleButton') : t('addSaleButton')}
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
