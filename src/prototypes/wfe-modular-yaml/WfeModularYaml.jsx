import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Stack,
  HStack,
  Badge,
  Separator,
} from '@chakra-ui/react'
import { ProtoFrame, Frame, Placeholder, Annotate } from '../../framework'

/* ── Data ── */

const SIDEBAR_NAV = [
  { label: 'Workflows', icon: '⎔' },
  { label: 'Pipelines', icon: '⏣' },
  { label: 'Step bundles', icon: '☰' },
  { label: 'Secrets', icon: '⊘' },
  { label: 'Env Vars', icon: '$' },
  { label: 'Triggers', icon: '⚡' },
  { label: 'Containers', icon: '▣' },
  { label: 'Stacks & Machines', icon: '≡' },
  { label: 'Licenses', icon: '⚿' },
]

const FILE_TABS = [
  'bitrise.yml',
  'workflows.yml',
  'step_bundles.yml',
  'pipelines.yml',
  'containers.yml',
]

const WORKFLOWS = {
  'testing-workflow': {
    stack: 'Xcode 1.2.3 emulated',
    machine: 'M1 medium',
    steps: [
      { name: 'Git Clone repository', version: '4.1.2' },
      { name: 'Save cache', version: '1.5.1' },
      { name: 'Xcode Build for testing for iOS', version: '3.3.10' },
      { name: 'Deploy to Bitrise.io', version: '2.23.1' },
    ],
  },
  'deploy-workflow': {
    stack: 'Xcode 1.2.3 emulated',
    machine: 'M1 large',
    steps: [
      { name: 'Git Clone repository', version: '4.1.2' },
      { name: 'Restore cache', version: '2.0.3' },
      { name: 'Xcode Archive', version: '5.1.0' },
      { name: 'Deploy to App Store Connect', version: '3.0.1' },
    ],
  },
}

const CONFIG_TABS = ['Configuration', 'Properties', 'Triggers']

/* ── Main component ── */

export function WfeModularYaml() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Workflows')
  const [activeFileTab, setActiveFileTab] = useState('workflows.yml')
  const [selectedWorkflow, setSelectedWorkflow] = useState('testing-workflow')
  const [activeConfigTab, setActiveConfigTab] = useState('Configuration')

  const workflow = WORKFLOWS[selectedWorkflow]

  return (
    <ProtoFrame title="WFE — modular yaml" note="v1 — layout & basic elements">
      <Flex direction="column" h="calc(100vh - 41px)">
        {/* ── Global header ── */}
        <GlobalHeader />

        {/* ── Breadcrumb + actions ── */}
        <TopBar />

        {/* ── File tabs bar ── */}
        <FileTabBar
          tabs={FILE_TABS}
          active={activeFileTab}
          onSelect={setActiveFileTab}
        />

        {/* ── Body: sidebar + center + right ── */}
        <Flex flex="1" overflow="hidden">
          {/* Left sidebar */}
          <Sidebar
            items={SIDEBAR_NAV}
            active={activeSidebarItem}
            onSelect={setActiveSidebarItem}
          />

          {/* Center panel — workflow steps */}
          <CenterPanel
            workflows={WORKFLOWS}
            selected={selectedWorkflow}
            onSelect={setSelectedWorkflow}
          />

          {/* Right panel — config */}
          <RightPanel
            workflowName={selectedWorkflow}
            workflow={workflow}
            activeTab={activeConfigTab}
            onTabChange={setActiveConfigTab}
          />
        </Flex>
      </Flex>
    </ProtoFrame>
  )
}

/* ── Global header (dark bar) ── */

function GlobalHeader() {
  return (
    <Flex
      px={4}
      py={2}
      align="center"
      justify="space-between"
      bg="fg"
      color="bg"
      flexShrink={0}
    >
      {/* Left: logo */}
      <HStack gap={3}>
        <Text fontWeight="bold" fontSize="sm">
          ⬡ bitrise
        </Text>
      </HStack>

      {/* Right: global actions */}
      <HStack gap={4}>
        <Text fontSize="xs" borderWidth="1px" borderColor="fg.muted" px={2} py={1}>
          ✦ Ask AI
        </Text>
        <Text fontSize="xs">⌕</Text>
        <Text fontSize="xs">⊞</Text>
        <Text fontSize="xs">?</Text>
        <Text fontSize="xs">🔔</Text>
        <Box
          w="22px"
          h="22px"
          borderRadius="999px"
          bg="bg.muted"
          borderWidth="1px"
          borderColor="fg.muted"
        />
      </HStack>
    </Flex>
  )
}

