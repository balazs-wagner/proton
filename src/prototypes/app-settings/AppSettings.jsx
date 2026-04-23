import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  Separator,
  Badge,
  HStack,
} from '@chakra-ui/react'
import { Switch } from '../../components/Switch'
import { Select } from '../../components/Select'
import { ProtoFrame, Frame, Annotate } from '../../framework'

const TABS = ['Profile', 'Notifications', 'Team', 'Danger zone']

/**
 * App Settings prototype — multi-section settings page.
 * Demonstrates: tabs, form fields, toggles, selects, inline
 * validation, toast-style save feedback, and a destructive action flow.
 */
export function AppSettings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [saved, setSaved] = useState(false)

  // Profile
  const [name, setName] = useState('Balázs')
  const [email, setEmail] = useState('balazs@example.com')
  const [bio, setBio] = useState('')
  const [timezone, setTimezone] = useState('Europe/Budapest')

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [notifSound, setNotifSound] = useState('default')

  // Team
  const [teamName, setTeamName] = useState('Design crew')
  const [visibility, setVisibility] = useState('private')
  const members = [
    { name: 'Balázs', role: 'Owner' },
    { name: 'Anna K.', role: 'Editor' },
    { name: 'Márk T.', role: 'Viewer' },
  ]
  const [inviteEmail, setInviteEmail] = useState('')

  // Danger
  const [confirmDelete, setConfirmDelete] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ProtoFrame title="App settings" note="v1 — multi-section with save feedback">
      <Flex justify="center" py={10} px={4}>
        <Box w="full" maxW="720px">
          {/* Tab bar */}
          <HStack gap={0} borderBottomWidth="1px" borderColor="border" mb={6}>
            {TABS.map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab)}
                borderBottomWidth="2px"
                borderColor={activeTab === tab ? 'fg' : 'transparent'}
                borderRadius="0"
                fontWeight={activeTab === tab ? 'bold' : 'normal'}
                color={activeTab === tab ? 'fg' : 'fg.muted'}
                px={4}
                pb={2}
              >
                {tab}
              </Button>
            ))}
          </HStack>

          {/* Profile */}
          {activeTab === 'Profile' && (
            <Stack gap={6}>
              <Frame label="Personal info">
                <Stack gap={4}>
                  <FieldRow label="Display name">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </FieldRow>
                  <FieldRow label="Email">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                    />
                    {email && !email.includes('@') && (
                      <Text fontSize="xs" color="fg" mt={1}>
                        ⚠ Enter a valid email
                      </Text>
                    )}
                  </FieldRow>
                  <FieldRow label="Bio">
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short bio (optional)"
                      rows={3}
                    />
                    <Text fontSize="xs" color="fg.muted" mt={1}>
                      {bio.length}/160 characters
                    </Text>
                  </FieldRow>
                </Stack>
              </Frame>

              <Frame label="Preferences">
                <Stack gap={4}>
                  <FieldRow label="Timezone">
                    <Select
                      value={timezone}
                      onChange={setTimezone}
                      options={[
                        { value: 'Europe/Budapest', label: 'Europe/Budapest (CET)' },
                        { value: 'Europe/London', label: 'Europe/London (GMT)' },
                        { value: 'America/New_York', label: 'America/New York (EST)' },
                        { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST)' },
                        { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
                      ]}
                    />
                  </FieldRow>
                </Stack>
              </Frame>

              <Annotate>
                Profile section is intentionally minimal. Add avatar upload and
                connected accounts in v2 if this direction works.
              </Annotate>
            </Stack>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <Stack gap={6}>
              <Frame label="Channels">
                <Stack gap={4}>
                  <SwitchRow
                    label="Email notifications"
                    description="Receive updates via email"
                    checked={emailNotifs}
                    onChange={setEmailNotifs}
                  />
                  <Separator />
                  <SwitchRow
                    label="Push notifications"
                    description="Browser push when you're online"
                    checked={pushNotifs}
                    onChange={setPushNotifs}
                  />
                  <Separator />
                  <SwitchRow
                    label="Weekly digest"
                    description="Summary of activity every Monday"
                    checked={weeklyDigest}
                    onChange={setWeeklyDigest}
                  />
                </Stack>
              </Frame>

              <Frame label="Behaviour">
                <Stack gap={4}>
                  <FieldRow label="Notification sound">
                    <Select
                      value={notifSound}
                      onChange={setNotifSound}
                      options={[
                        { value: 'default', label: 'Default' },
                        { value: 'chime', label: 'Chime' },
                        { value: 'ping', label: 'Ping' },
                        { value: 'none', label: 'None (silent)' },
                      ]}
                    />
                  </FieldRow>
                </Stack>
              </Frame>

              <Annotate>
                Toggle + description pattern tested well in past projects.
                Consider grouping by urgency level instead of channel in v2.
              </Annotate>
            </Stack>
          )}

          {/* Team */}
          {activeTab === 'Team' && (
            <Stack gap={6}>
              <Frame label="Team details">
                <Stack gap={4}>
                  <FieldRow label="Team name">
                    <Input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow label="Visibility">
                    <Select
                      value={visibility}
                      onChange={setVisibility}
                      options={[
                        { value: 'private', label: 'Private — invite only' },
                        { value: 'internal', label: 'Internal — anyone in org' },
                        { value: 'public', label: 'Public — visible to all' },
                      ]}
                    />
                  </FieldRow>
                </Stack>
              </Frame>

              <Frame label="Members">
                <Stack gap={0}>
                  {members.map((m, i) => (
                    <Flex
                      key={m.name}
                      py={2}
                      px={1}
                      justify="space-between"
                      align="center"
                      borderBottomWidth={i < members.length - 1 ? '1px' : '0'}
                      borderColor="border"
                    >
                      <Text fontSize="sm">{m.name}</Text>
                      <Badge
                        variant="outline"
                        fontSize="xs"
                        px={2}
                        borderColor="border"
                        color="fg.muted"
                      >
                        {m.role}
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
                <Separator my={3} />
                <Stack gap={2}>
                  <Text fontSize="xs" fontWeight="bold">
                    Invite someone
                  </Text>
                  <Flex gap={2}>
                    <Input
                      flex={1}
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      size="sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInviteEmail('')}
                      disabled={!inviteEmail}
                    >
                      Send invite
                    </Button>
                  </Flex>
                </Stack>
              </Frame>

              <Annotate>
                Role management is read-only for now. Add inline role
                editing and remove-member in next iteration.
              </Annotate>
            </Stack>
          )}

          {/* Danger zone */}
          {activeTab === 'Danger zone' && (
            <Stack gap={6}>
              <Frame label="Destructive actions">
                <Stack gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">
                      Export data
                    </Text>
                    <Text fontSize="xs" color="fg.muted" mb={2}>
                      Download all your data as a ZIP file.
                    </Text>
                    <Button variant="outline" size="sm">
                      Export data
                    </Button>
                  </Box>

                  <Separator />

                  <Box>
                    <Text fontSize="sm" fontWeight="bold">
                      Delete account
                    </Text>
                    <Text fontSize="xs" color="fg.muted" mb={2}>
                      Permanently delete your account and all data. This cannot be undone.
                    </Text>
                    <Input
                      placeholder='Type "delete my account" to confirm'
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      size="sm"
                      mb={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={confirmDelete !== 'delete my account'}
                      onClick={() => {}}
                      borderColor={
                        confirmDelete === 'delete my account'
                          ? 'fg'
                          : 'border'
                      }
                    >
                      Delete account permanently
                    </Button>
                  </Box>
                </Stack>
              </Frame>

              <Annotate>
                Confirmation string pattern ("type X to confirm") adds friction
                intentionally. Debating whether a two-step dialog would be better UX.
              </Annotate>
            </Stack>
          )}

          {/* Sticky save bar */}
          {activeTab !== 'Danger zone' && (
            <Flex
              mt={8}
              py={3}
              px={4}
              borderTopWidth="1px"
              borderColor="border"
              justify="space-between"
              align="center"
              bg="bg.subtle"
            >
              {saved ? (
                <Text fontSize="xs" fontWeight="bold">
                  ✓ Changes saved
                </Text>
              ) : (
                <Text fontSize="xs" color="fg.muted">
                  Unsaved changes
                </Text>
              )}
              <HStack gap={2}>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  Save changes
                </Button>
              </HStack>
            </Flex>
          )}
        </Box>
      </Flex>
    </ProtoFrame>
  )
}

/* ── Local helper components ── */

function FieldRow({ label, children }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="bold" mb={1}>
        {label}
      </Text>
      {children}
    </Box>
  )
}

function SwitchRow({ label, description, checked, onChange }) {
  return (
    <Flex justify="space-between" align="center">
      <Box>
        <Text fontSize="sm">{label}</Text>
        <Text fontSize="xs" color="fg.muted">
          {description}
        </Text>
      </Box>
      <Switch checked={checked} onChange={onChange} />
    </Flex>
  )
}
