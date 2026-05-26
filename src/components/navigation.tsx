import { Button } from './ui/button'
import { Container } from './container'
import { cn } from '#/lib/utils.ts'
import Logo from '../images/brat..svg'

const NAV_LINKS = [
  { label: 'Kako radi', href: '#kako-radi' },
  { label: 'Pitanja', href: '#pitanja' },
  { label: 'Kupi', href: '#kupi' },
]

interface NavbarProps {
  className?: string
}

function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn('sticky top-0 left-0 right-0 z-50 bg-white', className)}
    >
      <div className="border-b border-border">
        <Container className="flex items-center justify-between py-6">
          <a href="/" aria-label="Početna">
            <img src={Logo} />
          </a>
          <div className="flex items-center">
            <ul className="flex items-center gap-4 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-14-medium text-muted-foreground no-underline hover:text-primary transition-colors duration-250"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pl-6">
              <Button variant="default">Zapocni danas</Button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}

export { Navbar }
