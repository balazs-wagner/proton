import { HashRouter, Routes, Route } from 'react-router-dom'
import { IndexPage } from './IndexPage'
import { prototypes } from './prototypes/registry'

/**
 * HashRouter is used because GitHub Pages doesn't support
 * client-side routing out of the box. Hash routes (/#/foo) work
 * without any server config.
 */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        {prototypes.map((p) => {
          const Component = p.component
          return (
            <Route key={p.slug} path={`/${p.slug}`} element={<Component />} />
          )
        })}
      </Routes>
    </HashRouter>
  )
}
