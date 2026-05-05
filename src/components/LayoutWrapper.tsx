'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import CommunityFloatingButton from './CommunityFloatingButton';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should NOT show the main Navigation and Footer
const STANDALONE_ROUTES = ['/site/'];

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current route should be standalone (no nav/footer)
  const isStandalone = STANDALONE_ROUTES.some(route => pathname.startsWith(route));

  if (isStandalone) {
    // Business websites get their own clean layout - no HandyHub chrome
    return <>{children}</>;
  }

  // Normal HandyHub pages get full navigation and footer
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CommunityFloatingButton />
    </>
  );
}
