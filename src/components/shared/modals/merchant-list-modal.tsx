'use client'

import { Fragment } from 'react'
import { Edit2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Modal } from '@/components/shared/modals'
import { DeleteMerchantButton } from '@/components/shared'
import { Button, ScrollArea, Separator } from '@/components/ui'
import { useMerchantList } from '@/hooks/use-merchant-list-modal'
import { useAddMerchantModal } from '@/hooks/use-add-merchant-modal'

export const MerchantListModal = () => {
	const t = useTranslations('Merchant')
	const merchantListWarehouse = useMerchantList()
	const addMerchantModal = useAddMerchantModal()

	return (
		<Modal
			title={t('merchantListTitle')}
			description={t('merchantListDescription')}
			isOpen={merchantListWarehouse.isOpen}
			onClose={() => {
				merchantListWarehouse.onClose()
			}}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<div className='space-y-2'>
						<ScrollArea className='h-125'>
							<div className='flex flex-col gap-2'>
								<Separator />

								{merchantListWarehouse.merchantList!.map((merchant) => (
									<Fragment key={merchant.id}>
										<div className='flex items-center justify-between'>
											<div>{merchant.name}</div>

											<div className='flex'>
												<Button
													variant='ghost'
													onClick={() => {
														addMerchantModal.setIsEditing(true)
														addMerchantModal.setMerchantData(merchant)
														addMerchantModal.onOpen()
													}}
												>
													<Edit2Icon className='size-4' />
												</Button>

												<DeleteMerchantButton merchantId={merchant.id} />
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
								addMerchantModal.onOpen()
							}}
							className='w-full'
						>
							{t('addMerchantButton')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
