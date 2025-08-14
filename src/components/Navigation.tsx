import Link from 'next/link';

export default function Navigation() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dog-parks', label: 'Dog Parks' },
    { href: '/nature-parks', label: 'Nature Parks' },
    { href: '/trails', label: 'Trails' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/events', label: 'Events' },
    { href: '/services', label: 'Services' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Boerne Handy Hub
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}