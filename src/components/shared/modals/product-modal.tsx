'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { useRouter } from '@/i18n/navigation'
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
	const params = useParams()
	const router = useRouter()
	const t = useTranslations('Products')
	const productListWarehouse = useProduct()
	const productWarehouse = useProductModal()

	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: productWarehouse.isEditing
			? productWarehouse.productData
			: {
					name: '',
					description: '',
					stockThreshold: '',
					stock: '',
				},
	})

	useEffect(() => {
		if (productWarehouse.isEditing) {
			form.setValue('name', productWarehouse.productData?.name ?? '')
			form.setValue('description', productWarehouse.productData?.description ?? '')
			form.setValue('stockThreshold', productWarehouse.productData?.stockThreshold ?? '')
			form.setValue('stock', productWarehouse.productData?.stock ?? '')
		}
	}, [productWarehouse.isEditing, productWarehouse.productData, form])

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

			const baseApiPath = params.warehouseId ? `/api/${params.warehouseId}/products` : '/api/products'

			if (productWarehouse.isEditing) {
				formData.append('previousImageId', productWarehouse.productData?.imageId ?? '')
				formData.append('previousImageUrl', productWarehouse.productData?.imageUrl ?? '')

				const updateUrl = params.warehouseId
					? `${baseApiPath}/${productWarehouse.productData?.id}`
					: `${baseApiPath}/${productWarehouse.productData?.id}`

				await axios.put(updateUrl, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				toast.success(t('updateProductSuccess'))
				productWarehouse.setIsEditing(false)
			} else {
				formData.append('type', 'single')

				await axios.post(baseApiPath, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				toast.success(t('addProductSuccess'))
			}

			router.refresh()
			setFile(null)
			form.reset()
			productListWarehouse.setProductUpdated(true)
			productWarehouse.onClose()
		} catch {
			toast.error(t('productError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={productWarehouse.isEditing ? t('updateProductTitle') : t('addProductTitle')}
			description={productWarehouse.isEditing ? t('updateProductDescription') : t('addProductDescription')}
			isOpen={productWarehouse.isOpen}
			onClose={() => {
				if (productWarehouse.isEditing) {
					productWarehouse.setIsEditing(false)
				}
				form.reset()
				productWarehouse.onClose()
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
									defaultValue={productWarehouse.productData?.name}
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
											className='cursor-pointer file:cursor-pointer'
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

								<div className='flex w-full items-center justify-end space-x-2 pt-6'>
									<Button
										variant='outline'
										disabled={loading}
										onClick={() => {
											if (productWarehouse.isEditing) {
												productWarehouse.setIsEditing(false)
											}
											form.reset()
											productWarehouse.onClose()
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
										{productWarehouse.isEditing ? t('updateProductButton') : t('addProductButton')}
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
