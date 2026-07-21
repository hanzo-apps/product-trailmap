import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery } from '@hanzo/base/react'
import { XStack, YStack, H2, Text, Paragraph, Button, Spinner } from '@hanzo/gui'
import { LANES, themeColor, type Horizon, type Initiative, type Theme } from '../lib/model'
import { Wordmark } from './brand'
import { InitiativeCard } from './card'
import { Detail } from './initiative'
import { Editor } from './editor'

type Screen =
  | { name: 'board' }
  | { name: 'detail'; id: string }
  | { name: 'editor'; id?: string; horizon?: Horizon }

export function Roadmap() {
  const { user, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'you'
  const initiatives = useQuery<Initiative>('initiatives', { sort: '-created', realtime: false })
  const themesQuery = useQuery<Theme>('themes', { realtime: false })
  const themes = themesQuery.data
  const [screen, setScreen] = useState<Screen>({ name: 'board' })

  const rows = initiatives.data
  const selected = screen.name !== 'board' && 'id' in screen && screen.id ? rows.find((r) => r.id === screen.id) : undefined
  const toBoard = () => setScreen({ name: 'board' })
  const afterSave = async () => {
    await initiatives.refetch()
    toBoard()
  }

  const header = (
    <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$5" paddingVertical="$3.5" backgroundColor="#FFFFFF" borderBottomWidth={1} borderColor="#EAEEF4">
      <Wordmark onPress={toBoard} />
      <XStack alignItems="center" gap="$3">
        <Text fontSize="$2" color="#8A94A6">{who}</Text>
        <Button size="$3" chromeless onPress={() => logout()}>
          <Text fontSize="$3" color="#66718A">Sign out</Text>
        </Button>
      </XStack>
    </XStack>
  )

  const body = (() => {
    if (screen.name === 'editor') {
      return (
        <Editor
          initiative={selected}
          initialHorizon={screen.horizon}
          themes={themes}
          onSaved={afterSave}
          onCancel={toBoard}
        />
      )
    }
    if (screen.name === 'detail') {
      return <Detail record={selected} themes={themes} onBack={toBoard} onEdit={() => selected && setScreen({ name: 'editor', id: selected.id })} />
    }
    return (
      <Board
        initiatives={initiatives.data}
        themes={themes}
        isLoading={initiatives.isLoading}
        error={initiatives.error}
        onOpen={(id) => setScreen({ name: 'detail', id })}
        onNew={(horizon) => setScreen({ name: 'editor', horizon })}
      />
    )
  })()

  return (
    <YStack minHeight="100vh" backgroundColor="#F5F8FC">
      {header}
      <YStack width="100%" maxWidth={1200} alignSelf="center" paddingHorizontal="$5" paddingVertical="$6" gap="$6">
        {body}
      </YStack>
    </YStack>
  )
}

/** The Now / Next / Later board. */
function Board({
  initiatives,
  themes,
  isLoading,
  error,
  onOpen,
  onNew,
}: {
  initiatives: Initiative[]
  themes: Theme[]
  isLoading: boolean
  error: Error | null
  onOpen: (id: string) => void
  onNew: (horizon?: Horizon) => void
}) {
  return (
    <YStack gap="$6">
      <XStack alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap="$4">
        <YStack gap="$2" maxWidth={660}>
          <H2 fontSize="$10" fontWeight="800" color="#131F38" letterSpacing={-0.6}>Where we&rsquo;re headed</H2>
          <Paragraph fontSize="$5" color="#66718A" lineHeight="$6">
            Everything the team is building, arranged by how soon it lands. Follow along — what&rsquo;s in
            progress now, and what&rsquo;s coming next.
          </Paragraph>
        </YStack>
        <Button
          size="$4"
          backgroundColor="#22B588"
          borderRadius="$6"
          hoverStyle={{ backgroundColor: '#1BA97C' }}
          onPress={() => onNew(undefined)}
        >
          <Text fontSize="$4" fontWeight="700" color="#FFFFFF">+ New initiative</Text>
        </Button>
      </XStack>

      {isLoading ? (
        <XStack alignItems="center" gap="$3" opacity={0.6} paddingVertical="$6">
          <Spinner /> <Text color="#66718A">Loading the roadmap…</Text>
        </XStack>
      ) : error ? (
        <YStack backgroundColor="#FFF5F5" borderRadius="$6" borderWidth={1} borderColor="#F5D6D6" padding="$5" gap="$1.5">
          <Text fontWeight="700" color="#B4404E">Couldn&rsquo;t reach Base</Text>
          <Paragraph color="#9A5560">{error.message}. Confirm VITE_HANZO_BASE_URL and that you&rsquo;re signed in.</Paragraph>
        </YStack>
      ) : (
        <XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
          {LANES.map((l) => {
            const laneRows = initiatives.filter((r) => r.horizon === l.key)
            return (
              <YStack key={l.key} flex={1} minWidth={300} gap="$3">
                {/* Lane header */}
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={l.tint} borderWidth={1} borderColor={l.edge} borderRadius="$7" paddingHorizontal="$4" paddingVertical="$3.5">
                  <YStack gap="$0.5">
                    <Text fontSize="$7" fontWeight="800" color={l.ink} letterSpacing={-0.2}>{l.label}</Text>
                    <Text fontSize="$2" color={l.ink} opacity={0.75}>{l.blurb}</Text>
                  </YStack>
                  <YStack width={30} height={30} borderRadius="$10" alignItems="center" justifyContent="center" backgroundColor="#FFFFFF">
                    <Text fontSize="$3" fontWeight="800" color={l.ink}>{laneRows.length}</Text>
                  </YStack>
                </XStack>

                {/* Cards */}
                {laneRows.length === 0 ? (
                  <YStack borderRadius="$6" borderWidth={1} borderColor="#E6EBF3" backgroundColor="#FBFCFE" paddingVertical="$5" paddingHorizontal="$4" alignItems="center" gap="$1">
                    <Text fontSize="$3" color="#9AA3B2">Nothing here yet</Text>
                  </YStack>
                ) : (
                  laneRows.map((r) => (
                    <InitiativeCard
                      key={r.id}
                      title={r.title}
                      summary={r.summary}
                      status={r.status}
                      barColor={themeColor(r.theme, themes)}
                      onPress={() => onOpen(r.id)}
                    />
                  ))
                )}

                {/* Add to this lane */}
                <Button
                  size="$3"
                  chromeless
                  alignSelf="flex-start"
                  hoverStyle={{ backgroundColor: l.tint }}
                  onPress={() => onNew(l.key)}
                >
                  <Text fontSize="$3" fontWeight="600" color={l.ink}>+ Add to {l.label}</Text>
                </Button>
              </YStack>
            )
          })}
        </XStack>
      )}
    </YStack>
  )
}
