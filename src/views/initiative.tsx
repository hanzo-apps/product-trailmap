import { XStack, YStack, Circle, H2, Text, Paragraph, Button } from '@hanzo/gui'
import { lane, step, themeColor, type Initiative, type Theme } from '../lib/model'

/** A labelled fact in the meta panel. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingVertical="$2.5" borderBottomWidth={1} borderColor="#EEF2F8">
      <Text fontSize="$3" color="#8A94A6">{label}</Text>
      <XStack alignItems="center" gap="$2">{children}</XStack>
    </XStack>
  )
}

/**
 * Initiative detail — the goal (its summary + notes), where it sits on the
 * roadmap, and its status, with an Edit action that opens the same editor the
 * board uses. Read-only: every write goes through the editor (one way).
 */
export function Detail({
  record,
  themes,
  onBack,
  onEdit,
}: {
  record: Initiative | undefined
  themes: Theme[]
  onBack: () => void
  onEdit: () => void
}) {
  if (!record) {
    return (
      <YStack gap="$4" paddingVertical="$6" alignItems="flex-start">
        <Paragraph color="#66718A">That initiative is no longer on the roadmap.</Paragraph>
        <Button onPress={onBack}>Back to roadmap</Button>
      </YStack>
    )
  }

  const l = lane(record.horizon)
  const s = step(record.status)
  const color = themeColor(record.theme, themes)
  const updated = record.updated ? new Date(record.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null

  return (
    <YStack gap="$5" maxWidth={760} width="100%" alignSelf="center">
      <Button alignSelf="flex-start" size="$2" chromeless onPress={onBack}>
        <Text fontSize="$3" color="#66718A">← Roadmap</Text>
      </Button>

      {/* Hero, tinted by the lane it lives in */}
      <YStack borderRadius="$8" overflow="hidden" borderWidth={1} borderColor={l.edge}>
        <YStack backgroundColor={l.tint} paddingHorizontal="$5" paddingTop="$5" paddingBottom="$5" gap="$3">
          <XStack alignItems="center" gap="$2" flexWrap="wrap">
            <XStack alignItems="center" gap="$2" backgroundColor="#FFFFFF" borderRadius="$10" paddingHorizontal="$3" paddingVertical="$1.5">
              <Circle size={8} backgroundColor={l.accent} />
              <Text fontSize="$2" fontWeight="700" color={l.ink}>{l.label}</Text>
            </XStack>
            <XStack alignItems="center" gap="$2" backgroundColor="#FFFFFF" borderRadius="$10" paddingHorizontal="$3" paddingVertical="$1.5">
              <Circle size={8} backgroundColor={color} />
              <Text fontSize="$2" fontWeight="600" color="#334155">{record.theme || 'Untagged'}</Text>
            </XStack>
          </XStack>
          <H2 fontSize="$10" fontWeight="800" color="#131F38" letterSpacing={-0.5}>{record.title}</H2>
          <XStack alignItems="center" gap="$2.5">
            <Circle size={11} backgroundColor={s.dot} />
            <Text fontSize="$4" fontWeight="700" color="#334155">{s.label}</Text>
          </XStack>
          {/* progress track */}
          <YStack height={8} borderRadius="$10" backgroundColor="#FFFFFF" overflow="hidden" opacity={0.9}>
            <YStack height={8} width={`${Math.round(s.fill * 100)}%`} backgroundColor={s.dot} borderRadius="$10" />
          </YStack>
        </YStack>

        {/* Goal + notes */}
        <YStack backgroundColor="#FFFFFF" paddingHorizontal="$5" paddingVertical="$5" gap="$3">
          <Text fontSize="$2" fontWeight="700" color="#8A94A6" letterSpacing={0.4} textTransform="uppercase">Goal &amp; notes</Text>
          {record.summary ? (
            <Paragraph fontSize="$5" lineHeight="$6" color="#3A465C">{record.summary}</Paragraph>
          ) : (
            <Paragraph fontSize="$4" color="#9AA3B2">No goal written yet — open the editor to describe where this is headed.</Paragraph>
          )}
        </YStack>
      </YStack>

      {/* Meta */}
      <YStack backgroundColor="#FFFFFF" borderRadius="$8" borderWidth={1} borderColor="#EAEEF4" paddingHorizontal="$5" paddingVertical="$2">
        <Fact label="Horizon"><Text fontSize="$3" fontWeight="600" color={l.ink}>{l.label} · {l.blurb}</Text></Fact>
        <Fact label="Status"><Circle size={9} backgroundColor={s.dot} /><Text fontSize="$3" fontWeight="600" color="#334155">{s.label}</Text></Fact>
        <Fact label="Theme"><Circle size={9} backgroundColor={color} /><Text fontSize="$3" fontWeight="600" color="#334155">{record.theme || 'Untagged'}</Text></Fact>
        {updated ? <Fact label="Updated"><Text fontSize="$3" color="#66718A">{updated}</Text></Fact> : null}
      </YStack>

      <XStack>
        <Button backgroundColor="#131F38" borderRadius="$5" hoverStyle={{ backgroundColor: '#26324B' }} onPress={onEdit}>
          <Text fontSize="$4" fontWeight="700" color="#FFFFFF">Edit initiative</Text>
        </Button>
      </XStack>
    </YStack>
  )
}
