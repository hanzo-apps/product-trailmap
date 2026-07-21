import { useIam } from '@hanzo/iam/react'
import { XStack, YStack, Circle, H1, Text, Paragraph, Button } from '@hanzo/gui'
import { LANES, themeColor, type Horizon, type Status } from '../lib/model'
import { Wordmark } from './brand'
import { InitiativeCard } from './card'

interface Sample {
  title: string
  summary: string
  status: Status
  theme: string
}

/**
 * The public preview — a sample roadmap so visitors see the shape of the board
 * before signing in. Illustrative content, not a live product; the real board
 * loads from Base once you sign in.
 */
const PREVIEW: Record<Horizon, Sample[]> = {
  now: [
    { title: 'Realtime collaboration', summary: 'See teammates’ cursors and edits live across every board.', status: 'building', theme: 'Platform' },
    { title: 'Command palette', summary: 'Jump anywhere and move initiatives with the keyboard.', status: 'building', theme: 'Delight' },
    { title: 'Audit log export', summary: 'Download a signed history of every roadmap change.', status: 'planned', theme: 'Trust' },
  ],
  next: [
    { title: 'Mobile offline mode', summary: 'Read and reorder the roadmap with no connection.', status: 'planned', theme: 'Platform' },
    { title: 'Saved views & filters', summary: 'Slice by theme, owner, or status and pin the result.', status: 'planned', theme: 'Growth' },
  ],
  later: [
    { title: 'Public API v1', summary: 'Read the roadmap programmatically from anywhere.', status: 'planned', theme: 'Platform' },
    { title: 'Custom roadmap themes', summary: 'Bring your own palette and lane names.', status: 'planned', theme: 'Delight' },
  ],
}

export function SignedOut() {
  const { login, isLoading } = useIam()

  return (
    <YStack minHeight="100vh" backgroundColor="#F4F7FC">
      {/* Top nav */}
      <XStack alignItems="center" justifyContent="space-between" width="100%" maxWidth={1160} alignSelf="center" paddingHorizontal="$5" paddingVertical="$4">
        <Wordmark />
        <Button size="$3" chromeless disabled={isLoading} onPress={() => login()}>
          <Text fontSize="$3" fontWeight="600" color="#334155">Sign in</Text>
        </Button>
      </XStack>

      <YStack width="100%" maxWidth={1160} alignSelf="center" paddingHorizontal="$5" paddingBottom="$9" gap="$9">
        {/* Hero */}
        <YStack alignItems="center" gap="$5" paddingTop="$8">
          <XStack alignItems="center" gap="$2" backgroundColor="#FFFFFF" borderRadius="$10" paddingHorizontal="$3.5" paddingVertical="$2" borderWidth={1} borderColor="#E6EBF3">
            <Circle size={8} backgroundColor="#22B588" />
            <Text fontSize="$1" fontWeight="800" color="#475569" letterSpacing={1}>PUBLIC PRODUCT ROADMAP</Text>
          </XStack>
          <H1 textAlign="center" fontSize={58} lineHeight={62} fontWeight="900" color="#0F1B31" letterSpacing={-1.6} maxWidth={760}>
            Show where you&rsquo;re headed.
          </H1>
          <Paragraph textAlign="center" fontSize="$6" lineHeight="$7" color="#5A6579" maxWidth={620}>
            A living roadmap organised as Now, Next, and Later. Place each initiative on a horizon, tag it
            with a theme, and let everyone follow what&rsquo;s in progress and what&rsquo;s coming.
          </Paragraph>
          <YStack alignItems="center" gap="$3" paddingTop="$2">
            <Button
              size="$5"
              backgroundColor="#22B588"
              borderRadius="$7"
              paddingHorizontal="$6"
              hoverStyle={{ backgroundColor: '#1BA97C' }}
              disabled={isLoading}
              onPress={() => login()}
            >
              <Text fontSize="$5" fontWeight="800" color="#FFFFFF">
                {isLoading ? 'Loading…' : 'Sign in with Hanzo'}
              </Text>
            </Button>
            <Text fontSize="$2" color="#8A94A6">Now · Next · Later — updated as we build.</Text>
          </YStack>
        </YStack>

        {/* Swimlane preview */}
        <XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
          {LANES.map((l) => {
            const items = PREVIEW[l.key]
            return (
              <YStack key={l.key} flex={1} minWidth={300} gap="$3">
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={l.tint} borderWidth={1} borderColor={l.edge} borderRadius="$7" paddingHorizontal="$4" paddingVertical="$3.5">
                  <YStack gap="$0.5">
                    <Text fontSize="$7" fontWeight="800" color={l.ink} letterSpacing={-0.2}>{l.label}</Text>
                    <Text fontSize="$2" color={l.ink} opacity={0.75}>{l.blurb}</Text>
                  </YStack>
                  <YStack width={30} height={30} borderRadius="$10" alignItems="center" justifyContent="center" backgroundColor="#FFFFFF">
                    <Text fontSize="$3" fontWeight="800" color={l.ink}>{items.length}</Text>
                  </YStack>
                </XStack>
                {items.map((it) => (
                  <InitiativeCard
                    key={it.title}
                    title={it.title}
                    summary={it.summary}
                    status={it.status}
                    barColor={themeColor(it.theme)}
                  />
                ))}
              </YStack>
            )
          })}
        </XStack>

        <Text alignSelf="center" fontSize="$2" color="#98A2B3" paddingTop="$2">
          Built on Hanzo — @hanzo/gui · Hanzo IAM · Hanzo Base
        </Text>
      </YStack>
    </YStack>
  )
}
