import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { ProductData } from '@/lib/types'
import { appDesc, appName } from '@/lib/static'
import { SetStore } from './_components/set-store'
import { Navbar } from '@/components/shared/navbar'
import { SetProduct } from './_components/set-product'
import { SetMerchant } from './_components/set-merchant'
import { ModalProvider } from '@/providers/modal-provider'

export const metadata: Metadata = {
	title: appName,
	description: appDesc,
}

interface Props {
	children: ReactNode
	params: Promise<{ storeId: string }>
}

const RootLayout = async ({ children, params }: Props) => {
	const { storeId } = await params

	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	if (!user) {
		redirect('/logout')
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
