'use client'

import { ColumnDef } from '@tanstack/react-table'

import { TableHeader } from '@/components/shared'

export type StockColumn = {
	id: string
	name: string
	stockThreshold: string
	stock: string
}

export const StockColumns: ColumnDef<StockColumn>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='normal'
					name='productName'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
	},

	{
		accessorKey: 'stock',
		header: () => {
			return <TableHeader variant='normal' name='productStock' />
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stock}</div>,
	},

	{
		accessorKey: 'stockThreshold',
		header: () => {
			return <TableHeader variant='normal' name='productStockThreshold' />
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stockThreshold}</div>,
	},
]
