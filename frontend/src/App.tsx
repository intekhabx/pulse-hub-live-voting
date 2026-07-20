import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({ routeTree })


function App() {
  return <RouterProvider router={router} />
}

export default App;
