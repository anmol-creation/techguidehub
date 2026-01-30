import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/blog/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const isLoginPage = router.pathname === '/admin/login';

  if (isAdmin && !isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Component {...pageProps} />
        </main>
      </div>
    );
  }

  if (isLoginPage) {
     return <Component {...pageProps} />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
