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
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            <Component {...pageProps} />
          </main>
        </div>
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
