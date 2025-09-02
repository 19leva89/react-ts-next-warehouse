import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { ProductData } from '@/lib/types'
import { redirect } from '@/i18n/navigation'
import { SetStore } from './_components/set-store'
import { Navbar } from '@/components/shared/navbar'
import { SetProduct } from './_components/set-product'
import { SetMerchant } from './_components/set-merchant'
import { ModalProvider } from '@/providers/modal-provider'

interface Props {
	children: ReactNode
	params: Promise<{ storeId: string; locale: string }>
}

const RootLayout = async ({ children, params }: Props) => {
	const { storeId, locale } = await params

	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	if (!user) {
		redirect({ href: `/auth/login`, locale })
	}

	const currentStore = await prisma.store.findUnique({
		where: {
			id: storeId,
		},
	})

	if (!currentStore) {
		notFound()
	}

	const stores = await prisma.store.findMany()

	const products = (await prisma.product.findMany({
		where: {
			storeId,
		},
	})) as ProductData[]

	const merchants = await prisma.merchant.findMany()

	return (
		<>
			<ModalProvider />

			<Navbar />

			<SetStore stores={stores} />

			<SetProduct products={products} />

			<SetMerchant merchants={merchants} />

			{children}
		</>
	)
}

export default RootLayout
