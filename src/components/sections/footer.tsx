import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

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
      <div className="site-container site-border border-t overflow-hidden lg:px-0 md:px-4 py-20">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center justify-between">
            <div className="flex ">
              {' '}
              <div className="w-24 h-8 bg-gray-200 rounded" aria-label="Logo" />
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

            <div className="h-[1px] w-full bg-black mt-6 mb-4" />
            <div>
              <div className="flex items-center justify-center gap-6">
                <p className="text-12-regular text-muted-foreground">
                  © 2024 Relume. All rights reserved.
                </p>

                {LEGAL_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-12-regular text-muted-foreground no-underline hover:text-primary transition-colors duration-250"
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
  )
}

export { Footer }
