import { HashRouter, Routes, Route } from 'react-router-dom'
import { Provider } from './framework'
import { IndexPage } from './IndexPage'
import { prototypes } from './prototypes/registry'

/**
 * HashRouter is used because GitHub Pages doesn't support
 * client-side routing out of the box. Hash routes (/#/foo) work
 * without any server config.
 *
 * Each prototype is wrapped in its own Provider so it can
 * use a different theme (set via `theme` in the registry).
 */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Provider>
              <IndexPage />
            </Provider>
          }
        />
        {prototypes.map((p) => {
          const Component = p.component
          return (
            <Route
              key={p.slug}
              path={`/${p.slug}`}
              element={
                <Provider theme={p.theme}>
                  <Component />
                </Provider>
              }
            />
          )
        })}
      </Routes>
    </HashRouter>
  )
}
