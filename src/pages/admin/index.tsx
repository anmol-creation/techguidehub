import { getAllPostsAdmin, Post } from '@/lib/supabase';
import Link from 'next/link';
import { FileText, CheckCircle, Edit3, Plus, Calendar } from 'lucide-react';

interface DashboardProps {
  posts: Post[];
}

export default function AdminDashboard({ posts }: DashboardProps) {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const drafts = totalPosts - publishedPosts;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
           <p className="text-slate-400 mt-1">Overview of your blog&apos;s performance</p>
        </div>
         <Link href="/admin/posts/new">
           <a className="btn-primary flex items-center gap-2">
             <Plus size={18} />
             New Post
           </a>
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
             <div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Posts</h3>
                <p className="text-3xl font-bold mt-2 text-white">{totalPosts}</p>
             </div>
             <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="text-blue-400" size={24} />
             </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </div>

        <div className="admin-card p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
             <div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Published</h3>
                <p className="text-3xl font-bold mt-2 text-white">{publishedPosts}</p>
             </div>
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="text-emerald-400" size={24} />
             </div>
          </div>
           <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
        </div>

        <div className="admin-card p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
             <div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Drafts</h3>
                <p className="text-3xl font-bold mt-2 text-white">{drafts}</p>
             </div>
             <div className="p-2 bg-amber-500/10 rounded-lg">
                <Edit3 className="text-amber-400" size={24} />
             </div>
          </div>
           <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-lg text-white">Recent Posts</h3>
          <Link href="/admin/posts">
            <a className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View All
            </a>
          </Link>
        </div>
        <div className="divide-y divide-slate-800">
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
              <div className="flex-1 min-w-0 pr-4">
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <a className="font-medium text-slate-200 hover:text-blue-400 transition-colors truncate block">
                    {post.title}
                  </a>
                </Link>
                <div className="flex items-center mt-1 text-xs text-slate-500">
                   <Calendar size={12} className="mr-1.5" />
                   {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                post.published
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              <p>No posts found. Start writing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const authCookie = req.cookies['admin-auth'];

  if (!authCookie || authCookie !== 'true') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const posts = await getAllPostsAdmin();

  return {
    props: { posts },
  };
}
