import { User } from '@prisma/client'
import { Edit2Icon } from 'lucide-react'

import { Button } from '@/components/ui'
import { DeleteUserButton } from '@/components/shared'
import { UseUserModalWarehouse } from '@/hooks/use-user-modal'

interface Props {
	user: User
	currentUser: string
	userWarehouse: UseUserModalWarehouse
	setUsers: (users: User[]) => void
	tUser: (key: string) => string
}

export const UserTile = ({ user, currentUser, userWarehouse, setUsers, tUser }: Props) => {
	return (
		<div
			key={user.id}
			className='flex flex-col items-center rounded-lg bg-slate-200 p-4 shadow-md md:flex-row'
		>
			<div className='flex-1'>
				<div className='flex gap-1'>
					<p className='text-lg font-semibold'>{user.name}</p>

					{user.id === currentUser && <p className='text-lg font-semibold'>({tUser('userYou')})</p>}
				</div>

				<p className='text-sm'>{user.email}</p>
			</div>

			{user.id !== currentUser && (
				<>
					<Button
						variant='ghost'
						onClick={() => {
							userWarehouse.setIsEditing(true)
							userWarehouse.setUserData(user)
							userWarehouse.setUserSetter(setUsers)
							userWarehouse.onOpen()
						}}
						className='w-full md:w-auto'
					>
						<Edit2Icon className='size-6' />
					</Button>

					<DeleteUserButton userId={user.id} setUsers={setUsers} />
				</>
			)}
		</div>
	)
}
