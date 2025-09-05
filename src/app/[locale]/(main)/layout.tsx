import { ReactNode } from 'react'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ModalProvider } from '@/providers'
import { redirect } from '@/i18n/navigation'
import { Navbar } from '@/components/shared/navbar'

interface Props {
	children: ReactNode
	params: Promise<{ locale: string }>
}

const RootLayout = async ({ children, params }: Props) => {
	const { locale } = await params

	const session = await auth()

	if (!session) {
		redirect({ href: `/auth/login`, locale })

		return
	}

	const warehouses = await prisma.warehouse.findMany()

	return (
		<>
			<ModalProvider />

			<Navbar warehouses={warehouses} user={session.user} />

			{children}
		</>
	)
}

export default RootLayout
