'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Warehouse, User } from '@prisma/client'
import React, { ComponentPropsWithoutRef, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon, SettingsIcon, WarehouseIcon } from 'lucide-react'

import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui'
import { cn } from '@/lib'
import { useRouter } from '@/i18n/navigation'
import { useWarehouseList } from '@/hooks/use-warehouse-list-modal'
import { useAddWarehouseModal } from '@/hooks/use-add-warehouse-modal'

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface Props extends PopoverTriggerProps {
	items: Warehouse[]
	user: User
}

export const WarehouseSwitcher = ({ items, user, className }: Props) => {
	const params = useParams()
	const router = useRouter()
	const warehouseList = useWarehouseList()
	const t = useTranslations('Warehouse')
	const WarehouseModal = useAddWarehouseModal()

	const formattedItems = items.map((item) => ({
		label: item.name,
		value: item.id,
	}))

	const currentWarehouse = formattedItems.find((item) => item.value === params.warehouseId)

	const [open, setOpen] = useState<boolean>(false)

	const onWarehouseSelect = (warehouse: { value: string; label: string }) => {
		setOpen(false)
		router.push(`/${warehouse.value}`)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					role='combobox'
					aria-expanded={open}
					aria-label='Select a warehouse'
					className={cn('min-w-50 justify-between', className)}
				>
					<WarehouseIcon className='mr-2 size-4' />

					{currentWarehouse?.label}

					<ChevronsUpDownIcon className='ml-auto size-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='min-w-50 p-0'>
				<Command>
					<CommandList>
						<CommandInput placeholder={t('searchPlaceholder')} />

						<CommandEmpty>{t('notFound')}</CommandEmpty>

						<CommandGroup heading={t('warehouseListTitle')}>
							{formattedItems.map((warehouse) => (
								<CommandItem
									key={warehouse.value}
									onSelect={() => onWarehouseSelect(warehouse)}
									className='text-sm'
								>
									<WarehouseIcon className='mr-2 size-4' />

									{warehouse.label}

									<CheckIcon
										className={cn(
											'ml-auto size-4',
											currentWarehouse?.value === warehouse.value ? 'opacity-100' : 'opacity-0',
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					{user.role === 'ADMIN' && (
						<>
							<CommandSeparator />

							<CommandList>
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											setOpen(false)
											warehouseList.onOpen()
										}}
									>
										<SettingsIcon className='mr-2 size-5' />
										{t('manageWarehouseButton')}
									</CommandItem>

									<CommandItem
										onSelect={() => {
											setOpen(false)
											WarehouseModal.onOpen()
										}}
									>
										<PlusCircleIcon className='mr-2 size-5' />
										{t('addWarehouseButton')}
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	)
}
