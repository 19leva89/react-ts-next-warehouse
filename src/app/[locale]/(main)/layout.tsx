import { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { redirect } from '@/i18n/navigation'
import { Navbar } from '@/components/shared/navbar'
import { ModalProvider } from '@/providers/modal-provider'

interface Props {
	children: ReactNode
	params: Promise<{ locale: string }>
}

const RootLayout = async ({ children, params }: Props) => {
	const { locale } = await params

	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	if (!user) {
		redirect({ href: `/auth/login`, locale })
	}

	return (
		<>
			<ModalProvider />

			<Navbar />

			{children}
		</>
	)
}

export default RootLayout
