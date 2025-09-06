'use client'

import Image from 'next/image'
import { toast } from 'sonner'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Resolver, useForm } from 'react-hook-form'
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
import { LocaleSwitcher } from '@/components/shared'
import { credentialsLoginUser } from '@/actions/login'
import { LoginSchema, TLoginValues } from '@/lib/validations/user-schema'

const LoginPage = () => {
	const router = useRouter()
	const t = useTranslations('Login')

	const [loading, setLoading] = useState<boolean>(false)
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)

	const form = useForm<TLoginValues>({
		resolver: zodResolver(LoginSchema) as Resolver<TLoginValues>,
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const handleCredentialsLogin = async (data: TLoginValues) => {
		setLoading(true)

		try {
			const result = await credentialsLoginUser(data)

			if (result?.error) {
				toast.error(result.error)
				return
			}

			if (result?.twoFactor) {
				setShowTwoFactor(true)

				toast.success('Please verify your email first. We sent you a new 2FA code')
			}

			if (result?.success) {
				toast.success('You have successfully login')

				router.push('/')
			}
		} catch {
			toast.error(t('emailPasswordError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<section id='background' className='flex h-screen w-screen items-center justify-center bg-slate-600'>
			<div id='box' className='flex w-full flex-col px-8 md:w-2/3 lg:h-3/4 lg:w-1/2 lg:flex-row'>
				<div id='image' className='hidden rounded-l-xl bg-accent md:h-full lg:block lg:w-1/2'>
					<Image
						src='/assets/svg/auth-logo.svg'
						alt='Auth Logo'
						width={400}
						height={500}
						objectFit='cover'
						className='w-full rounded-t-xl md:h-full md:w-full md:rounded-l-xl md:rounded-tr-none'
					/>
				</div>

				<div
					id='login-form'
					className='relative flex size-full flex-col items-center justify-center rounded-xl bg-white p-8 lg:w-1/2 lg:rounded-l-none'
				>
					<div className='absolute top-4 right-4'>
						<LocaleSwitcher />
					</div>

					<h2 className='text-center text-3xl font-bold'>{t('appName')}</h2>

					<h2 className='mt-4 mb-8 text-center text-sm font-bold text-gray-400'>{t('appDescription')}</h2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleCredentialsLogin)} className='w-full space-y-8'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>

										<FormControl>
											<Input disabled={loading} placeholder='Email' {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>

										<FormControl>
											<Input disabled={loading} type='password' placeholder='Password' {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							{showTwoFactor && (
								<FormField
									control={form.control}
									name='code'
									render={({ field }) => (
										<FormItem>
											<FormLabel>2FA code</FormLabel>

											<FormControl>
												<Input disabled={loading} type='password' placeholder='2FA code' {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<Button type='submit' disabled={loading} className='w-full'>
								{t('login')}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</section>
	)
}

export default LoginPage
