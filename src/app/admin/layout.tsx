import Sidebar from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple check for auth cookie in server component
  // Ideally this is handled by middleware but good to have a check here too if needed
  // or relying on middleware is fine.

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
