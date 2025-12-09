'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRoundIcon, User2Icon } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { Button, Form, Separator } from '@/components/ui'
import { handleErrorClient } from '@/lib/handle-error-client'
import { FormInput, FormSwitch } from '@/components/shared/form'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'
import { createChangePasswordSchema, TChangePasswordValues } from '@/lib/validations/auth-schema'

const userProfileFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	isTwoFactorEnabled: z.boolean(),
	isOAuth: z.boolean().optional(),
})

type TUserProfileFormValues = z.infer<typeof userProfileFormSchema>

const ProfilePage = () => {
	const router = useRouter()
	const tAuth = useTranslations('Auth')
	const tProfile = useTranslations('Profile')
	const passwordFormSchema = createChangePasswordSchema(tAuth)

	const [loading, setLoading] = useState<boolean>(true)
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false)
	const [loadingPassword, setLoadingPassword] = useState<boolean>(false)

	const [profile, setProfile] = useState<TUserProfileFormValues>({
		name: '',
		email: '',
		isTwoFactorEnabled: false,
		isOAuth: false,
	})

	const form = useForm<TUserProfileFormValues>({
		resolver: zodResolver(userProfileFormSchema),
		defaultValues: {
			name: '',
			email: '',
			isTwoFactorEnabled: profile?.isTwoFactorEnabled,
		},
	})

	const passwordForm = useForm<TChangePasswordValues>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			oldPassword: '',
			password: '',
			confirmPassword: '',
		},
	})

	useEffect(() => {
		const getProfile = async () => {
			const response = await axios.get('/api/auth/profile')

			setProfile({
				name: response.data.user?.name,
				email: response.data.user?.email,
				isTwoFactorEnabled: response.data.user?.isTwoFactorEnabled,
				isOAuth: (response.data.user?.accounts?.length ?? 0) > 0,
			})

			setLoading(false)
		}

		getProfile()
	}, [])

	useEffect(() => {
		form.setValue('name', profile.name)
		form.setValue('email', profile.email)
		form.setValue('isTwoFactorEnabled', profile.isTwoFactorEnabled)
	}, [profile, form])

	async function handleProfileUpdate(values: TUserProfileFormValues) {
		try {
			setLoadingProfile(true)

			const response = await axios.put('/api/auth/profile', {
				name: values.name,
				email: values.email,
				isTwoFactorEnabled: values.isTwoFactorEnabled,
			})

			const updatedProfile = {
				name: response.data.user?.name,
				email: response.data.user?.email,
				isTwoFactorEnabled: response.data.user?.isTwoFactorEnabled,
				isOAuth: (response.data.user?.accounts?.length ?? 0) > 0,
			}

			setProfile(updatedProfile)

			toast.success(tProfile('profileUpdateSuccess'))
		} catch (error) {
			handleErrorClient(error, 'UPDATE_PROFILE')

			toast.error(tProfile('profileUpdateFailed'))
		} finally {
			setLoadingProfile(false)
		}
	}

	async function handleChangePassword(values: TChangePasswordValues) {
		try {
			setLoadingPassword(true)

			await axios.put('/api/auth/profile/change-password', {
				oldPassword: values.oldPassword,
				password: values.password,
			})

			router.refresh()

			toast.success(tProfile('passwordUpdateSuccess'))

			passwordForm.reset()
		} catch (error) {
			handleErrorClient(error, 'UPDATE_PASSWORD')

			toast.error(tProfile('passwordUpdateFailed'))
		} finally {
			setLoadingPassword(false)
		}
	}

	if (loading) return <LoadingIndicator />

	return (
		<div className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<div className='flex-1 space-y-4'>
				<Heading icon={User2Icon} title={tProfile('title')} description={tProfile('description')} />

				<Separator />

				<div className='flex size-full gap-4'>
					<div className='w-1/2 '>
						<Form {...form}>
							<form className='space-y-4' onSubmit={form.handleSubmit(handleProfileUpdate)}>
								<Subheading
									icon={User2Icon}
									title={tProfile('profileTitle')}
									description={tProfile('profileDescription')}
								/>

								<Separator />

								<FormInput
									name='name'
									type='text'
									label={tProfile('name')}
									placeholder={tProfile('namePlaceholder')}
									required
								/>

								<FormInput
									name='email'
									type='email'
									label={tProfile('email')}
									placeholder={tProfile('emailPlaceholder')}
									required
								/>

								{profile?.isOAuth === false && (
									<FormSwitch
										name='isTwoFactorEnabled'
										label={tProfile('twoFactorAuth')}
										description={tProfile('twoFactorAuthDescription')}
									/>
								)}

								<Button type='submit' disabled={loadingProfile} className='w-full'>
									{tProfile('saveChangesButton')}
								</Button>
							</form>
						</Form>
					</div>

					<Separator orientation='vertical' className='h-96' />

					<div className='w-1/2'>
						<Form {...passwordForm}>
							<form className='space-y-4' onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
								<Subheading
									icon={KeyRoundIcon}
									title={tProfile('changePasswordTitle')}
									description={tProfile('changePasswordDescription')}
								/>

								<Separator />

								<FormInput
									name='oldPassword'
									type='password'
									label={tProfile('oldPassword')}
									placeholder={tProfile('oldPasswordPlaceholder')}
									required
								/>

								<FormInput
									name='password'
									type='password'
									label={tProfile('newPassword')}
									placeholder={tProfile('newPasswordPlaceholder')}
									required
								/>

								<FormInput
									name='confirmPassword'
									type='password'
									label={tProfile('newPasswordConfirmation')}
									placeholder={tProfile('newPasswordConfirmationPlaceholder')}
									required
								/>

								<Button type='submit' disabled={loadingPassword} className='w-full'>
									{tProfile('changePasswordButton')}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
