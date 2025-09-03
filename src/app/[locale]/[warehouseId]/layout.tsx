import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { ProductData } from '@/lib/types'
import { redirect } from '@/i18n/navigation'
import { Navbar } from '@/components/shared/navbar'
import { SetProduct } from './_components/set-product'
import { SetMerchant } from './_components/set-merchant'
import { SetWarehouse } from './_components/set-warehouse'
import { ModalProvider } from '@/providers/modal-provider'

interface Props {
	children: ReactNode
	params: Promise<{ warehouseId: string; locale: string }>
}

const RootLayout = async ({ children, params }: Props) => {
	const { warehouseId, locale } = await params

	const userId = (await cookies()).get('userId')?.value

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	if (!user) {
		redirect({ href: `/auth/login`, locale })
	}

	const currentWarehouse = await prisma.warehouse.findUnique({
		where: {
			id: warehouseId,
		},
	})

	if (!currentWarehouse) {
		notFound()
	}

	const warehouses = await prisma.warehouse.findMany()

	const products = (await prisma.product.findMany({
		where: {
			warehouseId,
		},
	})) as ProductData[]

	const merchants = await prisma.merchant.findMany()

	return (
		<>
			<ModalProvider />

			<Navbar />

			<SetWarehouse warehouses={warehouses} />

			<SetProduct products={products} />

			<SetMerchant merchants={merchants} />

			{children}
		</>
	)
}

export default RootLayout