/* ── Breadcrumb + action bar ── */

function TopBar() {
  return (
    <Flex
      px={4}
      py={2}
      borderBottomWidth="1px"
      borderColor="border"
      align="center"
      justify="space-between"
      bg="bg"
      flexShrink={0}
    >
      {/* Left: breadcrumb */}
      <HStack gap={2}>
        <Text fontSize="xs" color="fg.muted" textDecoration="underline">
          Bitrise CI
        </Text>
        <Text fontSize="xs" color="fg.muted">
          ›
        </Text>
        <Text fontSize="xs" color="fg.muted" textDecoration="underline">
          proton
        </Text>
        <Text fontSize="xs" color="fg.muted">
          ›
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          Workflow Editor
        </Text>
      </HStack>

      {/* Right: action buttons */}
      <HStack gap={2}>
        <Button variant="outline" size="xs">
          Show diff
        </Button>
        <Button variant="outline" size="xs">
          Discard
        </Button>
        <Button variant="outline" size="xs" fontWeight="bold">
          Save changes
        </Button>
      </HStack>
    </Flex>
  )
}

/* ── File tab bar ── */

function FileTabBar({ tabs, active, onSelect }) {
  return (
    <Flex
      px={4}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
      flexShrink={0}
      align="center"
      gap={4}
    >
      {/* Branch indicator */}
      <HStack gap={1} py={2} pr={4} borderRightWidth="1px" borderColor="border">
        <Text fontSize="xs" fontWeight="bold">
          bitrise.yml
        </Text>
        <Text fontSize="xs" color="fg.muted">
          ⎇ ci-1234-feature-…
        </Text>
      </HStack>

      {/* File tabs */}
      <HStack gap={0}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="xs"
            onClick={() => onSelect(tab)}
            borderBottomWidth="2px"
            borderColor={active === tab ? 'fg' : 'transparent'}
            borderRadius="0"
            fontWeight={active === tab ? 'bold' : 'normal'}
            color={active === tab ? 'fg' : 'fg.muted'}
            px={3}
            py={2}
          >
            {tab}
          </Button>
        ))}
      </HStack>
    </Flex>
  )
}

/* ── Left sidebar ── */

function Sidebar({ items, active, onSelect }) {
  return (
    <Box
      w="220px"
      flexShrink={0}
      borderRightWidth="1px"
      borderColor="border"
      bg="bg"
      overflowY="auto"
      py={2}
    >
      <Stack gap={0}>
        {items.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(item.label)}
            justifyContent="flex-start"
            fontWeight={active === item.label ? 'bold' : 'normal'}
            bg={active === item.label ? 'bg.subtle' : 'transparent'}
            borderRadius="0"
            px={4}
            py={2}
            w="full"
          >
            <HStack gap={3}>
              <Text fontSize="sm" color="fg.muted" w="16px" textAlign="center">
                {item.icon}
              </Text>
              <Text fontSize="sm">{item.label}</Text>
            </HStack>
          </Button>
        ))}
      </Stack>

      <Separator my={3} />

      <Button
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        borderRadius="0"
        px={4}
        py={2}
        w="full"
      >
        <HStack gap={3}>
          <Text fontSize="sm" color="fg.muted" w="16px" textAlign="center">
            {'</>'}
          </Text>
          <Text fontSize="sm">bitrise.yml</Text>
        </HStack>
      </Button>

      <Separator my={3} />

      <Button
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        borderRadius="0"
        px={4}
        py={2}
        w="full"
      >
        <HStack gap={3}>
          <Text fontSize="sm" color="fg.muted" w="16px" textAlign="center">
            ✦
          </Text>
          <Text fontSize="sm">AI features</Text>
        </HStack>
      </Button>
    </Box>
  )
}

/* ── Center panel ── */

