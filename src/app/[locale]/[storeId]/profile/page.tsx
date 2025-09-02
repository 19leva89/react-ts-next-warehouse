'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRoundIcon, User2Icon } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input, Separator } from '@/components/ui'

const profileFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
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
	})

	const profileForm = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: '',
			email: '',
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
			})

			setLoading(false)
		}

		getProfile()
	}, [])

	useEffect(() => {
		profileForm.setValue('name', profile.name)
		profileForm.setValue('email', profile.email)
	}, [profile, profileForm])

	async function handleProfileUpdate(values: z.infer<typeof profileFormSchema>) {
		try {
			setLoadingProfile(true)

			const response = await axios.put('/api/auth/profile', {
				name: values.name,
				email: values.email,
			})

			setProfile({
				name: response.data.user?.name,
				email: response.data.user?.email,
			})

			profileForm.setValue('name', response.data.user?.name)
			profileForm.setValue('email', response.data.user?.email)

			router.refresh()
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

			passwordForm.setValue('oldPassword', '')
			passwordForm.setValue('password', '')
			passwordForm.setValue('confirmPassword', '')

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
						<Form {...profileForm}>
							<form className='space-y-4' onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
								<Subheading
									icon={User2Icon}
									title={t('profileTitle')}
									description={t('profileDescription')}
								/>

								<Separator />

								<FormField
									control={profileForm.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('name')}</FormLabel>

											<FormControl>
												<Input placeholder={t('namePlaceholder')} disabled={loadingProfile} {...field} />
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={profileForm.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('email')}</FormLabel>

											<FormControl>
												<Input
													type='email'
													placeholder={t('emailPlaceholder')}
													disabled={loadingProfile}
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<Button type='submit' className='w-full' disabled={loadingProfile}>
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

								<FormField
									control={passwordForm.control}
									name='oldPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('oldPassword')}</FormLabel>

											<FormControl>
												<Input
													placeholder={t('oldPasswordPlaceholder')}
													disabled={loadingPassword}
													type='password'
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('newPassword')}</FormLabel>

											<FormControl>
												<Input
													placeholder={t('newPasswordPlaceholder')}
													disabled={loadingPassword}
													type='password'
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('newPasswordConfirmation')}</FormLabel>

											<FormControl>
												<Input
													placeholder={t('newPasswordConfirmationPlaceholder')}
													disabled={loadingPassword}
													type='password'
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<Button type='submit' className='w-full' disabled={loadingPassword}>
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
