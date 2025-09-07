'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Props {
	data: { name: string; total: number }[]
}

export const Overview = ({ data }: Props) => {
	return (
		<ResponsiveContainer width='100%' height={350}>
			<BarChart data={data}>
				<XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />

				<YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />

				<Bar dataKey='total' fill='#3498db' radius={[4, 4, 0, 0]} />

				<Tooltip
					cursor={{
						fill: 'transparent',
						stroke: '#3498db',
						strokeWidth: 2,
					}}
				/>
			</BarChart>
		</ResponsiveContainer>
	)
}
