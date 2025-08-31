'use client'

import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { User2Icon, UsersIcon } from 'lucide-react'
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
} from '@/components/ui'
import { UserTile } from './_components/user-tile'
import { useUserModal } from '@/hooks/use-user-modal'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'

const roleOption = [
	{
		label: 'Admin',
		value: 'ADMIN',
	},
	{
		label: 'Product Manager',
		value: 'PRODUCT_MANAGER',
	},
	{
		label: 'Sales Manager',
		value: 'SALES_MANAGER',
	},
	{
		label: 'Viewer',
		value: 'VIEWER',
	},
]

const userFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER', 'VIEWER']),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
})

const ManageUserPage = () => {
	const t = useTranslations('ManageUser')
	const userStore = useUserModal()

	const [loading, setLoading] = useState<boolean>(true)
	const [formLoading, setFormLoading] = useState<boolean>(false)
	const [currentUser, setCurrentUser] = useState<string>('')
	const [users, setUsers] = useState<User[]>([])

	const userForm = useForm<z.infer<typeof userFormSchema>>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			name: '',
			email: '',
			role: 'VIEWER',
			password: '',
			confirmPassword: '',
		},
	})

	useEffect(() => {
		const getProfile = async () => {
			const response = await axios.get('/api/auth/users')

			setUsers(response.data?.users)
			setCurrentUser(response.data?.currentUser)

			setLoading(false)
		}

		getProfile()
	}, [])

	async function handleAddUser(values: z.infer<typeof userFormSchema>) {
		try {
			setFormLoading(true)

			const user = {
				name: values.name,
				email: values.email.toLowerCase(),
				role: values.role,
				password: values.password,
				confirmPassword: values.confirmPassword,
			}

			const response = await axios.post('/api/auth/users', user)

			if (response.status === 200) {
				toast.success(t('addUserSuccess'))
				userForm.reset()
				userForm.setValue('role', 'VIEWER')
				setUsers(response.data?.users)
			}
		} catch (error) {
			console.log(error)
			toast.error(t('addUserFailed'))
		} finally {
			setFormLoading(false)
		}
	}

	if (loading) return <LoadingIndicator />

	return (
		<div className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<div className='flex-1 space-y-4'>
				<Heading icon={<UsersIcon className='size-8' />} title={t('title')} description={t('description')} />

				<Separator />

				<div className='flex h-full w-full gap-4'>
					<div className='flex w-4/5 flex-col gap-8'>
						<div className='flex flex-col gap-2'>
							{users.some((user) => user.role === 'ADMIN') && (
								<>
									<Subheading
										icon={<User2Icon className='size-8' />}
										title={t('adminTitle')}
										description={t('adminDescription')}
									/>

									<Separator />
								</>
							)}

							{users
								.filter((user) => user.role === 'ADMIN')
								.map((user) => UserTile({ user, currentUser, userStore, setUsers, t }))}
						</div>

						{users.some((user) => user.role === 'PRODUCT_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={<User2Icon className='size-8' />}
										title={t('productManagerTitle')}
										description={t('productManagerDescription')}
									/>

									<Separator />
								</>
								{users
									.filter((user) => user.role === 'PRODUCT_MANAGER')
									.map((user) => UserTile({ user, currentUser, userStore, setUsers, t }))}
							</div>
						)}

						{users.some((user) => user.role === 'SALES_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={<User2Icon className='size-8' />}
										title={t('salesManagerTitle')}
										description={t('salesManagerDescription')}
									/>

									<Separator />
								</>
								{users
									.filter((user) => user.role === 'SALES_MANAGER')
									.map((user) => UserTile({ user, currentUser, userStore, setUsers, t }))}
							</div>
						)}

						{users.some((user) => user.role === 'VIEWER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={<User2Icon className='size-8' />}
										title={t('viewerTitle')}
										description={t('viewerDescription')}
									/>

									<Separator />
								</>
								{users
									.filter((user) => user.role === 'VIEWER')
									.map((user) => UserTile({ user, currentUser, userStore, setUsers, t }))}
							</div>
						)}
					</div>

					<Separator orientation='vertical' className='h-144' />

					<div className='flex w-2/5 flex-col gap-2'>
						<Subheading
							title={t('addUserTitle')}
							description={t('addUserDescription')}
							icon={<UsersIcon className='size-8' />}
						/>

						<Separator />

						<Form {...userForm}>
							<form className='space-y-4' onSubmit={userForm.handleSubmit(handleAddUser)}>
								<FormField
									control={userForm.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('userName')}</FormLabel>

											<FormControl>
												<Input
													disabled={formLoading}
													type='text'
													placeholder={t('userNamePlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={userForm.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('userEmail')}</FormLabel>

											<FormControl>
												<Input
													disabled={formLoading}
													type='email'
													placeholder={t('userEmailPlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={userForm.control}
									name='role'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('userRole')}</FormLabel>

											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={formLoading}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={t('userRolePlaceholder')} />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{roleOption.map((role) => (
														<SelectItem key={role.value} value={role.value}>
															{role.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={userForm.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('userPassword')}</FormLabel>

											<FormControl>
												<Input
													disabled={formLoading}
													type='password'
													placeholder={t('userPasswordPlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={userForm.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('userPasswordConfirmation')}</FormLabel>

											<FormControl>
												<Input
													disabled={formLoading}
													type='password'
													placeholder={t('userPasswordConfirmationPlaceholder')}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type='submit' className='w-full' disabled={formLoading}>
									{t('addUserButton')}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ManageUserPage
