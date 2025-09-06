'use client'

import { useSession } from 'next-auth/react'

import { DropdownContent } from '@/components/shared'
import { Avatar, AvatarFallback, DropdownMenu, DropdownMenuTrigger } from '@/components/ui'

export const UserButton = () => {
	const { data: session } = useSession()

	const name = session?.user?.name ?? ''
	const initial = name ? name.charAt(0) : 'U'

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarFallback>{initial}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>

				<DropdownContent name={name || 'User'} />
			</DropdownMenu>
		</div>
	)
}
