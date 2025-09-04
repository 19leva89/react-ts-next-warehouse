'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'
import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'
import { TableHeader } from '@/components/shared'

export type SalesColumn = {
	id: string
	customer: {
		id: string
		name: string
	}
	product: {
		id: string
		name: string
	}
	addedBy: string
	saleDate: Date
	quantity: string
}

export const SalesColumns: ColumnDef<SalesColumn>[] = [
	{
		accessorKey: 'saleDate',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='saleDate'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => (
			<span>
				{format(row.original.saleDate, 'PPP', {
					locale: id,
				})}
			</span>
		),
	},

	{
		accessorKey: 'addedBy',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='addedBy'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => (
			<span>{row.original.addedBy === 'Deleted User' ? 'Deleted User' : row.original.addedBy}</span>
		),
	},

	{
		accessorKey: 'product',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productName'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <span>{row.original.product?.name ?? ''}</span>,
	},

	{
		accessorKey: 'customer',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='customer'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <span>{row.original.customer?.name ?? ''}</span>,
	},

	{
		accessorKey: 'quantity',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='quantity'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]

export const SalesColumnsWithoutAction: ColumnDef<SalesColumn>[] = [
	{
		accessorKey: 'saleDate',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='saleDate'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => (
			<span>
				{format(row.original.saleDate, 'PPP', {
					locale: id,
				})}
			</span>
		),
	},

	{
		accessorKey: 'addedBy',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='addedBy'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => (
			<span>{row.original.addedBy === 'Deleted User' ? 'Deleted User' : row.original.addedBy}</span>
		),
	},

	{
		accessorKey: 'product',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='productName'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <span>{row.original.product?.name ?? ''}</span>,
	},

	{
		accessorKey: 'customer',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable'
					name='customer'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
		cell: ({ row }) => <span>{row.original.customer?.name ?? ''}</span>,
	},

	{
		accessorKey: 'quantity',
		header: ({ column }) => {
			return (
				<TableHeader
					variant='sortable-center'
					name='quantity'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				/>
			)
		},
	},
]
