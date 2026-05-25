import { supabase } from '#/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  loader: async () => {
    const { data, error } = await supabase.functions.invoke('hello-world', {
      body: { name: 'Ovo je test!' },
    })
    if (error) throw error
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/test"!</div>
}
