'use client'

import { ColumnDef } from '@tanstack/react-table'

import { TableHeader } from '@/components/shared'
import { TableCellAction } from './table-cell-action'
import { TableCellProductImage } from './table-cell-product-image'

export type ProductColumn = {
	id: string
	imageId: string
	image: string
	name: string
	description: string
	stockThreshold: string
	stock: string
}

export const ProductColumns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'image',
		header: () => {
			return <TableHeader variant='normal' name='productImage' />
		},
		cell: ({ row }) => {
			return <TableCellProductImage image={row.original.image} name={row.original.name} />
		},
	},

	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productName'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		enableHiding: false,
	},

	{
		accessorKey: 'description',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productDescription'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
	},

	{
		accessorKey: 'stock',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='productStock'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stock}</div>,
	},

	{
		accessorKey: 'stock_threshold',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='productStockThreshold'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stockThreshold}</div>,
	},

	{
		id: 'actions',
		cell: ({ row }) => <TableCellAction data={row.original} />,
	},
]

export const ProductColumnsWithoutAction: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'image',
		header: () => {
			return <TableHeader variant='normal' name='productImage' />
		},
		cell: ({ row }) => {
			return <TableCellProductImage image={row.original.image} name={row.original.name} />
		},
	},

	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productName'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		enableHiding: false,
	},

	{
		accessorKey: 'description',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productDescription'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
	},

	{
		accessorKey: 'stock',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='productStock'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stock}</div>,
	},

	{
		accessorKey: 'stock_threshold',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='productStockThreshold'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <div className='flex items-center justify-center'>{row.original.stockThreshold}</div>,
	},
]
