import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { DropdownContent } from '@/components/shared'
import { Avatar, AvatarFallback, DropdownMenu, DropdownMenuTrigger } from '@/components/ui'

export async function UserButton() {
	const cookieStore = cookies()
	const userId = (await cookieStore).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	const name = user?.name as string
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
