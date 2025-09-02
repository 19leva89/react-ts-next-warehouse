'use client'

import { useTranslations } from 'next-intl'
import { Store, User } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { ComponentPropsWithoutRef, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon, SettingsIcon, StoreIcon } from 'lucide-react'

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
import { useStoreList } from '@/hooks/use-store-list-modal'
import { useAddStoreModal } from '@/hooks/use-add-store-modal'

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface Props extends PopoverTriggerProps {
	items: Store[]
	user: User
}

export const StoreSwitcher = ({ items, user, className }: Props) => {
	const params = useParams()
	const router = useRouter()
	const storeList = useStoreList()
	const t = useTranslations('Store')
	const storeModal = useAddStoreModal()

	const formattedItems = items.map((item) => ({
		label: item.name,
		value: item.id,
	}))

	const currentStore = formattedItems.find((item) => item.value === params.storeId)

	const [open, setOpen] = useState<boolean>(false)

	const onStoreSelect = (store: { value: string; label: string }) => {
		setOpen(false)
		router.push(`/${store.value}`)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					role='combobox'
					aria-expanded={open}
					aria-label='Select a store'
					className={cn('min-w-50 justify-between', className)}
				>
					<StoreIcon className='mr-2 size-4' />

					{currentStore?.label}

					<ChevronsUpDownIcon className='ml-auto size-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='min-w-50 p-0'>
				<Command>
					<CommandList>
						<CommandInput placeholder={t('searchPlaceholder')} />

						<CommandEmpty>{t('notFound')}</CommandEmpty>

						<CommandGroup heading={t('storeListTitle')}>
							{formattedItems.map((store) => (
								<CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className='text-sm'>
									<StoreIcon className='mr-2 size-4' />

									{store.label}

									<CheckIcon
										className={cn(
											'ml-auto size-4',
											currentStore?.value === store.value ? 'opacity-100' : 'opacity-0',
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
											storeList.onOpen()
										}}
									>
										<SettingsIcon className='mr-2 size-5' />
										{t('manageStoreButton')}
									</CommandItem>

									<CommandItem
										onSelect={() => {
											setOpen(false)
											storeModal.onOpen()
										}}
									>
										<PlusCircleIcon className='mr-2 size-5' />
										{t('addStoreButton')}
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
