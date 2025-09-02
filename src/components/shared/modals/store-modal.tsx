'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Store } from '@prisma/client'
import { useForm } from 'react-hook-form'
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
import { useStoreList } from '@/hooks/use-store-list-modal'
import { useAddStoreModal } from '@/hooks/use-add-store-modal'

const formSchema = z.object({
	name: z.string().min(1),
})

export const StoreModal = () => {
	const router = useRouter()
	const storeList = useStoreList()
	const t = useTranslations('Store')
	const storeModalStore = useAddStoreModal()

	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	useEffect(() => {
		if (storeModalStore.isEditing) {
			form.setValue('name', storeModalStore.storeData?.name ?? '')
		}
	}, [storeModalStore.isEditing, storeModalStore.storeData, form])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true)

			if (storeModalStore.isEditing) {
				await axios.put(`/api/stores/${storeModalStore.storeData?.id}`, values)
				toast.success(t('updateStoreSuccess'))

				const oldStoreList = storeList.storeList ?? []
				const updatedStore = oldStoreList.find((store) => store.id === storeModalStore.storeData?.id)!
				updatedStore.name = values.name
				oldStoreList.splice(oldStoreList.indexOf(updatedStore), 1, updatedStore)

				storeList.setStoreList(oldStoreList)
				form.reset()
				storeModalStore.setIsEditing(false)
				storeModalStore.onClose()
				router.refresh()
			} else {
				const response = await axios.post('/api/stores', values)

				const oldStoreList = storeList.storeList ?? []

				storeList.setStoreList(oldStoreList.concat(response.data as Store))

				toast.success(t('addStoreSuccess'))

				form.reset()
				storeModalStore.setIsEditing(false)
				storeModalStore.onClose()
				router.push(`/${response.data.id}`)
			}
		} catch {
			toast.error(t('storeError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={storeModalStore.isEditing ? t('updateStoreTitle') : t('addStoreTitle')}
			description={storeModalStore.isEditing ? t('updateStoreDescription') : t('addStoreDescription')}
			isOpen={storeModalStore.isOpen}
			onClose={storeModalStore.onClose}
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
											<FormLabel>{t('storeName')}</FormLabel>

											<FormControl>
												<Input disabled={loading} placeholder={t('storeNamePlaceholder')} {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='flex w-full items-center justify-end space-x-2 pt-6'>
									<Button disabled={loading} variant='outline' onClick={storeModalStore.onClose}>
										{t('cancelButton')}
									</Button>

									<Button disabled={loading} type='submit'>
										{storeModalStore.isEditing ? t('updateStoreButton') : t('addStoreButton')}
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
