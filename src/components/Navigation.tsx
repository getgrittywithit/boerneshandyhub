import Link from 'next/link';

export default function Navigation() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/weddings', label: 'Weddings & Events', highlight: true },
    { href: '/dining', label: 'Dining' },
    { href: '/stay-play', label: 'Stay & Play' },
    { href: '/shopping', label: 'Shopping' },
    { href: '/outdoor', label: 'Outdoor Adventures' },
    { href: '/services', label: 'Professional Services' },
    { href: '/about', label: 'About Boerne' },
  ];

  return (
    <nav className="bg-boerne-navy shadow-lg border-b border-boerne-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-boerne-gold hover:text-boerne-gold-alt transition-colors">
                Boerne Handy Hub
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    item.highlight 
                      ? 'text-boerne-gold hover:text-boerne-gold-alt border-b-2 border-boerne-gold' 
                      : 'text-boerne-white hover:text-boerne-gold'
                  }`}
                >
                  {item.label}
                  {item.highlight && <span className="ml-1">💍</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}