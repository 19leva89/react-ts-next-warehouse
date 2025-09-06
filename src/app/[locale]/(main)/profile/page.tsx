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
import { FormInput, FormSwitch } from '@/components/shared/form'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'

const profileFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	isTwoFactorEnabled: z.boolean(),
	isOAuth: z.boolean().optional(),
})

const passwordFormSchema = z.object({
	oldPassword: z.string().min(8),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
})

const ProfilePage = () => {
	const router = useRouter()
	const t = useTranslations('Profile')

	const [loading, setLoading] = useState<boolean>(true)
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false)
	const [loadingPassword, setLoadingPassword] = useState<boolean>(false)

	const [profile, setProfile] = useState<z.infer<typeof profileFormSchema>>({
		name: '',
		email: '',
		isTwoFactorEnabled: false,
		isOAuth: false,
	})

	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: '',
			email: '',
			isTwoFactorEnabled: profile?.isTwoFactorEnabled,
		},
	})

	const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
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
				isOAuth: response.data.user?.accounts?.length ?? 0 > 0,
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

	async function handleProfileUpdate(values: z.infer<typeof profileFormSchema>) {
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
				isOAuth: response.data.user?.accounts?.length ?? 0 > 0,
			}

			setProfile(updatedProfile)

			toast.success(t('profileUpdateSuccess'))
		} catch (error) {
			console.log(error)

			toast.error(t('profileUpdateFailed'))
		} finally {
			setLoadingProfile(false)
		}
	}

	async function handleChangePassword(values: z.infer<typeof passwordFormSchema>) {
		try {
			setLoadingPassword(true)

			if (values.password !== values.confirmPassword) {
				toast.error(t('passwordNotMatch'))

				return
			}

			await axios.put('/api/auth/profile/change-password', {
				oldPassword: values.oldPassword,
				password: values.password,
			})

			router.refresh()

			toast.success(t('passwordUpdateSuccess'))
		} catch (error: any) {
			console.log(error)

			toast.error(error.response.data.message)
			toast.error(t('passwordUpdateFailed'))
		} finally {
			setLoadingPassword(false)
		}
	}

	if (loading) return <LoadingIndicator />

	return (
		<div className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<div className='flex-1 space-y-4'>
				<Heading icon={User2Icon} title={t('title')} description={t('description')} />

				<Separator />

				<div className='flex size-full gap-4'>
					<div className='w-1/2 '>
						<Form {...form}>
							<form className='space-y-4' onSubmit={form.handleSubmit(handleProfileUpdate)}>
								<Subheading
									icon={User2Icon}
									title={t('profileTitle')}
									description={t('profileDescription')}
								/>

								<Separator />

								<FormInput
									name='name'
									type='text'
									label={t('name')}
									placeholder={t('namePlaceholder')}
									required
								/>

								<FormInput
									name='email'
									type='email'
									label={t('email')}
									placeholder={t('emailPlaceholder')}
									required
								/>

								{profile?.isOAuth === false && (
									<FormSwitch
										name='isTwoFactorEnabled'
										label={t('twoFactorAuth')}
										description={t('twoFactorAuthDescription')}
									/>
								)}

								<Button type='submit' disabled={loadingProfile} className='w-full'>
									{t('saveChangesButton')}
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
									title={t('changePasswordTitle')}
									description={t('changePasswordDescription')}
								/>

								<Separator />

								<FormInput
									name='oldPassword'
									type='password'
									label={t('oldPassword')}
									placeholder={t('oldPasswordPlaceholder')}
									required
								/>

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

								<Button type='submit' disabled={loadingPassword} className='w-full'>
									{t('changePasswordButton')}
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
