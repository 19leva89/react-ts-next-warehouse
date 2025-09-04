'use client'

import { Fragment } from 'react'
import { Edit2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Modal } from '@/components/shared/modals'
import { Button, ScrollArea, Separator } from '@/components/ui'
import { useWarehouseList } from '@/hooks/use-warehouse-list-modal'
import { useAddWarehouseModal } from '@/hooks/use-add-warehouse-modal'
import { DeleteWarehouseButton } from '@/components/shared/delete-warehouse-button'

export const WarehouseListModal = () => {
	const t = useTranslations('Warehouse')
	const addWarehouseModal = useAddWarehouseModal()
	const warehouseListWarehouse = useWarehouseList()

	return (
		<Modal
			title={t('warehouseListTitle')}
			description={t('warehouseListDescription')}
			isOpen={warehouseListWarehouse.isOpen}
			onClose={() => {
				warehouseListWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<ScrollArea className='h-125'>
							<div className='flex flex-col gap-2'>
								<Separator />

								{warehouseListWarehouse.warehouseList?.map((warehouse) => (
									<Fragment key={warehouse.id}>
										<div className='flex items-center justify-between'>
											<div>{warehouse.name}</div>

											<div className='flex'>
												<Button
													variant='ghost'
													onClick={() => {
														addWarehouseModal.setIsEditing(true)
														addWarehouseModal.setWarehouseData(warehouse)
														addWarehouseModal.onOpen()
													}}
												>
													<Edit2Icon className='size-4' />
												</Button>

												<DeleteWarehouseButton warehouseId={warehouse.id} />
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
								addWarehouseModal.onOpen()
							}}
							className='w-full'
						>
							{t('addWarehouseButton')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
