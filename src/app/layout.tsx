import Navbar from '@/components/blog/Navbar';
import './globals.css';

export const metadata = {
  title: 'Modern Blog',
  description: 'A beautiful, modern blog built with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
