'use client'

import * as z from 'zod'
import axios from 'axios'
import Image from 'next/image'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
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
import { LoginUserSchema } from '@/lib/validations/user.schema'

type loginSchema = z.infer<typeof LoginUserSchema>

const LoginPage = () => {
	const router = useRouter()
	const t = useTranslations('Login')

	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<loginSchema>({
		resolver: zodResolver(LoginUserSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = async (values: loginSchema) => {
		try {
			setLoading(true)
			const data = {
				email: values.email.toLowerCase(),
				password: values.password,
			}

			const response = await axios.post('/api/auth/login', data)

			if (response.status === 200) {
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
			<div id='box' className='flex w-full flex-col px-8 md:h-3/4 md:w-1/2 md:flex-row'>
				<div id='image' className='bg-accent rounded-l-xl md:h-full md:w-1/2'>
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
					className='relative flex size-full flex-col items-center justify-center rounded-b-xl bg-white p-8 md:w-1/2 md:rounded-r-xl md:rounded-bl-none'
				>
					<div className='absolute right-4 top-4'>
						<LocaleSwitcher />
					</div>

					<h2 className='text-center text-3xl font-bold'>{t('appName')}</h2>

					<h2 className='mb-8 mt-4 text-center text-sm font-bold text-gray-400'>{t('appDescription')}</h2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
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

							<Button type='submit' className='w-full' disabled={loading}>
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
