import { XStack, YStack, Circle, Text, Paragraph } from '@hanzo/gui'
import { step, type Status } from '../lib/model'

/**
 * One initiative, as it appears in a lane: a theme colour-bar down the left
 * edge, the title + a two-line goal, and a status progress-dot in the footer.
 * Presentational only — the board feeds it live rows, the landing feeds it
 * sample rows, so both read identically. `onPress` makes it a link to detail.
 */
export function InitiativeCard({
  title,
  summary,
  status,
  barColor,
  onPress,
}: {
  title: string
  summary?: string
  status: Status
  barColor: string
  onPress?: () => void
}) {
  const s = step(status)
  const clickable = Boolean(onPress)
  return (
    <XStack
      backgroundColor="#FFFFFF"
      borderRadius="$6"
      borderWidth={1}
      borderColor="#EAEEF4"
      overflow="hidden"
      shadowColor="#0B1B3A"
      shadowOpacity={0.05}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 5 }}
      cursor={clickable ? 'pointer' : 'default'}
      hoverStyle={clickable ? { borderColor: '#CFD8E6', backgroundColor: '#FDFEFF' } : {}}
      pressStyle={clickable ? { backgroundColor: '#F6F8FC' } : {}}
      onPress={onPress}
    >
      <YStack width={5} alignSelf="stretch" backgroundColor={barColor} />
      <YStack flex={1} paddingHorizontal="$4" paddingVertical="$3.5" gap="$2">
        <Text fontSize="$5" fontWeight="700" color="#131F38" lineHeight="$4">
          {title}
        </Text>
        {summary ? (
          <Paragraph fontSize="$3" color="#66718A" numberOfLines={2} lineHeight="$2">
            {summary}
          </Paragraph>
        ) : null}
        <XStack alignItems="center" gap="$2" marginTop="$1">
          <Circle size={9} backgroundColor={s.dot} />
          <Text fontSize="$2" fontWeight="600" color="#8A94A6" letterSpacing={0.3}>
            {s.label}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  )
}
