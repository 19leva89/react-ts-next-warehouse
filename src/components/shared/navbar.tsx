import { User } from 'next-auth'
import { Warehouse } from '@prisma/client'

import { LocaleSwitcher, MainNav, UserButton, WarehouseSwitcher } from '@/components/shared'

interface Props {
	warehouses: Warehouse[]
	user: User
}

export const Navbar = ({ warehouses, user }: Props) => {
	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<WarehouseSwitcher items={warehouses} user={user} />

				<MainNav className='mx-6' />

				<div className='ml-auto flex items-center gap-4'>
					<LocaleSwitcher />

					<UserButton />
				</div>
			</div>
		</div>
	)
}
