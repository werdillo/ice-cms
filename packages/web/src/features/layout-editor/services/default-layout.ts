import { type Lang, type Layout } from '@ice-cms/schemas'

export function makeDefaultLayout(lang: Lang): Layout {
  return {
    header: {
      lang,
      buttonText: 'Contact us',
      buttonHref: '/contact',
    },
    footer: {
      logo: {
        href: '/',
        ariaLabel: 'Go to homepage',
        className: 'footer-logo',
      },
      mainNavigation: {
        links: [
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
          { href: '/contact', label: 'Contact' },
        ],
        ariaLabel: 'Footer main navigation',
      },
      newsletter: {
        enabled: true,
        emailInputId: `newsletter-email-${lang}`,
        emailPlaceholder: 'Enter your email',
        buttonText: 'Subscribe',
        ariaLabel: 'Newsletter subscription',
      },
      copyright: {
        siteName: 'Ice CMS',
        siteUrl: 'https://ice-cms.local',
      },
      legalLinks: {
        links: [
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/terms', label: 'Terms of Service' },
        ],
        ariaLabel: 'Legal links',
      },
      ariaLabel: 'Footer',
    },
    sidebar: {
      links: [
        { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
        { href: '/pages', label: 'Pages', icon: 'FileText' },
        { href: '/settings', label: 'Settings', icon: 'Settings' },
      ],
      ariaLabel: 'Sidebar navigation',
    },
  }
}

export function makeDefaultLayouts(): Partial<Record<Lang, Layout>> {
  return {
    lv: makeDefaultLayout('lv'),
    en: makeDefaultLayout('en'),
    ru: makeDefaultLayout('ru'),
  }
}
