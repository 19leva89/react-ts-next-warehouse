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
import { createNewPasswordSchema, TNewPasswordValues } from '@/lib/validations/auth-schema'

const userProfileFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER', 'VIEWER']),
})

type TUserProfileForm = z.infer<typeof userProfileFormSchema>

export const UserModal = () => {
	const router = useRouter()
	const roleOptions = useRoleOptions()
	const userWarehouse = useUserModal()
	const tAuth = useTranslations('Auth')
	const tUser = useTranslations('ManageUser')
	const userPasswordFormSchema = createNewPasswordSchema(tAuth)

	const [loading, setLoading] = useState<boolean>(false)
	const [updatePassword, setUpdatePassword] = useState<boolean>(false)

	const userProfileForm = useForm<TUserProfileForm>({
		resolver: zodResolver(userProfileFormSchema),
		defaultValues: {
			name: '',
			email: '',
			role: 'VIEWER',
		},
	})

	const userPasswordForm = useForm<TNewPasswordValues>({
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

	const onProfileSubmit = async (profileValues: TUserProfileForm) => {
		// If updatePassword is true, validate the password form
		if (updatePassword) {
			const isPasswordValid = await userPasswordForm.trigger()

			if (!isPasswordValid) {
				return
			}
		}

		await submitData(profileValues, userPasswordForm.getValues())
	}

	const submitData = async (profileValues: TUserProfileForm, passwordValues: TNewPasswordValues) => {
		try {
			setLoading(true)

			const response = await axios.put(`/api/auth/users/${userWarehouse.userData?.id}`, {
				id: userWarehouse.userData?.id,
				name: profileValues.name,
				email: profileValues.email.toLowerCase(),
				role: profileValues.role,
				updatePassword: updatePassword,
				password: updatePassword ? passwordValues.password : undefined,
			})

			toast.success(tUser('updateUserSuccess'))

			userProfileForm.reset()
			userPasswordForm.reset()
			setUpdatePassword(false)
			userWarehouse.setIsEditing(false)
			userWarehouse.userSetter?.(response.data?.users)
			userWarehouse.onClose()
			router.refresh()
		} catch {
			toast.error(tUser('updateUserFailed'))
		} finally {
			setLoading(false)
		}
	}

	const handleFormSubmit = () => {
		userProfileForm.handleSubmit(onProfileSubmit)()
	}

	return (
		<Modal
			title={tUser('updateUserTitle')}
			description={tUser('updateUserDescription')}
			isOpen={userWarehouse.isOpen}
			onClose={() => {
				userProfileForm.reset()
				userPasswordForm.reset()
				setUpdatePassword(false)
				userWarehouse.setIsEditing(false)
				userWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-4'>
						<Form {...userProfileForm}>
							<form className='space-y-4' onSubmit={userProfileForm.handleSubmit(onProfileSubmit)}>
								<FormInput
									name='name'
									type='text'
									label={tUser('userName')}
									placeholder={tUser('userNamePlaceholder')}
									required
								/>

								<FormInput
									name='email'
									type='email'
									label={tUser('userEmail')}
									placeholder={tUser('userEmailPlaceholder')}
									required
								/>

								<FormCombobox
									name='role'
									label={tUser('userRole')}
									placeholder={tUser('userRolePlaceholder')}
									noResultsText={tUser('noResults')}
									selectPlaceholder={tUser('userRolePlaceholder')}
									valueKey='value'
									labelKey='label'
									mapTable={roleOptions}
									required
								/>
							</form>
						</Form>

						<div className='flex items-center gap-2'>
							<Switch id='usePassword' checked={updatePassword} onCheckedChange={setUpdatePassword} />
							<Label htmlFor='usePassword'>{tUser('updateUserPassword')}</Label>
						</div>

						{updatePassword && (
							<Form {...userPasswordForm}>
								<form className='space-y-4'>
									<FormInput
										name='password'
										type='password'
										label={tUser('newPassword')}
										placeholder={tUser('newPasswordPlaceholder')}
										required
									/>

									<FormInput
										name='confirmPassword'
										type='password'
										label={tUser('newPasswordConfirmation')}
										placeholder={tUser('newPasswordConfirmationPlaceholder')}
										required
									/>
								</form>
							</Form>
						)}

						<div className='flex w-full items-center justify-end gap-2 pt-6'>
							<Button variant='outline' disabled={loading} onClick={userWarehouse.onClose}>
								{tUser('cancelButton')}
							</Button>

							<Button type='button' disabled={loading} onClick={handleFormSubmit}>
								{tUser('updateUserButton')}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}
