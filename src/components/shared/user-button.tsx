'use client'

import { useSession } from 'next-auth/react'

import { DropdownContent } from '@/components/shared'
import { Avatar, AvatarFallback, DropdownMenu, DropdownMenuTrigger } from '@/components/ui'

export const UserButton = () => {
	const { data: session } = useSession()

	const name = session?.user.name as string
	const initial = name?.charAt(0)

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarFallback>{initial}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>

				<DropdownContent name={name} />
			</DropdownMenu>
		</div>
	)
}
