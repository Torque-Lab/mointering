import Link from 'next/link';
import { MonitorIcon } from '../../ui-icons/MonitorIcon';
import { TwitterIcon } from '../../ui-icons/social-icons/TwitterIcon';
import { GitHubIcon } from '../../ui-icons/social-icons/GitHubIcon';
import { LinkedinIcon } from '../../ui-icons/social-icons/LinkedinIcon';
import { DiscordIcon } from '../../ui-icons/social-icons/DiscordIcon';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Updates', href: '/updates' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press', href: '#press' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Guides', href: '#guides' },
      { name: 'Help Center', href: '#help' },
      { name: 'API Status', href: '#status' },
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: <TwitterIcon /> },
    { name: 'GitHub', href: '#', icon: <GitHubIcon /> },
    { name: 'LinkedIn', href: '#', icon: <LinkedinIcon /> },
    { name: 'Discord', href: '#', icon: <DiscordIcon /> },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and tagline */}
          <div className="space-y-4 xl:col-span-1">
            <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <MonitorIcon />
              <span className="text-xl font-bold text-gray-900">SiteWatch</span>
            </div>
            </Link>
            <p className="text-gray-500 text-base">
              Monitor your websites with confidence. Get instant alerts when something goes wrong.
            </p>
            <div className="flex space-x-6 mt-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label={item.name}
                >
                  <span className="text-2xl">{item.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} SiteWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}