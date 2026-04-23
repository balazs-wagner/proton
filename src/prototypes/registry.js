import { ExampleLogin } from './example-login/ExampleLogin'
import { AppSettings } from './app-settings/AppSettings'
import { WfeModularYaml } from './wfe-modular-yaml/WfeModularYaml'

/**
 * Register new prototypes here.
 * Each entry becomes a card on the index page and a route.
 *
 * { slug, title, description, component }
 */
export const prototypes = [
  {
    slug: 'example-login',
    title: 'Example — login flow',
    description: 'Demonstrates the framework. Two-step login with error state.',
    component: ExampleLogin,
  },
  {
    slug: 'app-settings',
    title: 'App settings',
    description: 'Multi-section settings page with tabs, toggles, team management, and danger zone.',
    component: AppSettings,
  },
  {
    slug: 'wfe-modular-yaml',
    title: 'WFE — modular yaml',
    description: 'Workflow Editor layout with sidebar, step list, and config panel.',
    component: WfeModularYaml,
  },
]
