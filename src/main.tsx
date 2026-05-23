import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { getRouter } from './router'

const router = getRouter()

ReactDOM.createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={router.options.context.queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
)
