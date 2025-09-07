'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { User2Icon, UsersIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { handleError } from '@/lib/handle-error'
import { UserTile } from './_components/user-tile'
import { useUserModal } from '@/hooks/use-user-modal'
import { useRoleOptions } from '@/hooks/use-role-option'
import { Button, Form, Separator } from '@/components/ui'
import { FormCombobox, FormInput } from '@/components/shared/form'
import { Heading, LoadingIndicator, Subheading } from '@/components/shared'
import { createUserFormSchema, TUserFormValues } from '@/lib/validations/user-schema'

const ManageUserPage = () => {
	const roleOptions = useRoleOptions()
	const userWarehouse = useUserModal()
	const tAuth = useTranslations('Auth')
	const tUser = useTranslations('ManageUser')
	const userFormSchema = createUserFormSchema(tAuth)

	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [currentUser, setCurrentUser] = useState<string>('')
	const [formLoading, setFormLoading] = useState<boolean>(false)

	const userForm = useForm<TUserFormValues>({
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

	async function handleAddUser(values: TUserFormValues) {
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

			if (response.status === 201) {
				toast.success(tUser('addUserSuccess'))

				userForm.reset()

				setUsers(response.data?.users)
			}
		} catch (error) {
			handleError(error, 'ADD_USER')

			toast.error(tUser('addUserFailed'))
		} finally {
			setFormLoading(false)
		}
	}

	if (loading) return <LoadingIndicator />

	return (
		<div className='mx-auto my-8 w-4/5 rounded-lg bg-slate-50 p-8 shadow-lg'>
			<div className='flex-1 space-y-4'>
				<Heading icon={UsersIcon} title={tUser('title')} description={tUser('description')} />

				<Separator />

				<div className='flex size-full gap-4'>
					<div className='flex w-4/5 flex-col gap-8'>
						<div className='flex flex-col gap-2'>
							{users.some((user) => user.role === 'ADMIN') && (
								<>
									<Subheading
										icon={User2Icon}
										title={tUser('adminTitle')}
										description={tUser('adminDescription')}
									/>

									<Separator />
								</>
							)}

							{users
								.filter((user) => user.role === 'ADMIN')
								.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, tUser }))}
						</div>

						{users.some((user) => user.role === 'PRODUCT_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={tUser('productManagerTitle')}
										description={tUser('productManagerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'PRODUCT_MANAGER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, tUser }))}
							</div>
						)}

						{users.some((user) => user.role === 'SALES_MANAGER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={tUser('salesManagerTitle')}
										description={tUser('salesManagerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'SALES_MANAGER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, tUser }))}
							</div>
						)}

						{users.some((user) => user.role === 'VIEWER') && (
							<div className='flex flex-col gap-2'>
								<>
									<Subheading
										icon={User2Icon}
										title={tUser('viewerTitle')}
										description={tUser('viewerDescription')}
									/>

									<Separator />
								</>

								{users
									.filter((user) => user.role === 'VIEWER')
									.map((user) => UserTile({ user, currentUser, userWarehouse, setUsers, tUser }))}
							</div>
						)}
					</div>

					<Separator orientation='vertical' className='h-144' />

					<div className='flex w-2/5 flex-col gap-2'>
						<Subheading
							icon={UsersIcon}
							title={tUser('addUserTitle')}
							description={tUser('addUserDescription')}
						/>

						<Separator />

						<Form {...userForm}>
							<form className='space-y-4' onSubmit={userForm.handleSubmit(handleAddUser)}>
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

								<FormInput
									name='password'
									type='password'
									label={tUser('userPassword')}
									placeholder={tUser('userPasswordPlaceholder')}
									required
								/>

								<FormInput
									name='confirmPassword'
									type='password'
									label={tUser('userPasswordConfirmation')}
									placeholder={tUser('userPasswordConfirmationPlaceholder')}
									required
								/>

								<Button type='submit' disabled={formLoading} className='w-full'>
									{tUser('addUserButton')}
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
