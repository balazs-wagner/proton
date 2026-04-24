import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
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
  ChevronUp,
  GitPullRequest,
  Tag,
  ArrowUpFromLine,
  Pencil,
} from 'lucide-react'
import { ProtoFrame, Frame, Placeholder, Annotate } from '../../framework'
import { Select } from '../../components/Select'

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
  { name: 'bitrise.yml', depth: 0, tab: 'bitrise.yml' },
  { name: 'e2e/bitrise/testing/', depth: 0, isFolder: true },
  { name: 'testing.yml', depth: 1, tab: 'testing.yml' },
  { name: 'browserstack/', depth: 1, isFolder: true },
  { name: 'pipelines.yml', depth: 2, tab: 'pipelines.yml' },
  { name: 'workflows/', depth: 2, isFolder: true },
  { name: 'workflows.yml', depth: 3, tab: 'workflows.yml' },
  { name: 'build_app.yml', depth: 3, tab: 'build_app.yml' },
  { name: 'run_performance_test.yml', depth: 3, tab: 'run_performance_test.yml' },
  { name: 'analyse_results.yml', depth: 3, tab: 'analyse_results.yml' },
  { name: 'step_bundles/', depth: 1, isFolder: true },
  { name: 'step_bundles.yml', depth: 2, tab: 'step_bundles.yml' },
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
          { name: 'step_bundle 01', isBundle: true, children: [
            { name: 'step 03' },
            { name: 'step 04' },
          ]},
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

