'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from '@/components/ui'
import { useProduct } from '@/hooks/use-product'
import { Modal } from '@/components/shared/modals'
import { useProductModal } from '@/hooks/use-product-modal'

const formSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	stockThreshold: z.string().min(1),
	stock: z.string().min(1),
})

export const ProductModal = () => {
	const t = useTranslations('Products')
	const productStore = useProductModal()
	const productListStore = useProduct()
	const params = useParams()
	const router = useRouter()

	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: productStore.isEditing
			? productStore.productData
			: {
					name: '',
					description: '',
					stockThreshold: '',
					stock: '',
				},
	})

	useEffect(() => {
		if (productStore.isEditing) {
			form.setValue('name', productStore.productData?.name ?? '')
			form.setValue('description', productStore.productData?.description ?? '')
			form.setValue('stockThreshold', productStore.productData?.stockThreshold ?? '')
			form.setValue('stock', productStore.productData?.stock ?? '')
		}
	}, [productStore.isEditing, productStore.productData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)

			const formData = new FormData()
			if (file) {
				formData.append('image', file as File)
			}
			formData.append('name', values.name)
			formData.append('description', values.description)
			formData.append('stockThreshold', values.stockThreshold)
			formData.append('stock', values.stock)

			if (productStore.isEditing) {
				formData.append('previousImageId', productStore.productData?.imageId ?? '')
				formData.append('previousImageUrl', productStore.productData?.imageUrl ?? '')

				await axios.put(`/api/${params.storeId}/products/${productStore.productData?.id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				toast.success(t('updateProductSuccess'))
				productStore.setIsEditing(false)
			} else {
				formData.append('type', 'single')

				await axios.post(`/api/${params.storeId}/products`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				toast.success(t('addProductSuccess'))
			}

			router.refresh()
			setFile(null)
			form.reset()
			productListStore.setProductUpdated(true)
			productStore.onClose()
		} catch {
			toast.error(t('productError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={productStore.isEditing ? t('updateProductTitle') : t('addProductTitle')}
			description={productStore.isEditing ? t('updateProductDescription') : t('addProductDescription')}
			isOpen={productStore.isOpen}
			onClose={() => {
				if (productStore.isEditing) {
					productStore.setIsEditing(false)
				}
				form.reset()
				productStore.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<Form {...form}>
							<form className='space-y-4'>
								<FormField
									control={form.control}
									name='name'
									defaultValue={productStore.productData?.name}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('productName')}</FormLabel>

											<FormControl>
												<Input disabled={loading} placeholder={t('productNamePlaceholder')} {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormItem>
									<FormLabel>{t('productImage')}</FormLabel>

									<FormControl>
										<Input
											name='image'
											type='file'
											accept='image/*'
											disabled={loading}
											placeholder={t('productImagePlaceholder')}
											onChange={(event: any) => {
												setFile(event.target.files?.[0] ?? null)
											}}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>

								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('productDescription')}</FormLabel>

											<FormControl>
												<Input
													disabled={loading}
													placeholder={t('productDescriptionPlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='stockThreshold'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('productStockThreshold')}</FormLabel>

											<FormControl>
												<Input
													disabled={loading}
													placeholder={t('productStockThresholdPlaceholder')}
													type='number'
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='stock'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('productStock')}</FormLabel>

											<FormControl>
												<Input
													disabled={loading}
													placeholder={t('productStockPlaceholder')}
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
											if (productStore.isEditing) {
												productStore.setIsEditing(false)
											}
											form.reset()
											productStore.onClose()
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
										{productStore.isEditing ? t('updateProductButton') : t('addProductButton')}
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
