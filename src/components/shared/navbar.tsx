import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { LocaleSwitcher, MainNav, StoreSwitcher } from '@/components/shared'
import { UserButton } from './user-button'

export const Navbar = async () => {
	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	const stores = await prisma.store.findMany()

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher items={stores} user={user!} />

				<MainNav className='mx-6' />

				<div className='ml-auto flex items-center space-x-4'>
					<LocaleSwitcher />

					<UserButton />
				</div>
			</div>
		</div>
	)
}
