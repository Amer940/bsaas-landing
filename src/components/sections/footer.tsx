import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import Logo from '../../images/brat..svg'

const FOOTER_LINKS = [
  { label: 'Kako radi', href: '#kako-radi' },
  { label: 'Kupi', href: '#kupi' },
  { label: 'Pitanja', href: '#pitanja' },
]

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookies Settings', href: '#' },
]

function Footer() {
  return (
    <div className="w-full md:px-4 px-2">
      <div className="site-container site-border border-t overflow-hidden lg:px-0 md:px-4 md:py-20 py-[48px]">
        <div className="md:px-10 px-[12px]">
          <div className="flex flex-col items-center justify-between">
            <div className="flex w-full md:flex-row flex-col md:justify-between items-center justify-center md:gap-0 gap-12">
              {' '}
              <img
                className="w-17.5 h-9 rounded"
                aria-label="Logo"
                src={Logo}
              />
              <ul className="flex items-center gap-4 list-none m-0 p-0">
                {FOOTER_LINKS.map((link) => (
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
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-muted-foreground hover:text-primary transition-colors duration-250"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-muted-foreground/20 mt-6 md:mb-4 mb-6" />
            <div>
              <div className="flex items-center justify-center md:gap-6 gap-8 md:flex-row flex-col">
                <p className="md:text-12-regular text-14-regular text-muted-foreground md:order-1 order-2">
                  © 2024 Relume. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-6 md:flex-row flex-col md:order-2 order-1">
                  {LEGAL_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="md:text-12-regular text-14-regular text-muted-foreground no-underline hover:text-primary transition-colors duration-250 underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Footer }
