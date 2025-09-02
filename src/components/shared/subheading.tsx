import { LucideIcon } from 'lucide-react'

interface Props {
	icon: LucideIcon
	title: string
	description: string
}

export const Subheading = ({ icon: Icon, title, description }: Props) => {
	return (
		<div className='flex items-center gap-4'>
			<div>
				<Icon className='size-8' />
			</div>

			<div className='flex flex-col'>
				<h2 className='text-xl font-bold tracking-tight'>{title}</h2>

				<p className='text-muted-foreground text-sm'>{description}</p>
			</div>
		</div>
	)
}
