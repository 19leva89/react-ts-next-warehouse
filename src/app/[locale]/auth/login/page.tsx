'use client'

import Image from 'next/image'
import { toast } from 'sonner'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Form } from '@/components/ui'
import { Link, useRouter } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/shared'
import { credentialsLoginUser } from '@/actions/login'
import { FormCheckbox, FormInput } from '@/components/shared/form'
import { createLoginSchema, TLoginValues } from '@/lib/validations/user-schema'

const LoginPage = () => {
	const router = useRouter()
	const t = useTranslations('Auth')
	const LoginSchema = createLoginSchema(t)

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
						<form onSubmit={form.handleSubmit(handleCredentialsLogin)} className='w-full space-y-6'>
							<FormInput name='email' type='email' placeholder={t('email')} required />

							<FormInput name='password' type='password' placeholder={t('password')} required />

							{showTwoFactor && <FormInput name='code' type='password' placeholder={t('2faCode')} required />}

							<FormCheckbox name='rememberMe' label={t('rememberMe')} className='mt-2' required={false} />

							<Button type='submit' disabled={loading} className='w-full'>
								{showTwoFactor ? t('confirm') : t('login')}
							</Button>

							<Button asChild size='sm' variant='link' className='px-0 font-normal'>
								<Link href='/auth/reset'>{t('forgotPassword')}</Link>
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</section>
	)
}

export default LoginPage
