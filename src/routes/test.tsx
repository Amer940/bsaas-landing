import { supabase } from '#/lib/supabase'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  // loader: async () => {
  //   const { data, error } = await supabase.functions.invoke('hello-world', {
  //     body: { name: 'Ovo je test!' },
  //   })
  //   if (error) throw error
  //   return data
  // },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const handleBuyCTA = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      navigate({ to: '/' })
    } else {
      navigate({ to: '/register', search: { redirect: 'checkout' } })
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto py-[96px]">
      <div>
        <button
          className="bg-black rounded-sm text-white px-8 py-2"
          onClick={handleBuyCTA}
        >
          Kupi nismo skupi
        </button>
      </div>
    </div>
  )
}
