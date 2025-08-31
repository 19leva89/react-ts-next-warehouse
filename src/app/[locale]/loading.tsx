import { Loader2Icon } from 'lucide-react'

const Loading = () => {
	return (
		<div className='z-50 h-screen w-screen bg-white'>
			<div className='flex h-full flex-col items-center justify-center'>
				<Loader2Icon className='animate-spin text-5xl text-gray-500' />
			</div>
		</div>
	)
}

export default Loading
