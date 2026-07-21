import { useMemo, useState, type ReactNode } from 'react'
import { useMutation } from '@hanzo/base/react'
import { XStack, YStack, Circle, H2, Text, Paragraph, Button, Input, TextArea } from '@hanzo/gui'
import {
  HORIZONS,
  STEPS,
  lane,
  themeChoices,
  type Horizon,
  type Initiative,
  type Status,
  type Theme,
} from '../lib/model'

/** A pill segmented-control — the one picker pattern the editor uses. */
function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { key: T; label: string; color: string }[]
  onChange: (v: T) => void
}) {
  return (
    <XStack backgroundColor="#EEF2F8" borderRadius="$6" padding={4} gap={4} alignSelf="flex-start" flexWrap="wrap">
      {options.map((o) => {
        const on = o.key === value
        return (
          <Button
            key={o.key}
            size="$3"
            borderRadius="$5"
            backgroundColor={on ? '#FFFFFF' : 'transparent'}
            shadowColor="#0B1B3A"
            shadowOpacity={on ? 0.08 : 0}
            shadowRadius={6}
            shadowOffset={{ width: 0, height: 2 }}
            hoverStyle={{ backgroundColor: on ? '#FFFFFF' : '#E4EAF3' }}
            onPress={() => onChange(o.key)}
          >
            <Text fontSize="$3" fontWeight={on ? '700' : '500'} color={on ? o.color : '#6B7488'}>
              {o.label}
            </Text>
          </Button>
        )
      })}
    </XStack>
  )
}

/** A labelled form row. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <YStack gap="$2.5">
      <Text fontSize="$2" fontWeight="700" color="#8A94A6" letterSpacing={0.4} textTransform="uppercase">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

/**
 * Create or move an initiative — one form for both. The horizon control IS the
 * "move": switch Now / Next / Later and save. Writes go through the `initiatives`
 * mutations; the board refetches on save (onSaved).
 */
export function Editor({
  initiative,
  initialHorizon,
  themes,
  onSaved,
  onCancel,
}: {
  initiative?: Initiative
  initialHorizon?: Horizon
  themes: Theme[]
  onSaved: () => void | Promise<void>
  onCancel: () => void
}) {
  const choices = useMemo(() => themeChoices(themes), [themes])
  const [title, setTitle] = useState(initiative?.title ?? '')
  const [summary, setSummary] = useState(initiative?.summary ?? '')
  const [horizon, setHorizon] = useState<Horizon>(initiative?.horizon ?? initialHorizon ?? 'now')
  const [status, setStatus] = useState<Status>(initiative?.status ?? 'planned')
  const [theme, setTheme] = useState(initiative?.theme || choices[0]?.name || '')

  const create = useMutation('initiatives', 'create')
  const update = useMutation('initiatives', 'update')
  const remove = useMutation('initiatives', 'delete')
  const busy = create.isLoading || update.isLoading || remove.isLoading
  const err = create.error || update.error || remove.error

  async function save() {
    const t = title.trim()
    if (!t || busy) return
    const data = { title: t, summary: summary.trim(), horizon, status, theme }
    if (initiative) await update.mutate({ id: initiative.id, ...data })
    else await create.mutate(data)
    await onSaved()
  }

  async function del() {
    if (!initiative || busy) return
    await remove.mutate({ id: initiative.id })
    await onSaved()
  }

  return (
    <YStack gap="$5" maxWidth={720} width="100%" alignSelf="center">
      <Button alignSelf="flex-start" size="$2" chromeless onPress={onCancel}>
        <Text fontSize="$3" color="#66718A">← Roadmap</Text>
      </Button>

      <YStack gap="$1.5">
        <H2 fontSize="$9" fontWeight="800" color="#131F38" letterSpacing={-0.4}>
          {initiative ? 'Edit initiative' : 'New initiative'}
        </H2>
        <Paragraph fontSize="$4" color="#66718A">
          Give it a title and a goal, place it on a horizon, and tag it with a theme.
        </Paragraph>
      </YStack>

      <YStack
        backgroundColor="#FFFFFF"
        borderRadius="$8"
        borderWidth={1}
        borderColor="#EAEEF4"
        paddingHorizontal="$5"
        paddingVertical="$5"
        gap="$5"
        shadowColor="#0B1B3A"
        shadowOpacity={0.05}
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 8 }}
      >
        <Field label="Title">
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Realtime collaboration"
            size="$4"
            borderColor="#E2E8F0"
            backgroundColor="#FBFCFE"
            onSubmitEditing={save}
          />
        </Field>

        <Field label="Goal & notes">
          <TextArea
            value={summary}
            onChangeText={setSummary}
            placeholder="What are we trying to achieve? Anything visitors following along should know."
            numberOfLines={4}
            size="$4"
            borderColor="#E2E8F0"
            backgroundColor="#FBFCFE"
          />
        </Field>

        <Field label="Horizon">
          <Segment<Horizon>
            value={horizon}
            onChange={setHorizon}
            options={HORIZONS.map((h) => ({ key: h, label: lane(h).label, color: lane(h).ink }))}
          />
        </Field>

        <Field label="Status">
          <Segment<Status>
            value={status}
            onChange={setStatus}
            options={STEPS.map((s) => ({ key: s.key, label: s.label, color: s.dot }))}
          />
        </Field>

        <Field label="Theme">
          <XStack gap="$2" flexWrap="wrap">
            {choices.map((c) => {
              const on = c.name === theme
              return (
                <XStack
                  key={c.name}
                  alignItems="center"
                  gap="$2"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$10"
                  borderWidth={on ? 2 : 1}
                  borderColor={on ? c.color : '#E2E8F0'}
                  backgroundColor={on ? '#FFFFFF' : '#F8FAFC'}
                  cursor="pointer"
                  hoverStyle={{ borderColor: c.color }}
                  onPress={() => setTheme(c.name)}
                >
                  <Circle size={10} backgroundColor={c.color} />
                  <Text fontSize="$3" fontWeight={on ? '700' : '500'} color="#334155">
                    {c.name}
                  </Text>
                </XStack>
              )
            })}
          </XStack>
        </Field>

        {err ? <Paragraph color="#DC5B6B">{err.message}</Paragraph> : null}
      </YStack>

      <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$3">
        {initiative ? (
          <Button chromeless disabled={busy} onPress={del}>
            <Text fontSize="$3" fontWeight="600" color="#DC5B6B">Delete</Text>
          </Button>
        ) : (
          <YStack />
        )}
        <XStack gap="$2">
          <Button chromeless disabled={busy} onPress={onCancel}>
            <Text fontSize="$3" color="#66718A">Cancel</Text>
          </Button>
          <Button
            backgroundColor="#22B588"
            borderRadius="$5"
            hoverStyle={{ backgroundColor: '#1BA97C' }}
            disabled={!title.trim() || busy}
            onPress={save}
          >
            <Text fontSize="$4" fontWeight="700" color="#FFFFFF">
              {initiative ? 'Save changes' : 'Create initiative'}
            </Text>
          </Button>
        </XStack>
      </XStack>
    </YStack>
  )
}
