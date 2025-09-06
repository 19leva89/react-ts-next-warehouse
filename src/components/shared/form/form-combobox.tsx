'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui'
import { cn } from '@/lib'
import { ErrorText, RequiredSymbol } from '@/components/shared'

interface Props<T = Record<string, any>> {
	name: string
	label?: string
	placeholder: string
	required?: boolean
	noResultsText: string
	selectPlaceholder: string
	valueKey: keyof T
	labelKey: keyof T
	mapTable?: T[]
	disabled?: boolean
	className?: string
	onSelect?: (item: T) => void
}

export function FormCombobox<T = Record<string, any>>({
	name,
	label,
	placeholder,
	required,
	noResultsText,
	selectPlaceholder,
	valueKey,
	labelKey,
	mapTable = [],
	disabled = false,
	className,
	onSelect,
}: Props<T>) {
	const {
		formState: { errors },
		watch,
		setValue,
		trigger,
	} = useFormContext()
	const [open, setOpen] = useState<boolean>(false)

	const value = watch(name)
	const errorText = errors[name]?.message as string

	const selectedItem = mapTable.find((item) => item[valueKey] === value)

	const handleSelect = async (currentValue: string) => {
		const selectedItem = mapTable.find((item) => item[valueKey] === currentValue)

		if (selectedItem) {
			setValue(name, selectedItem[valueKey], { shouldValidate: true })

			await trigger(name)

			if (onSelect) {
				onSelect(selectedItem)
			}
		}

		setOpen(false)
	}

	return (
		<div>
			{label && (
				<p className='mb-2 font-medium'>
					{label} {required && <RequiredSymbol />}
				</p>
			)}

			<Popover open={open} onOpenChange={setOpen}>
				<div>
					<PopoverTrigger asChild>
						<Button
							type='button'
							variant='outline'
							role='combobox'
							aria-expanded={open}
							disabled={disabled}
							className={cn(
								'w-full justify-between border-[#e5e7eb] text-left font-normal hover:bg-transparent',
								!selectedItem && 'text-muted-foreground',
								errorText && 'border-red-500',
								className,
							)}
						>
							{selectedItem ? String(selectedItem[labelKey]) : placeholder}
							<ChevronsUpDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
						</Button>
					</PopoverTrigger>

					{errorText && <ErrorText text={errorText} className='mt-2 ml-4' />}
				</div>

				<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
					<Command>
						<CommandInput placeholder={selectPlaceholder} />

						<CommandList>
							<CommandEmpty>{noResultsText}</CommandEmpty>

							<CommandGroup>
								{mapTable.map((item) => (
									<CommandItem
										key={String(item[valueKey])}
										value={String(item[labelKey])}
										onSelect={() => handleSelect(String(item[valueKey]))}
									>
										<CheckIcon
											className={cn('mr-2 size-4', value === item[valueKey] ? 'opacity-100' : 'opacity-0')}
										/>

										{String(item[labelKey])}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
