import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { supabase } from '#/lib/supabase'
import { FieldInfo } from '#/components/ui/field-info'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      })
      if (error) {
        alert(error.message) // or set an error state to display in the UI
        return
      }
      console.log('Uspjesan login')
      // redirect to login or dashboard
      navigate({ to: '/' })
    },
  })

  return (
    <div className="max-w-[1440px] w-full mx-auto py-[96px] ">
      <div className="flex items-center justify-center gap-8 flex-col">
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="max-w-[800px] w-full flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="flex flex-col gap-4 w-full"
          >
            <div className="flex flex-col gap-2">
              {/* A type-safe field component*/}
              <form.Field
                name="email"
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <label htmlFor={field.name}>Email:</label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        className="border border-black rounded-sm p-2"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {/* A type-safe field component*/}
              <form.Field
                name="password"
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <label htmlFor={field.name}>Password:</label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="password"
                        onBlur={field.handleBlur}
                        className="border border-black rounded-sm p-2"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )
                }}
              />
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <div className="mt-1 flex flex-col w-full gap-2">
                  <button
                    className="p-2 bg-black text-white"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? '...' : 'Submit'}
                  </button>
                  <button
                    type="reset"
                    onClick={(e) => {
                      // Avoid unexpected resets of form elements (especially <select> elements)
                      e.preventDefault()
                      form.reset()
                    }}
                  >
                    Reset
                  </button>
                  <span>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                  </span>
                </div>
              )}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