// Maps workflow IDs to the module where they are defined
const WF_DEFINITION_MODULE = {
  'setup_and_build_android_app': 'build_app.yml',
  'android_e2e_stress_test': 'run_performance_test.yml',
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
  const [activeWfDrawerTab, setActiveWfDrawerTab] = useState('Configuration')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('pipeline') // 'pipeline' | 'workflow' | 'add-workflows'
  const [editingWorkflowId, setEditingWorkflowId] = useState(null)

  // Per-workflow persistent state (keyed by workflow ID)
  const [wfStates, setWfStates] = useState({})

  const getWfState = (id) =>
    wfStates[id] || {
      // Config tab
      abortOnFailure: false,
      alwaysRun: 'off',
      runConditions: '',
      parallelCopies: '',
      stack: 'default-ubuntu-22',
      machineType: 'default-large',
      // Properties tab
      name: id,
      summary: '',
      description: '',
      // Accordion open/close
      pplCondOpen: true,
      stackOpen: true,
      envOpen: true,
    }

  const updateWfState = (id, patch) =>
    setWfStates((prev) => ({
      ...prev,
      [id]: { ...getWfState(id), ...patch },
    }))

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
        <Flex flex="1" overflow="hidden" position="relative">
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
              onEditWorkflow={(workflowId) => {
                setEditingWorkflowId(workflowId)
                setDrawerMode('workflow')
                setActiveWfDrawerTab('Configuration')
                setDrawerOpen(true)
              }}
              onOpenProperties={() => {
                setDrawerMode('pipeline')
                setActivePplTab('Properties')
                setDrawerOpen(true)
              }}
              onAddWorkflows={() => {
                setDrawerMode('add-workflows')
                setDrawerOpen(true)
              }}
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

          {/* Drawer — only shown when explicitly opened */}
          {showPipeline && drawerOpen && drawerMode === 'pipeline' && (
            <PipelineRightPanel
              pipelineName={selectedPipeline}
              activeTab={activePplTab}
              onTabChange={setActivePplTab}
              onClose={() => setDrawerOpen(false)}
            />
          )}
          {showPipeline && drawerOpen && drawerMode === 'workflow' && (
            <WorkflowDrawer
              workflowId={editingWorkflowId}
              activeTab={activeWfDrawerTab}
              onTabChange={setActiveWfDrawerTab}
              onClose={() => setDrawerOpen(false)}
              state={getWfState(editingWorkflowId)}
              onStateChange={(patch) => updateWfState(editingWorkflowId, patch)}
              onEditDefinition={() => {
                const targetModule = WF_DEFINITION_MODULE[editingWorkflowId]
                if (targetModule) {
                  setActiveFileTab(targetModule)
                  setActiveSidebarItem('Workflows')
                  setDrawerOpen(false)
                }
              }}
            />
          )}
          {showPipeline && drawerOpen && drawerMode === 'add-workflows' && (
            <AddWorkflowsDrawer onClose={() => setDrawerOpen(false)} />
          )}
          {showWorkflow && (
            <WorkflowRightPanel
              workflowName={selectedWorkflow}
              workflow={workflow}
              activeTab={activeConfigTab}
              onTabChange={setActiveConfigTab}
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
            const isClickable = !f.isFolder && f.tab
            const isActive = isClickable && activeFileTab === f.tab
            return (
              <Text
                key={i}
                fontSize="xs"
                color={isActive ? 'fg' : 'fg.muted'}
                fontWeight={isActive ? 'bold' : 'normal'}
                pl={f.depth * 3}
                py={0.5}
                cursor={isClickable ? 'pointer' : 'default'}
                _hover={isClickable ? { color: 'fg' } : {}}
                onClick={isClickable ? () => onFileSelect(f.tab) : undefined}
              >
                {'  '.repeat(f.depth > 0 ? 1 : 0)}
                {f.isFolder ? '📁 ' : ''}
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

function PipelinePanel({ pipeline, pipelineName, onEditWorkflow, onOpenProperties, onAddWorkflows }) {
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
      {/* Pipeline action bar */}
      <Flex justify="center" mb={5}>
        <HStack
          gap={2}
          borderWidth="1px"
          borderColor="border"
          bg="bg"
          px={2}
          py={1}
        >
          {/* Pipeline selector */}
          <Flex
            align="center"
            gap={2}
            px={3}
            py={1}
            borderWidth="1px"
            borderColor="border"
            cursor="pointer"
            minW="200px"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              flex="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {pipelineName}
            </Text>
            <ChevronDown size={14} />
          </Flex>

          {/* Properties */}
          <Button variant="outline" size="xs" px={3} onClick={onOpenProperties}>
            <HStack gap={1}>
              <Settings size={12} />
              <Text fontSize="xs">Properties</Text>
            </HStack>
          </Button>

          {/* + Workflows */}
          <Button variant="outline" size="xs" px={3} onClick={onAddWorkflows}>
            <Text fontSize="xs">+ Workflows</Text>
          </Button>

          {/* Run */}
          <Button variant="outline" size="xs" px={3} color="fg.muted">
            <HStack gap={1}>
              <Play size={12} />
              <Text fontSize="xs">Run</Text>
            </HStack>
          </Button>
        </HStack>
      </Flex>

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
                    onClick={() => onEditWorkflow(stage.id)}
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
                    step.isBundle ? (
                      <Box
                        key={i}
                        px={2}
                        pt={2}
                        pb={1}
                        borderWidth="1px"
                        borderColor="border"
                        borderStyle="dashed"
                        bg="bg.subtle"
                        mb={i < stage.steps.length - 1 ? 1 : 0}
                      >
                        <Text fontSize="xs" fontWeight="bold" mb={1}>
                          {step.name}
                        </Text>
                        {step.children && (
                          <Stack gap={1}>
                            {step.children.map((child, j) => (
                              <Box
                                key={j}
                                px={3}
                                py={2}
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg"
                              >
                                <Text fontSize="xs">{child.name}</Text>
                              </Box>
                            ))}
                          </Stack>
                        )}
                      </Box>
                    ) : (
                      <Box
                        key={i}
                        px={3}
                        py={2}
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg"
                        mb={i < stage.steps.length - 1 ? 1 : 0}
                      >
                        <Text fontSize="xs">{step.name}</Text>
                      </Box>
                    )
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
        position="absolute"
        top="0"
        right="0"
        w="680px"
        h="100%"
        bg="bg"
        borderLeftWidth="1px"
        borderColor="border"
        zIndex="1001"
        overflowY="auto"
        p={5}
        boxShadow="-4px 0 20px rgba(0,0,0,0.08)"
      >
      <Flex justify="space-between" align="center" mb={1}>
        <Heading size="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {pipelineName}
        </Heading>
        <Flex
          w="28px"
          h="28px"
          align="center"
          justify="center"
          cursor="pointer"
          borderWidth="1px"
          borderColor="border"
          _hover={{ bg: 'bg.muted' }}
          onClick={onClose}
        >
          <X size={16} />
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
        <PipelineProperties pipelineName={pipelineName} />
      )}

      {activeTab === 'Triggers' && (
        <PipelineTriggers />
      )}
    </Box>
  )
}

/* ── Workflow Drawer (from pipeline graph) ── */

const WF_DRAWER_TABS = ['Configuration', 'Properties']

function WorkflowDrawer({ workflowId, activeTab, onTabChange, onClose, state, onStateChange, onEditDefinition }) {
  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      w="680px"
      h="100%"
      bg="bg"
      borderLeftWidth="1px"
      borderColor="border"
      zIndex="1001"
      overflowY="auto"
      p={5}
      boxShadow="-4px 0 20px rgba(0,0,0,0.08)"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {workflowId}
        </Heading>
        <Flex
          w="28px"
          h="28px"
          align="center"
          justify="center"
          cursor="pointer"
          borderWidth="1px"
          borderColor="border"
          _hover={{ bg: 'bg.muted' }}
          onClick={onClose}
        >
          <X size={16} />
        </Flex>
      </Flex>

      <HStack gap={0} borderBottomWidth="1px" borderColor="border" mb={5}>
        {WF_DRAWER_TABS.map((tab) => (
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
        <WfDrawerConfiguration workflowId={workflowId} state={state} onChange={onStateChange} onEditDefinition={onEditDefinition} />
      )}

      {activeTab === 'Properties' && (
        <WfDrawerProperties workflowId={workflowId} state={state} onChange={onStateChange} onEditDefinition={onEditDefinition} />
      )}
    </Box>
  )
}

function WfDrawerConfiguration({ workflowId, state, onChange, onEditDefinition }) {
  const { pplCondOpen, stackOpen, envOpen, abortOnFailure, alwaysRun, runConditions, parallelCopies, stack, machineType } = state

  return (
    <Stack gap={4}>
      {/* Pipeline Conditions */}
      <Box borderWidth="1px" borderColor="border">
        <Flex
          px={4}
          py={3}
          justify="space-between"
          align="center"
          cursor="pointer"
          onClick={() => onChange({ pplCondOpen: !pplCondOpen })}
        >
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Pipeline Conditions
            </Text>
            <Text fontSize="xs" color="fg.muted">
              Running conditions related to {workflowId}
            </Text>
          </Box>
          <Box
            color="fg.muted"
            transform={pplCondOpen ? 'rotate(180deg)' : 'rotate(0)'}
            transition="transform 0.15s ease"
          >
            <ChevronDown size={14} />
          </Box>
        </Flex>
        {pplCondOpen && (
          <Box px={4} pb={4}>
            <Separator mb={4} />

            {/* Abort Pipeline on failure */}
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  Abort Pipeline on failure
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  Running Workflows will shut down, future ones won't start if
                  this one fails.
                </Text>
              </Box>
              <Box
                w="36px"
                h="20px"
                borderRadius="999px"
                bg={abortOnFailure ? 'fg' : 'bg.muted'}
                cursor="pointer"
                position="relative"
                flexShrink={0}
                ml={4}
                onClick={() => onChange({ abortOnFailure: !abortOnFailure })}
              >
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="999px"
                  bg="bg"
                  position="absolute"
                  top="2px"
                  left={abortOnFailure ? '18px' : '2px'}
                  transition="left 0.15s ease"
                />
              </Box>
            </Flex>

            <Separator mb={4} />

            {/* Always run */}
            <Box mb={4}>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Always run
              </Text>
              <Select value={alwaysRun} onChange={(v) => onChange({ alwaysRun: v })} options={[{value: 'off', label: 'Off'}, {value: 'on', label: 'On'}]} />
              <Text fontSize="xs" color="fg.muted" mt={1}>
                This Workflow or its dependent Workflows won't start if previous
                Workflows failed.
              </Text>
            </Box>

            <Separator mb={4} />

            {/* Additional running conditions */}
            <Box mb={4}>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Additional running conditions{' '}
                <Text as="span" color="fg.muted" fontWeight="normal">
                  (optional)
                </Text>
              </Text>
              <Textarea placeholder="Enter any valid Go template" rows={3} size="sm" value={runConditions} onChange={(e) => onChange({ runConditions: e.target.value })} />
              <Text fontSize="xs" color="fg.muted" mt={1}>
                Enter any valid Go template. The workflow will only be executed
                if this template evaluates to true. You can use our `getenv` and
                `enveq` functions for interacting with env vars.
              </Text>
            </Box>

            <Separator mb={4} />

            {/* Parallel copies */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Parallel copies{' '}
                <Text as="span" color="fg.muted" fontWeight="normal">
                  (optional)
                </Text>
              </Text>
              <Input placeholder="" size="sm" value={parallelCopies} onChange={(e) => onChange({ parallelCopies: e.target.value })} />
              <Text fontSize="xs" color="fg.muted" mt={1}>
                The number of copies of this Workflow that will be executed in
                parallel at runtime. Value can be a number, or an Env Var.
              </Text>
              <Text fontSize="xs" color="fg.muted" mt={1} textDecoration="underline" cursor="pointer">
                Show more
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Stack & Machine */}
      <Box borderWidth="1px" borderColor="border">
        <Flex
          px={4}
          py={3}
          justify="space-between"
          align="center"
          cursor="pointer"
          onClick={() => onChange({ stackOpen: !stackOpen })}
        >
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Stack & Machine
            </Text>
            <Text fontSize="xs" color="fg.muted">
              Ubuntu 22.04 for Android & Docker • Large
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
            <Box
              color="fg.muted"
              transform={stackOpen ? 'rotate(180deg)' : 'rotate(0)'}
              transition="transform 0.15s ease"
            >
              <ChevronDown size={14} />
            </Box>
          </HStack>
        </Flex>
        {stackOpen && (
          <Box px={4} pb={4} opacity={0.6}>
            <Separator mb={4} />

            <Text fontSize="xs" color="fg.muted" mb={3} textDecoration="underline" cursor="pointer" onClick={onEditDefinition}>
              Edit definition →
            </Text>

            {/* Stack */}
            <Box mb={4}>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Stack
              </Text>
              <Select value={stack} onChange={() => {}} options={[{value: 'default-ubuntu-22', label: 'Default - Ubuntu 22.04 for Android & Docker'}, {value: 'xcode-16', label: 'Xcode 16.4 on macOS Sequoia'}, {value: 'xcode-15', label: 'Xcode 15.4 on macOS Sonoma'}]} disabled />
              <Text fontSize="xs" color="fg.muted" mt={1}>
                Docker container environment based on Ubuntu 22.04. Preinstalled
                Android SDK and other common tools.
              </Text>
              <Text fontSize="xs" color="fg.muted" mt={1}>
                <Text as="span" textDecoration="underline" cursor="pointer">
                  Pre-installed tools
                </Text>
                {' • '}
                <Text as="span" textDecoration="underline" cursor="pointer">
                  Stack Update Policy
                </Text>
              </Text>
              <HStack gap={2} mt={3}>
                <Box
                  w="16px"
                  h="16px"
                  borderWidth="1px"
                  borderColor="border"
                />
                <Text fontSize="xs" color="fg.muted">
                  Use previous stack version ⓘ
                </Text>
              </HStack>
            </Box>

            <Separator mb={4} />

            {/* Machine type */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Machine type ⓘ
              </Text>
              <Select value={machineType} onChange={() => {}} options={[{value: 'default-large', label: 'Default - Large'}, {value: 'medium', label: 'Medium'}, {value: 'x-large', label: 'Extra Large'}]} disabled />
              <Text fontSize="xs" color="fg.muted" mt={1}>
                Machine types may vary depending on high demand.
              </Text>
              <Text fontSize="xs" color="fg.muted" mt={1}>
                EU: AMD Zen5 Large 8 CPU 32 GB RAM
              </Text>
              <Text fontSize="xs" color="fg.muted">
                US: AMD Zen4 Large 8 CPU 32 GB RAM
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Env Vars */}
      <Box borderWidth="1px" borderColor="border">
        <Flex
          px={4}
          py={3}
          justify="space-between"
          align="center"
          cursor="pointer"
          onClick={() => onChange({ envOpen: !envOpen })}
        >
          <Text fontSize="sm" fontWeight="bold">
            Env Vars
          </Text>
          <Box
            color="fg.muted"
            transform={envOpen ? 'rotate(180deg)' : 'rotate(0)'}
            transition="transform 0.15s ease"
          >
            <ChevronDown size={14} />
          </Box>
        </Flex>
        {envOpen && (
          <Box px={4} pb={3} opacity={0.6}>
            <Separator mb={3} />
            <Text fontSize="xs" color="fg.muted" mb={3} textDecoration="underline" cursor="pointer" onClick={onEditDefinition}>
              Edit definition →
            </Text>
            <Text fontSize="xs" color="fg.subtle">
              + Add new
            </Text>
          </Box>
        )}
      </Box>
    </Stack>
  )
}

function WfDrawerProperties({ workflowId, state, onChange, onEditDefinition }) {
  return (
    <Stack gap={5} opacity={0.6}>
      <Text fontSize="xs" color="fg.muted" textDecoration="underline" cursor="pointer" onClick={onEditDefinition}>
        Edit definition →
      </Text>

      {/* Name */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Name
        </Text>
        <Input size="sm" value={state.name} readOnly disabled />
      </Box>

      {/* Summary */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Summary{' '}
          <Text as="span" color="fg.muted" fontWeight="normal">
            (optional)
          </Text>
        </Text>
        <Textarea rows={3} size="sm" value={state.summary} readOnly disabled />
      </Box>

      {/* Description */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Description{' '}
          <Text as="span" color="fg.muted" fontWeight="normal">
            (optional)
          </Text>
        </Text>
        <Textarea rows={4} size="sm" value={state.description} readOnly disabled />
      </Box>
    </Stack>
  )
}

/* ── Pipeline Properties tab ── */

function PipelineProperties({ pipelineName }) {
  return (
    <Stack gap={5}>
      {/* Name */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Name
        </Text>
        <Input defaultValue={pipelineName} size="sm" />
      </Box>

      {/* Summary */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Summary{' '}
          <Text as="span" color="fg.muted" fontWeight="normal">
            (optional)
          </Text>
        </Text>
        <Textarea placeholder="" rows={3} size="sm" />
      </Box>

      {/* Description */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Description{' '}
          <Text as="span" color="fg.muted" fontWeight="normal">
            (optional)
          </Text>
        </Text>
        <Textarea placeholder="" rows={4} size="sm" />
      </Box>

      {/* Priority */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          Priority{' '}
          <Text as="span" color="fg.muted" fontWeight="normal">
            (optional)
          </Text>
        </Text>
        <Input placeholder="" size="sm" />
        <Text fontSize="xs" color="fg.muted" mt={1}>
          Set priority between -100 and +100. Default value is 0.
        </Text>
      </Box>

      {/* Git status name */}
      <Box>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="xs" fontWeight="bold">
            Git status name{' '}
            <Text as="span" color="fg.muted" fontWeight="normal">
              (optional)
            </Text>
          </Text>
          <Text fontSize="xs" color="fg.muted">
            0/100
          </Text>
        </Flex>
        <Input defaultValue="ci/bitrise/<project_slug>/<event_type>" size="sm" />
        <Text fontSize="xs" color="fg.muted" mt={1}>
          Allowed characters: A-Za-z.,():/–_0-9 []&lt;&gt;
        </Text>
        <Text fontSize="xs" color="fg.muted" mt={1}>
          You can use the following variables in your string:
        </Text>
        <HStack gap={2} mt={2} flexWrap="wrap">
          {['<project_slug>', '<project_title>', '<target_id>', '<event_type>'].map(
            (v) => (
              <Text
                key={v}
                fontSize="xs"
                px={2}
                py={1}
                borderWidth="1px"
                borderColor="border"
                bg="bg.subtle"
              >
                {v}
              </Text>
            )
          )}
        </HStack>
      </Box>

      {/* Delete */}
      <Separator />
      <Button variant="outline" size="xs" px={3} w="fit-content">
        <HStack gap={1}>
          <Trash2 size={12} />
          <Text fontSize="xs">Delete Pipeline</Text>
        </HStack>
      </Button>
    </Stack>
  )
}

/* ── Pipeline Triggers tab ── */

function PipelineTriggers() {
  const [triggersEnabled, setTriggersEnabled] = useState(true)

  return (
    <Stack gap={4}>
      {/* Enable toggle */}
      <Flex
        borderWidth="1px"
        borderColor="border"
        px={4}
        py={3}
        justify="space-between"
        align="center"
      >
        <Box>
          <Text fontSize="sm" fontWeight="bold">
            Enable triggers
          </Text>
          <Text fontSize="xs" color="fg.muted">
            When disabled and saved, none of the triggers below will execute a
            build.
          </Text>
        </Box>
        <Box
          w="36px"
          h="20px"
          borderRadius="999px"
          bg={triggersEnabled ? 'fg' : 'bg.muted'}
          cursor="pointer"
          position="relative"
          onClick={() => setTriggersEnabled(!triggersEnabled)}
        >
          <Box
            w="16px"
            h="16px"
            borderRadius="999px"
            bg="bg"
            position="absolute"
            top="2px"
            left={triggersEnabled ? '18px' : '2px'}
            transition="left 0.15s ease"
          />
        </Box>
      </Flex>

      {/* Trigger sections */}
      <TriggerSection icon={<ArrowUpFromLine size={16} />} label="Push" />
      <TriggerSection icon={<GitPullRequest size={16} />} label="Pull request" />
      <TriggerSection icon={<Tag size={16} />} label="Tag" />
    </Stack>
  )
}

function TriggerSection({ icon, label }) {
  const [open, setOpen] = useState(true)

  return (
    <Box borderWidth="1px" borderColor="border">
      <Flex
        px={4}
        py={3}
        justify="space-between"
        align="center"
        cursor="pointer"
        onClick={() => setOpen(!open)}
      >
        <HStack gap={2}>
          <Box color="fg.muted">{icon}</Box>
          <Text fontSize="sm" fontWeight="bold">
            {label}
          </Text>
        </HStack>
        <Box
          color="fg.muted"
          transform={open ? 'rotate(0)' : 'rotate(180deg)'}
          transition="transform 0.15s ease"
        >
          <ChevronUp size={14} />
        </Box>
      </Flex>
      {open && (
        <Box px={4} pb={3}>
          <Text fontSize="xs" color="fg.muted" cursor="pointer">
            + Add trigger
          </Text>
        </Box>
      )}
    </Box>
  )
}

/* ── Add Workflows Drawer ── */

const AVAILABLE_WORKFLOWS = [
  {
    name: 'test',
    description: 'Not used by other Pipelines',
    stack: 'Xcode 16.4',
  },
  {
    name: 'test_without_building',
    description: 'Not used by other Pipelines',
    stack: 'Xcode 26.5 with edge updates',
  },
  {
    name: 'deploy_to_staging',
    description: 'Used by deploy_pipeline',
    stack: 'Ubuntu 22.04',
  },
  {
    name: 'run_ui_tests',
    description: 'Not used by other Pipelines',
    stack: 'Xcode 16.4',
  },
]

function AddWorkflowsDrawer({ onClose }) {
  const [filter, setFilter] = useState('')

  const filtered = AVAILABLE_WORKFLOWS.filter((wf) =>
    wf.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      w="680px"
      h="100%"
      bg="bg"
      borderLeftWidth="1px"
      borderColor="border"
      zIndex="1001"
      overflowY="auto"
      p={5}
      boxShadow="-4px 0 20px rgba(0,0,0,0.08)"
    >
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="sm">Add Workflows</Heading>
        <Flex
          w="28px"
          h="28px"
          align="center"
          justify="center"
          cursor="pointer"
          borderWidth="1px"
          borderColor="border"
          _hover={{ bg: 'bg.muted' }}
          onClick={onClose}
        >
          <X size={16} />
        </Flex>
      </Flex>

      {/* Search */}
      <HStack
        gap={2}
        borderWidth="1px"
        borderColor="border"
        px={3}
        py={2}
        mb={4}
      >
        <Search size={14} />
        <Input
          variant="unstyled"
          placeholder="Filter by name"
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </HStack>

      {/* Workflow list */}
      <Stack gap={2}>
        {filtered.map((wf) => (
          <Box
            key={wf.name}
            borderWidth="1px"
            borderColor="border"
            px={4}
            py={3}
            cursor="pointer"
            _hover={{ bg: 'bg.subtle' }}
          >
            <Text fontSize="sm" fontWeight="bold">
              {wf.name}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {wf.description} • {wf.stack}
            </Text>
          </Box>
        ))}
        {filtered.length === 0 && (
          <Text fontSize="xs" color="fg.muted" py={4} textAlign="center">
            No workflows match your filter.
          </Text>
        )}
      </Stack>
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

