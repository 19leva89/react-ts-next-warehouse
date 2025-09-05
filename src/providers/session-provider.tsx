import { PropsWithChildren } from 'react'
import { SessionProvider as Session } from 'next-auth/react'

export const SessionProvider = ({ children }: PropsWithChildren) => {
	return <Session>{children}</Session>
}
