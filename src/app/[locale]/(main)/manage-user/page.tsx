'use client'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { User2Icon, UsersIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserTile } from './_components/user-tile'
import { useUserModal } from '@/hooks/use-user-modal'
import { useRoleOptions } from '@/hooks/use-role-option'
import { Button, Form, Separator } from '@/components/ui'
import { FormCombobox, FormInput } from '@/components/shared/form'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'

const userFormSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER', 'VIEWER']),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
})

const ManageUserPage = () => {
	const roleOptions = useRoleOptions()
	const userWarehouse = useUserModal()
	const t = useTranslations('ManageUser')

	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [currentUser, setCurrentUser] = useState<string>('')
	const [formLoading, setFormLoading] = useState<boolean>(false)

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
				<Heading icon={UsersIcon} title={t('title')} description={t('description')} />

				<Separator />

				<div className='flex size-full gap-4'>
					<div className='flex w-4/5 flex-col gap-8'>
						<div className='flex flex-col gap-2'>
							{users.some((user) => user.role === 'ADMIN') && (
								<>
									<Subheading icon={User2Icon} title={t('adminTitle')} description={t('adminDescription')} />

									<Separator />
								</>
							)}

							{users
								.filter((user) => user.role === 'ADMIN')
								.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, t }))}
						</div>

						{users.some((user) => user.role === 'PRODUCT_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={t('productManagerTitle')}
										description={t('productManagerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'PRODUCT_MANAGER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, t }))}
							</div>
						)}

						{users.some((user) => user.role === 'SALES_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={t('salesManagerTitle')}
										description={t('salesManagerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'SALES_MANAGER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, t }))}
							</div>
						)}

						{users.some((user) => user.role === 'VIEWER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={t('viewerTitle')}
										description={t('viewerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'VIEWER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, t }))}
							</div>
						)}
					</div>

					<Separator orientation='vertical' className='h-144' />

					<div className='flex w-2/5 flex-col gap-2'>
						<Subheading icon={UsersIcon} title={t('addUserTitle')} description={t('addUserDescription')} />

						<Separator />

						<Form {...userForm}>
							<form className='space-y-4' onSubmit={userForm.handleSubmit(handleAddUser)}>
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

								<FormInput
									name='password'
									type='password'
									label={t('userPassword')}
									placeholder={t('userPasswordPlaceholder')}
									required
								/>

								<FormInput
									name='confirmPassword'
									type='password'
									label={t('userPasswordConfirmation')}
									placeholder={t('userPasswordConfirmationPlaceholder')}
									required
								/>

								<Button type='submit' disabled={formLoading} className='w-full'>
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
