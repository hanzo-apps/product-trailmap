import type { ReactNode } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner } from '@hanzo/gui'
import { Callback } from './auth/callback'
import { SignedOut } from './views/signed-out'
import { Roadmap } from './views/roadmap'

function Center({ children }: { children: ReactNode }) {
  return (
    <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" backgroundColor="#F4F7FC">
      {children}
    </YStack>
  )
}

/**
 * Top-level route + auth gate — no router dependency (one static SPA):
 *   /auth/callback  → finish the PKCE exchange, then land on the roadmap
 *   signed out      → the public landing + sample roadmap
 *   signed in       → the roadmap board (Now / Next / Later, Base-backed)
 */
export function App() {
  const { isAuthenticated, isLoading } = useIam()

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <Callback />
  }
  if (isLoading) {
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  }
  return isAuthenticated ? <Roadmap /> : <SignedOut />
}
