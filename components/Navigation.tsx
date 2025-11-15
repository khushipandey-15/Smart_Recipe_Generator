'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Home, Sparkles } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md mb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-600 dark:text-orange-400">
            <ChefHat className="w-8 h-8" />
            <span className="hidden sm:inline">Smart Recipe Generator</span>
            <span className="sm:hidden">Recipes</span>
          </Link>

          <div className="flex gap-2">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
