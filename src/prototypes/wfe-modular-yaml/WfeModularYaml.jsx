import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Stack,
  HStack,
  Badge,
  Separator,
} from '@chakra-ui/react'
import {
  Link as LinkIcon,
  Settings,
  Trash2,
  X,
  Search,
  HelpCircle,
  Bell,
  LayoutGrid,
  Sparkles,
  ChevronDown,
  Play,
  GripVertical,
  Check,
  FolderOpen,
  FileCode,
  GitBranch,
} from 'lucide-react'
import { ProtoFrame, Frame, Placeholder, Annotate } from '../../framework'

/* ── Data ── */

const SIDEBAR_NAV = [
  { label: 'Workflows', icon: '⎔' },
  { label: 'Pipelines', icon: '⏣' },
  { label: 'Step Bundles', icon: '☰' },
  { label: 'Secrets', icon: '⊘' },
  { label: 'Env Vars', icon: '$' },
  { label: 'Triggers', icon: '⚡' },
  { label: 'Containers', icon: '▣' },
  { label: 'Stacks and Machines', icon: '≡' },
  { label: 'Licenses', icon: '⚿' },
]

const FILE_TABS = [
  'merged config',
  'bitrise.yml',
  'testing.yml',
  'pipelines.yml',
  'workflows.yml',
  'build_app.yml',
  'run_performance_test.yml',
  'analyse_results.yml',
  'step_bundles.yml',
]

