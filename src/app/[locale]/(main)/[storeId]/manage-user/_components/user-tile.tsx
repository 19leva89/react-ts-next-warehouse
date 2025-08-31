import { User } from '@prisma/client'
import { Edit2Icon } from 'lucide-react'

import { Button } from '@/components/ui'
import { DeleteUserButton } from '@/components/shared'

interface Props {
	user: User
	currentUser: string
	userStore: any
	setUsers: any
	t: any
}

export const UserTile = ({ user, currentUser, userStore, setUsers, t }: Props) => {
	return (
		<div
			key={user.id}
			className='flex flex-col items-center rounded-lg bg-slate-200 p-4 shadow-md md:flex-row'
		>
			<div className='flex-1'>
				<div className='flex gap-1'>
					<p className='text-lg font-semibold'>{user.name}</p>
					{user.id === currentUser && <p className='text-lg font-semibold'>({t('userYou')})</p>}
				</div>

				<p className='text-sm'>{user.email}</p>
			</div>

			{user.id !== currentUser && (
				<>
					<Button
						variant='ghost'
						className='w-full md:w-auto'
						onClick={() => {
							userStore.setIsEditing(true)
							userStore.setUserData(user)
							userStore.setUserSetter(setUsers)
							userStore.onOpen()
						}}
					>
						<Edit2Icon className='size-6' />
					</Button>

					<DeleteUserButton key={user.id} userId={user.id} setUsers={setUsers} />
				</>
			)}
		</div>
	)
}
