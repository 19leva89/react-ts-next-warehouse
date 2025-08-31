import { Loader2Icon } from 'lucide-react'

export const LoadingIndicator = () => {
	return (
		<div className='flex items-center justify-center p-16'>
			<Loader2Icon className='mx-auto size-8 animate-spin' />
		</div>
	)
}
