import { ReactNode } from 'react'

interface Props {
	icon: ReactNode
	title: string
	description: string
}

export const Heading = ({ icon, title, description }: Props) => {
	return (
		<div className='flex items-center gap-4'>
			<div>{icon}</div>

			<div className='flex flex-col'>
				<h2 className='text-3xl font-bold tracking-tight'>{title}</h2>

				<p className='text-muted-foreground text-sm'>{description}</p>
			</div>
		</div>
	)
}
