'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-xl font-bold">Admin Panel</span>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 py-4 border-t border-gray-800">
           <Link
            href="/"
            target="_blank"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white mb-1"
          >
            <ExternalLink className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-white" />
            View Site
          </Link>
          <button
            onClick={() => {
              // Handle logout (e.g. call API to clear cookie)
              document.cookie = 'admin-auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              window.location.href = '/admin/login';
            }}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-white" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
