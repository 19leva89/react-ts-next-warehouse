import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { LocaleSwitcher, MainNav, WarehouseSwitcher } from '@/components/shared'
import { UserButton } from './user-button'

export const Navbar = async () => {
	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	const warehouses = await prisma.warehouse.findMany()

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<WarehouseSwitcher items={warehouses} user={user!} />

				<MainNav className='mx-6' />

				<div className='ml-auto flex items-center space-x-4'>
					<LocaleSwitcher />

					<UserButton />
				</div>
			</div>
		</div>
	)
}
