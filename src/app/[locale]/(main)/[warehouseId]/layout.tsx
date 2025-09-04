import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { ProductData } from '@/lib/types'
import { redirect } from '@/i18n/navigation'
import { SetProduct } from './_components/set-product'
import { SetCustomer } from './_components/set-customer'
import { SetWarehouse } from './_components/set-warehouse'

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

	const customers = await prisma.customer.findMany()

	return (
		<>
			<SetWarehouse warehouses={warehouses} />

			<SetProduct products={products} />

			<SetCustomer customers={customers} />

			{children}
		</>
	)
}

export default RootLayout