const FILE_TREE = [
  { name: 'bitrise.yml', depth: 0 },
  { name: 'modules/', depth: 0, isFolder: true },
  { name: 'testing.yml', depth: 1 },
  { name: 'pipelines.yml', depth: 1 },
  { name: 'workflows.yml', depth: 1 },
  { name: 'build_app.yml', depth: 1 },
  { name: 'run_performance_test.yml', depth: 1 },
  { name: 'analyse_results.yml', depth: 1 },
  { name: 'step_bundles.yml', depth: 1 },
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

const PIPELINES = {
  'pipeline_stress_test_e2e_browserstack': {
    stages: [
      {
        id: 'setup_and_build_android_app',
        steps: [
          { name: 'step 01' },
          { name: 'step 02' },
          { name: 'step_bundle 01', isBundle: true },
          { name: 'step 03' },
          { name: 'step 04' },
          { name: 'step 05' },
        ],
        next: ['android_e2e_stress_test'],
      },
      {
        id: 'android_e2e_stress_test',
        steps: [],
        next: [],
      },
    ],
  },
}

const CONFIG_TABS = ['Configuration', 'Properties', 'Triggers']
const PPL_TABS = ['Properties', 'Triggers']

/* ── Main component ── */

export function WfeModularYaml() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Pipelines')
  const [activeFileTab, setActiveFileTab] = useState('pipelines.yml')
  const [selectedWorkflow, setSelectedWorkflow] = useState('testing-workflow')
  const [selectedPipeline, setSelectedPipeline] = useState(
    'pipeline_stress_test_e2e_browserstack'
  )
  const [activeConfigTab, setActiveConfigTab] = useState('Configuration')
  const [activePplTab, setActivePplTab] = useState('Properties')
  const [pplRightPanelOpen, setPplRightPanelOpen] = useState(false)

  const workflow = WORKFLOWS[selectedWorkflow]
  const pipeline = PIPELINES[selectedPipeline]

  const showPipeline =
    activeFileTab === 'pipelines.yml' && activeSidebarItem === 'Pipelines'
  const showWorkflow =
    activeFileTab === 'workflows.yml' && activeSidebarItem === 'Workflows'

  return (
    <ProtoFrame title="WFE — modular yaml" note="v2 — pipelines + view switching">
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
            activeFileTab={activeFileTab}
            onFileSelect={setActiveFileTab}
          />

          {/* Center panel */}
          {showPipeline ? (
            <PipelinePanel
              pipeline={pipeline}
              pipelineName={selectedPipeline}
              onEditWorkflow={() => setPplRightPanelOpen(true)}
            />
          ) : showWorkflow ? (
            <WorkflowPanel
              workflows={WORKFLOWS}
              selected={selectedWorkflow}
              onSelect={setSelectedWorkflow}
            />
          ) : (
            <EmptyCanvas
              moduleTab={activeFileTab}
              entityType={activeSidebarItem}
            />
          )}

          {/* Right panel */}
          {showPipeline && pplRightPanelOpen ? (
            <PipelineRightPanel
              pipelineName={selectedPipeline}
              activeTab={activePplTab}
              onTabChange={setActivePplTab}
              onClose={() => setPplRightPanelOpen(false)}
            />
          ) : showWorkflow ? (
            <WorkflowRightPanel
              workflowName={selectedWorkflow}
              workflow={workflow}
              activeTab={activeConfigTab}
              onTabChange={setActiveConfigTab}
            />
          ) : (
            <EmptyRightPanel
              moduleTab={activeFileTab}
              entityType={activeSidebarItem}
            />
          )}
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
      <HStack gap={3}>
        <Text fontWeight="bold" fontSize="sm">
          ⬡ bitrise
        </Text>
      </HStack>
      <HStack gap={4}>
        <HStack
          gap={1}
          fontSize="xs"
          borderWidth="1px"
          borderColor="fg.muted"
          px={2}
          py={1}
        >
          <Sparkles size={12} />
          <Text fontSize="xs">Ask AI</Text>
        </HStack>
        <Search size={16} />
        <LayoutGrid size={16} />
        <HelpCircle size={16} />
        <Bell size={16} />
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
      <HStack
        gap={1}
        py={2}
        pr={4}
        borderRightWidth="1px"
        borderColor="border"
        flexShrink={0}
      >
        <Text fontSize="xs" color="fg.muted">
          bitrise.yml — in repo
        </Text>
        <Text fontSize="xs" color="fg.muted">
          branch:
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          main (default)
        </Text>
      </HStack>

      {/* File tabs — scrollable */}
      <Flex gap={0} overflow="auto" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
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
            flexShrink={0}
            whiteSpace="nowrap"
          >
            {tab}
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}

/* ── Left sidebar ── */

function Sidebar({ items, active, onSelect, activeFileTab, onFileSelect }) {
  return (
    <Flex
      direction="column"
      w="320px"
      flexShrink={0}
      borderRightWidth="1px"
      borderColor="border"
      bg="bg"
      overflowY="auto"
      py={2}
    >
      {/* Nav items */}
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

      {/* File tree */}
      <Box px={4} pb={2}>
        <Text fontSize="xs" color="fg.muted" mb={2}>
          @repo/branch/
        </Text>
        <Stack gap={0}>
          {FILE_TREE.map((f, i) => {
            const isClickable = !f.isFolder
            const isActive = isClickable && activeFileTab === f.name
            return (
              <Text
                key={i}
                fontSize="xs"
                color={isActive ? 'fg' : 'fg.muted'}
                fontWeight={isActive ? 'bold' : 'normal'}
                pl={f.depth * 4}
                py={0.5}
                cursor={isClickable ? 'pointer' : 'default'}
                _hover={isClickable ? { color: 'fg' } : {}}
                onClick={isClickable ? () => onFileSelect(f.name) : undefined}
              >
                {f.depth > 0 ? '| ' : ''}
                {f.isFolder ? '📁 ' : f.depth > 0 ? '' : ''}
                {f.name}
              </Text>
            )
          })}
        </Stack>
      </Box>

      {/* Spacer to push AI features to bottom */}
      <Box flex="1" />

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
    </Flex>
  )
}

/* ── Workflow center panel ── */

function WorkflowPanel({ workflows, selected, onSelect }) {
  const workflow = workflows[selected]

  return (
    <Box flex="1" borderRightWidth="1px" borderColor="border" overflowY="auto" p={5}>
      {/* Workflow selector */}
      <Flex gap={2} mb={5}>
        <Box
          flex="1"
          borderWidth="1px"
          borderColor="border"
          px={3}
          py={2}
          cursor="pointer"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="xs">
              {selected}{' '}
              <Text as="span" color="fg.muted">
                [workflows.yml]
              </Text>
            </Text>
            <ChevronDown size={14} color="currentColor" />
          </Flex>
        </Box>
        <Button variant="outline" size="sm" px={3}>
          <Play size={14} />
        </Button>
      </Flex>

      {/* Workflow card */}
      <Box borderWidth="1px" borderColor="border" bg="bg">
        <Box px={4} py={3} borderBottomWidth="1px" borderColor="border">
          <Text fontSize="sm" fontWeight="bold">
            {selected}
          </Text>
          <Text fontSize="xs" color="fg.muted">
            {workflow.stack}
          </Text>
        </Box>
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
              <Box color="fg.muted" userSelect="none" flexShrink={0}>
                <GripVertical size={14} />
              </Box>
              <Flex
                w="32px"
                h="32px"
                align="center"
                justify="center"
                borderWidth="1px"
                borderColor="border"
                bg="bg.muted"
                flexShrink={0}
                color="fg.muted"
              >
                <FileCode size={14} />
              </Flex>
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

/* ── Pipeline center panel (graph view) ── */

function PipelinePanel({ pipeline, pipelineName, onEditWorkflow }) {
  const stages = pipeline.stages

  return (
    <Box
      flex="1"
      borderRightWidth="1px"
      borderColor="border"
      overflowY="auto"
      overflow="auto"
      p={5}
      position="relative"
    >
      {/* Pipeline name */}
      <Text fontSize="xs" color="fg.muted" mb={4}>
        {pipelineName}
      </Text>

      {/* Graph area */}
      <Flex align="flex-start" gap={0} position="relative">
        {stages.map((stage, stageIndex) => (
          <Flex key={stage.id} align="flex-start">
            {/* Workflow node */}
            <Box
              borderWidth="1px"
              borderColor="border"
              bg="bg"
              minW="200px"
              maxW="220px"
            >
              {/* Node header with actions */}
              <Flex
                px={3}
                py={2}
                borderBottomWidth={stage.steps.length > 0 ? '1px' : '0'}
                borderColor="border"
                bg="bg.subtle"
                justify="space-between"
                align="center"
                gap={2}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  flex="1"
                  minW="0"
                >
                  {stage.id}
                </Text>
                <HStack gap={0} flexShrink={0}>
                  <Flex
                    w="24px"
                    h="24px"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: 'bg.muted' }}
                    title="Chain workflows"
                  >
                    <LinkIcon size={13} />
                  </Flex>
                  <Flex
                    w="24px"
                    h="24px"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: 'bg.muted' }}
                    onClick={onEditWorkflow}
                    title="Edit workflow"
                  >
                    <Settings size={13} />
                  </Flex>
                  <Flex
                    w="24px"
                    h="24px"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: 'bg.muted' }}
                    title="Delete workflow"
                  >
                    <Trash2 size={13} />
                  </Flex>
                </HStack>
              </Flex>

              {/* Steps inside node */}
              {stage.steps.length > 0 && (
                <Stack gap={0} p={2}>
                  {stage.steps.map((step, i) => (
                    <Box
                      key={i}
                      px={3}
                      py={2}
                      borderWidth="1px"
                      borderColor="border"
                      borderStyle={step.isBundle ? 'dashed' : 'solid'}
                      bg="bg"
                      mb={i < stage.steps.length - 1 ? 1 : 0}
                    >
                      <Text fontSize="xs">{step.name}</Text>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Arrow connector */}
            {stageIndex < stages.length - 1 && (
              <Flex align="center" px={3} pt={4}>
                <Box w="40px" h="1px" bg="border" />
                <Text fontSize="xs" color="fg.muted" mt="-1px">
                  ▸
                </Text>
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>

      {/* Ghost view annotation */}
      <Annotate>
        What can a "ghost view" show? Can we show the steps inside? Can we show
        steps in the step bundle — those coming from the SB definition, which is
        not even mentioned in the current module?
      </Annotate>
    </Box>
  )
}

/* ── Workflow right panel ── */

function WorkflowRightPanel({ workflowName, workflow, activeTab, onTabChange }) {
  return (
    <Box w="380px" flexShrink={0} overflowY="auto" p={5}>
      <Heading size="sm" mb={4}>
        {workflowName}
      </Heading>

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
          <Box borderWidth="1px" borderColor="border" px={4} py={3}>
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
                <Box color="fg.muted">
                  <ChevronDown size={14} />
                </Box>
              </HStack>
            </Flex>
          </Box>

          <Box borderWidth="1px" borderColor="border" px={4} py={3}>
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  Environment variables
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  Env Vars exclusive to the Steps within this Workflow
                </Text>
              </Box>
              <Box color="fg.muted">
                <ChevronDown size={14} />
              </Box>
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

/* ── Pipeline right panel ── */

function PipelineRightPanel({ pipelineName, activeTab, onTabChange, onClose }) {
  return (
    <Box
      w="380px"
      flexShrink={0}
      overflowY="auto"
      p={5}
      borderLeftWidth="1px"
      borderColor="border"
    >
      <Flex justify="space-between" align="center" mb={1}>
        <HStack gap={3}>
          <Heading size="sm">PPL-1</Heading>
        <Flex
          w="24px"
          h="24px"
          align="center"
          justify="center"
          borderWidth="1px"
          borderColor="border"
          bg="bg.subtle"
        >
          <Check size={14} />
        </Flex>
        </HStack>
        <Flex
          w="24px"
          h="24px"
          align="center"
          justify="center"
          cursor="pointer"
          _hover={{ bg: 'bg.subtle' }}
          onClick={onClose}
        >
          <X size={14} />
        </Flex>
      </Flex>

      <HStack gap={0} borderBottomWidth="1px" borderColor="border" mb={5} mt={4}>
        {PPL_TABS.map((tab) => (
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

      {activeTab === 'Properties' && (
        <Box>
          <Text fontSize="xs" color="fg.muted">
            All properties belong to the PPL definition and are editable in this
            view.
          </Text>
          <Placeholder label="Pipeline properties" h="200px" mt={4} />
        </Box>
      )}

      {activeTab === 'Triggers' && (
        <Placeholder label="Pipeline triggers" h="200px" />
      )}
    </Box>
  )
}

/* ── Empty states ── */

function EmptyCanvas({ moduleTab, entityType }) {
  return (
    <Flex
      flex="1"
      borderRightWidth="1px"
      borderColor="border"
      align="center"
      justify="center"
      p={5}
    >
      <Stack align="center" gap={2}>
        <Text fontSize="sm" color="fg.muted">
          {moduleTab}
        </Text>
        <Text fontSize="xs" color="fg.subtle">
          No {entityType.toLowerCase()} content in this module yet.
        </Text>
      </Stack>
    </Flex>
  )
}

function EmptyRightPanel({ moduleTab, entityType }) {
  return (
    <Box w="380px" flexShrink={0} overflowY="auto" p={5}>
      <Text fontSize="xs" color="fg.subtle">
        Select a {entityType.toLowerCase().replace(/s$/, '')} to see its properties.
      </Text>
    </Box>
  )
}
