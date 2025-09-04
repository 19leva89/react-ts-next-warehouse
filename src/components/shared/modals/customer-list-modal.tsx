'use client'

import { Fragment } from 'react'
import { Edit2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Modal } from '@/components/shared/modals'
import { DeleteCustomerButton } from '@/components/shared'
import { Button, ScrollArea, Separator } from '@/components/ui'
import { useCustomerList } from '@/hooks/use-customer-list-modal'
import { useAddCustomerModal } from '@/hooks/use-add-customer-modal'

export const CustomerListModal = () => {
	const t = useTranslations('Customer')
	const customerListWarehouse = useCustomerList()
	const addCustomerModal = useAddCustomerModal()

	return (
		<Modal
			title={t('customerListTitle')}
			description={t('customerListDescription')}
			isOpen={customerListWarehouse.isOpen}
			onClose={() => {
				customerListWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<ScrollArea className='h-125'>
							<div className='flex flex-col gap-2'>
								<Separator />

								{customerListWarehouse.customerList?.map((customer) => (
									<Fragment key={customer.id}>
										<div className='flex items-center justify-between'>
											<div>{customer.name}</div>

											<div className='flex'>
												<Button
													variant='ghost'
													onClick={() => {
														addCustomerModal.setIsEditing(true)
														addCustomerModal.setCustomerData(customer)
														addCustomerModal.onOpen()
													}}
												>
													<Edit2Icon className='size-4' />
												</Button>

												<DeleteCustomerButton customerId={customer.id} />
											</div>
										</div>

										<Separator />
									</Fragment>
								))}
							</div>
						</ScrollArea>

						<Button
							variant='default'
							onClick={() => {
								addCustomerModal.onOpen()
							}}
							className='w-full'
						>
							{t('addCustomerButton')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
