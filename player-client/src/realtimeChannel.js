import { supabase } from './supabaseClient.js'

// Identical listening pattern to the host app — see host-client's
// realtimeChannel.js for the full explanation of why clients only ever
// listen here and never call channel.send() themselves.
export function joinSessionChannel(sessionId, { presenceKey, presencePayload, onChange, onPresenceSync }) {
  const channel = supabase.channel(`session:${sessionId}`, {
    config: { presence: { key: presenceKey } },
  })

  channel.on('broadcast', { event: 'INSERT' }, (msg) => onChange?.(msg.payload))
  channel.on('broadcast', { event: 'UPDATE' }, (msg) => onChange?.(msg.payload))

  channel.on('presence', { event: 'sync' }, () => {
    onPresenceSync?.(channel.presenceState())
  })

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED' && presencePayload) {
      await channel.track(presencePayload)
    }
  })

  return channel
}