function CenterPanel({ workflows, selected, onSelect }) {
  const workflow = workflows[selected]
  const workflowNames = Object.keys(workflows)

  return (
    <Box
      flex="1"
      borderRightWidth="1px"
      borderColor="border"
      overflowY="auto"
      p={5}
    >
      {/* Workflow selector */}
      <Flex gap={2} mb={5}>
        <Box
          flex="1"
          borderWidth="1px"
          borderColor="border"
          px={3}
          py={2}
          cursor="pointer"
          position="relative"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="xs">
              {selected}{' '}
              <Text as="span" color="fg.muted">
                [workflows.yml]
              </Text>
            </Text>
            <Text fontSize="xs" color="fg.muted">
              ▾
            </Text>
          </Flex>
        </Box>
        <Button variant="outline" size="sm" px={3}>
          ▶
        </Button>
      </Flex>

      {/* Workflow card */}
      <Box
        borderWidth="1px"
        borderColor="border"
        bg="bg"
      >
        {/* Card header */}
        <Box px={4} py={3} borderBottomWidth="1px" borderColor="border">
          <Text fontSize="sm" fontWeight="bold">
            {selected}
          </Text>
          <Text fontSize="xs" color="fg.muted">
            {workflow.stack}
          </Text>
        </Box>

        {/* Steps list */}
        <Stack gap={0}>
          {workflow.steps.map((step, i) => (
            <Flex
              key={i}
              px={4}
              py={3}
              align="center"
              gap={3}
              borderBottomWidth={i < workflow.steps.length - 1 ? '1px' : '0'}
              borderColor="border"
              _hover={{ bg: 'bg.subtle' }}
              cursor="pointer"
            >
              {/* Drag handle */}
              <Text fontSize="xs" color="fg.muted" userSelect="none">
                ⠿
              </Text>

              {/* Step icon placeholder */}
              <Flex
                w="32px"
                h="32px"
                align="center"
                justify="center"
                borderWidth="1px"
                borderColor="border"
                bg="bg.muted"
                flexShrink={0}
              >
                <Text fontSize="xs" color="fg.muted">
                  ☐
                </Text>
              </Flex>

              {/* Step info */}
              <Box>
                <Text fontSize="sm">{step.name}</Text>
                <Text fontSize="xs" color="fg.muted">
                  {step.version}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Box>

      <Annotate>
        Steps are static for now. Next: add reordering, add/remove step,
        and step detail panel on click.
      </Annotate>
    </Box>
  )
}

/* ── Right panel ── */

function RightPanel({ workflowName, workflow, activeTab, onTabChange }) {
  return (
    <Box w="380px" flexShrink={0} overflowY="auto" p={5}>
      {/* Title */}
      <Heading size="sm" mb={4}>
        {workflowName}
      </Heading>

      {/* Config tabs */}
      <HStack gap={0} borderBottomWidth="1px" borderColor="border" mb={5}>
        {CONFIG_TABS.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="xs"
            onClick={() => onTabChange(tab)}
            borderBottomWidth="2px"
            borderColor={activeTab === tab ? 'fg' : 'transparent'}
            borderRadius="0"
            fontWeight={activeTab === tab ? 'bold' : 'normal'}
            color={activeTab === tab ? 'fg' : 'fg.muted'}
            px={3}
            py={2}
          >
            {tab}
          </Button>
        ))}
      </HStack>

      {activeTab === 'Configuration' && (
        <Stack gap={4}>
          {/* Stack & Machine */}
          <Box
            borderWidth="1px"
            borderColor="border"
            px={4}
            py={3}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  Stack & Machine
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {workflow.stack} • {workflow.machine}
                </Text>
              </Box>
              <HStack gap={2}>
                <Badge
                  variant="outline"
                  fontSize="xs"
                  px={2}
                  borderColor="border"
                  color="fg.muted"
                >
                  DEFAULT
                </Badge>
                <Text fontSize="xs" color="fg.muted">
                  ▾
                </Text>
              </HStack>
            </Flex>
          </Box>

          {/* Environment variables */}
          <Box
            borderWidth="1px"
            borderColor="border"
            px={4}
            py={3}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  Environment variables
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  Env Vars exclusive to the Steps within this Workflow
                </Text>
              </Box>
              <Text fontSize="xs" color="fg.muted">
                ▾
              </Text>
            </Flex>
          </Box>
        </Stack>
      )}

      {activeTab === 'Properties' && (
        <Placeholder label="Properties panel — coming next" h="200px" />
      )}

      {activeTab === 'Triggers' && (
        <Placeholder label="Triggers panel — coming next" h="200px" />
      )}
    </Box>
  )
}
