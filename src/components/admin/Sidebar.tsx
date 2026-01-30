import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, FileText, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = router.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg leading-none">T</span>
             </div>
             <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
               TechGuideHub Admin
             </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 ml-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    )}
                  >
                    <item.icon className={cn("mr-2 h-4 w-4", isActive ? "text-blue-400" : "text-slate-400")} />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
             <Link href="/">
                <a className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-2 transition-colors cursor-pointer group">
                   <ExternalLink size={16} className="group-hover:text-blue-400 transition-colors" />
                   View Site
                </a>
             </Link>
             <div className="h-6 w-px bg-slate-800"></div>
             <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/admin/login';
                }}
                className="btn-danger-outline flex items-center"
              >
                <LogOut className="mr-2 h-3 w-3" />
                Logout
              </button>
          </div>

           {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 absolute w-full left-0 shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigation.map((item) => {
               const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
               return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      'block px-3 py-3 rounded-lg text-base font-medium flex items-center mb-1',
                      isActive ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
               );
            })}
             <div className="border-t border-slate-800 my-2 pt-2">
                 <Link href="/">
                    <a className="block px-3 py-3 rounded-lg text-base font-medium text-slate-400 hover:bg-slate-800 hover:text-white flex items-center cursor-pointer">
                       <ExternalLink className="mr-3 h-5 w-5" />
                       View Site
                    </a>
                 </Link>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/admin/login';
                    }}
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 flex items-center mt-1"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
             </div>
          </div>
        </div>
      )}
    </header>
  );
}
