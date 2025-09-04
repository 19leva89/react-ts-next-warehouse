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
import { Modal } from '@/components/shared/modals'
import { useCustomerList } from '@/hooks/use-customer-list-modal'
import { useAddCustomerModal } from '@/hooks/use-add-customer-modal'

const formSchema = z.object({
	name: z.string().min(1),
})

export const AddCustomerModal = () => {
	const t = useTranslations('Customer')

	const params = useParams()
	const router = useRouter()
	const customerListWarehouse = useCustomerList()
	const addCustomerModal = useAddCustomerModal()

	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	useEffect(() => {
		if (addCustomerModal.isEditing) {
			form.setValue('name', addCustomerModal.customerData?.name ?? '')
		}
	}, [addCustomerModal.isEditing, addCustomerModal.customerData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)

			if (addCustomerModal.isEditing) {
				await axios.put(`/api/${params.warehouseId}/customers/${addCustomerModal.customerData?.id}`, values)

				const customerList = customerListWarehouse.customerList ?? []
				const updatedCustomer = customerList.find(
					(customer) => customer.id === addCustomerModal.customerData?.id,
				)!
				updatedCustomer.name = values.name
				customerList.splice(customerList.indexOf(updatedCustomer), 1, updatedCustomer)

				customerListWarehouse.setCustomerList(customerList)
			} else {
				const response = await axios.post(`/api/${params.warehouseId}/customers`, values)

				const customerList = customerListWarehouse.customerList ?? []

				customerListWarehouse.setCustomerList(
					customerList.concat({
						id: response.data.id,
						name: response.data.name,
					}),
				)
			}

			if (addCustomerModal.isEditing) {
				toast.success(t('updateCustomerSuccess'))
			} else {
				toast.success(t('addCustomerSuccess'))
			}

			form.reset()
			addCustomerModal.setIsEditing(false)
			addCustomerModal.onClose()
			router.refresh()
		} catch {
			toast.error(t('customerError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={addCustomerModal.isEditing ? t('updateCustomerTitle') : t('addCustomerTitle')}
			description={addCustomerModal.isEditing ? t('updateCustomerDescription') : t('addCustomerDescription')}
			isOpen={addCustomerModal.isOpen}
			onClose={() => {
				form.reset()
				addCustomerModal.setIsEditing(false)
				addCustomerModal.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('customerName')}</FormLabel>

											<FormControl>
												<Input disabled={loading} placeholder={t('customerNamePlaceholder')} {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='flex w-full items-center justify-end space-x-2 pt-6'>
									<Button variant='outline' onClick={addCustomerModal.onClose} disabled={loading}>
										{t('cancelButton')}
									</Button>

									<Button type='submit' disabled={loading}>
										{addCustomerModal.isEditing ? t('updateCustomerButton') : t('addCustomerButton')}
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
