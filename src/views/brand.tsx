import { XStack, YStack, Text } from '@hanzo/gui'

/**
 * The Trailmap wordmark — a three-stripe tile (mint / sky / lilac, the horizon
 * lanes in miniature) beside the name. Used in the app header and the landing.
 */
export function Wordmark({ onPress }: { onPress?: () => void }) {
  return (
    <XStack alignItems="center" gap="$2.5" cursor={onPress ? 'pointer' : 'default'} onPress={onPress}>
      <XStack width={30} height={30} borderRadius="$3" overflow="hidden">
        <YStack flex={1} backgroundColor="#22B588" />
        <YStack flex={1} backgroundColor="#4C8DF6" />
        <YStack flex={1} backgroundColor="#9A6BF2" />
      </XStack>
      <Text fontSize="$7" fontWeight="800" color="#131F38" letterSpacing={-0.4}>
        Trailmap
      </Text>
    </XStack>
  )
}
