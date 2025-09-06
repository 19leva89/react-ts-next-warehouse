'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter } from '@/i18n/navigation'
import { Modal } from '@/components/shared/modals'
import { useUserModal } from '@/hooks/use-user-modal'
import { useRoleOptions } from '@/hooks/use-role-option'
import { Button, Form, Label, Switch } from '@/components/ui'
import { FormCombobox, FormInput } from '@/components/shared/form'

const userProfileFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER', 'VIEWER']),
})

const userPasswordFormSchema = z.object({
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
})

export const UserModal = () => {
	const router = useRouter()
	const roleOptions = useRoleOptions()
	const userWarehouse = useUserModal()
	const t = useTranslations('ManageUser')

	const [loading, setLoading] = useState<boolean>(false)
	const [updatePassword, setUpdatePassword] = useState<boolean>(false)

	const userProfileForm = useForm<z.infer<typeof userProfileFormSchema>>({
		resolver: zodResolver(userProfileFormSchema),
		defaultValues: {
			name: '',
			email: '',
			role: 'VIEWER',
		},
	})

	const userPasswordForm = useForm<z.infer<typeof userPasswordFormSchema>>({
		resolver: zodResolver(userPasswordFormSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	useEffect(() => {
		if (userWarehouse.isEditing && userWarehouse.userData) {
			userProfileForm.reset({
				name: userWarehouse.userData.name || '',
				email: userWarehouse.userData.email || '',
				role: userWarehouse.userData.role || 'VIEWER',
			})

			userPasswordForm.reset({
				password: '',
				confirmPassword: '',
			})
		}
	}, [userWarehouse.isEditing, userWarehouse.userData, userProfileForm, userPasswordForm])

	const onSubmit = async (
		profileValues: z.infer<typeof userProfileFormSchema>,
		passwordValues: z.infer<typeof userPasswordFormSchema>,
	) => {
		try {
			setLoading(true)

			if (updatePassword) {
				if (passwordValues.password !== passwordValues.confirmPassword) {
					toast.error(t('passwordNotMatch'))
					return
				}
			}

			const response = await axios.put(`/api/auth/users/${userWarehouse.userData?.id}`, {
				id: userWarehouse.userData?.id,
				name: profileValues.name,
				email: profileValues.email.toLowerCase(),
				role: profileValues.role,
				updatePassword: updatePassword,
				password: passwordValues.password,
			})

			toast.success(t('updateUserSuccess'))

			userProfileForm.reset()
			setUpdatePassword(false)
			userWarehouse.setIsEditing(false)
			userWarehouse.userSetter(response.data?.users)
			userWarehouse.onClose()
			router.refresh()
		} catch {
			toast.error(t('updateUserFailed'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={t('updateUserTitle')}
			description={t('updateUserDescription')}
			isOpen={userWarehouse.isOpen}
			onClose={() => {
				userProfileForm.reset()
				setUpdatePassword(false)
				userWarehouse.setIsEditing(false)
				userWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-4'>
						<Form {...userProfileForm}>
							<form className='space-y-4'>
								<FormInput
									name='name'
									type='text'
									label={t('userName')}
									placeholder={t('userNamePlaceholder')}
									required
								/>

								<FormInput
									name='email'
									type='email'
									label={t('userEmail')}
									placeholder={t('userEmailPlaceholder')}
									required
								/>

								<FormCombobox
									name='role'
									label={t('userRole')}
									placeholder={t('userRolePlaceholder')}
									noResultsText={t('noResults')}
									selectPlaceholder={t('userRolePlaceholder')}
									valueKey='value'
									labelKey='label'
									mapTable={roleOptions}
									required
								/>
							</form>
						</Form>

						<div className='flex items-center gap-2'>
							<Switch id='usePassword' checked={updatePassword} onCheckedChange={setUpdatePassword} />

							<Label htmlFor='usePassword'>{t('updateUserPassword')}</Label>
						</div>

						{updatePassword && (
							<Form {...userPasswordForm}>
								<form className='space-y-4'>
									<FormInput
										name='password'
										type='password'
										label={t('newPassword')}
										placeholder={t('newPasswordPlaceholder')}
										required
									/>

									<FormInput
										name='confirmPassword'
										type='password'
										label={t('newPasswordConfirmation')}
										placeholder={t('newPasswordConfirmationPlaceholder')}
										required
									/>
								</form>
							</Form>
						)}

						<div className='flex w-full items-center justify-end gap-2 pt-6'>
							<Button variant='outline' disabled={loading} onClick={userWarehouse.onClose}>
								{t('cancelButton')}
							</Button>

							<Button
								type='submit'
								disabled={loading}
								onClick={() => {
									onSubmit(userProfileForm.getValues(), userPasswordForm.getValues())
								}}
							>
								{t('updateUserButton')}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}
