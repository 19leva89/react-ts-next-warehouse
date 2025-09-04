'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	Input,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui'

interface Props<TData, TValue> {
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	searchKey: string
	placeholder: string
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	placeholder = 'Search',
}: Props<TData, TValue>) {
	const t = useTranslations('TableData')

	const [sorting, setSorting] = useState<SortingState>([])
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
	})

	const searchQuery = (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''

	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='flex w-full gap-4'>
				{/* Search */}
				<div className='relative w-full'>
					<SearchIcon
						size={18}
						className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400'
					/>

					<Input
						placeholder={placeholder}
						value={searchQuery}
						onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
						className='px-10'
					/>

					<Button
						variant='ghost'
						size='icon'
						onClick={() => table.getColumn(searchKey)?.setFilterValue('')}
						className={cn(
							'absolute top-1/2 right-1 -translate-y-1/2 hover:bg-transparent hover:text-gray-400',
							searchQuery ? 'opacity-100' : 'pointer-events-none opacity-0',
						)}
					>
						<XIcon size={16} />
					</Button>
				</div>

				{/* Visibility columns */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild className='bg-transparent'>
						<Button variant='outline' className='group ml-auto transition-colors duration-300 ease-in-out'>
							<span>{t('columns')}</span>

							<div className='relative size-5 transition-transform duration-300 group-hover:rotate-180'>
								<ChevronDownIcon size={16} className='absolute inset-0 m-auto' />
							</div>
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								const readableName = column.id.replace(/_/g, ' ') // Replace '_' with ' '

								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{readableName}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className='w-full rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									{t('noResults')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className='w-full'>
				<div className='flex items-center justify-end space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{t('previousButton')}
					</Button>

					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{t('nextButton')}
					</Button>
				</div>
			</div>
		</div>
	)
}
