'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter } from '@/i18n/navigation'
import { Button, Form } from '@/components/ui'
import { Modal } from '@/components/shared/modals'
import { FormInput } from '@/components/shared/form'
import { Warehouse } from '@/generated/prisma/client'
import { useWarehouseList } from '@/hooks/use-warehouse-list-modal'
import { useAddWarehouseModal } from '@/hooks/use-add-warehouse-modal'

const formSchema = z.object({
	name: z.string().min(1),
})

type TFormValues = z.infer<typeof formSchema>

export const WarehouseModal = () => {
	const router = useRouter()
	const t = useTranslations('Warehouse')
	const warehouseList = useWarehouseList()
	const warehouseModalWarehouse = useAddWarehouseModal()

	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<TFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	useEffect(() => {
		if (warehouseModalWarehouse.isEditing) {
			form.setValue('name', warehouseModalWarehouse.warehouseData?.name ?? '')
		}
	}, [warehouseModalWarehouse.isEditing, warehouseModalWarehouse.warehouseData, form])

	const onSubmit = async (values: TFormValues) => {
		try {
			setLoading(true)

			if (warehouseModalWarehouse.isEditing) {
				await axios.put(`/api/warehouses/${warehouseModalWarehouse.warehouseData?.id}`, values)
				toast.success(t('updateWarehouseSuccess'))

				const oldWarehouseList = warehouseList.warehouseList ?? []
				const updatedWarehouse = oldWarehouseList.find(
					(warehouse) => warehouse.id === warehouseModalWarehouse.warehouseData?.id,
				)!
				updatedWarehouse.name = values.name
				oldWarehouseList.splice(oldWarehouseList.indexOf(updatedWarehouse), 1, updatedWarehouse)

				warehouseList.setWarehouseList(oldWarehouseList)
				form.reset()
				warehouseModalWarehouse.setIsEditing(false)
				warehouseModalWarehouse.onClose()
				router.refresh()
			} else {
				const response = await axios.post('/api/warehouses', values)

				const oldWarehouseList = warehouseList.warehouseList ?? []

				warehouseList.setWarehouseList(oldWarehouseList.concat(response.data as Warehouse))

				toast.success(t('addWarehouseSuccess'))

				form.reset()
				warehouseModalWarehouse.setIsEditing(false)
				warehouseModalWarehouse.onClose()
				router.push(`/${response.data.id}`)
			}
		} catch {
			toast.error(t('warehouseError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={warehouseModalWarehouse.isEditing ? t('updateWarehouseTitle') : t('addWarehouseTitle')}
			description={
				warehouseModalWarehouse.isEditing ? t('updateWarehouseDescription') : t('addWarehouseDescription')
			}
			isOpen={warehouseModalWarehouse.isOpen}
			onClose={warehouseModalWarehouse.onClose}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormInput
									name='name'
									type='text'
									label={t('warehouseName')}
									placeholder={t('warehouseNamePlaceholder')}
									required
								/>

								<div className='flex w-full items-center justify-end gap-2 pt-6'>
									<Button variant='outline' disabled={loading} onClick={warehouseModalWarehouse.onClose}>
										{t('cancelButton')}
									</Button>

									<Button type='submit' disabled={loading}>
										{warehouseModalWarehouse.isEditing ? t('updateWarehouseButton') : t('addWarehouseButton')}
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
