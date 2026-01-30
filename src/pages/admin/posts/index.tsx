import { getAllPostsAdmin, Post } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Calendar, FileText } from 'lucide-react';

export default function PostsPage({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">All Posts</h1>
           <p className="text-slate-400 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/posts/new">
          <a className="btn-primary flex items-center gap-2">
             <Plus size={18} />
             New Post
          </a>
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
         <div className="divide-y divide-slate-800">
          {posts.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
              <div className="flex-1 min-w-0 pr-4">
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <a className="text-lg font-medium text-slate-200 hover:text-blue-400 transition-colors block mb-1">{post.title}</a>
                </Link>
                <div className="flex items-center text-sm text-slate-500 gap-3">
                   <div className="flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                   </div>
                   {post.category && (
                      <div className="flex items-center">
                         <span className="w-1 h-1 rounded-full bg-slate-600 mr-3"></span>
                         {post.category}
                      </div>
                   )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                 <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                    post.published
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                 }`}>
                    {post.published ? 'Published' : 'Draft'}
                 </span>
                 <Link href={`/admin/posts/${post.id}/edit`}>
                    <a className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">Edit</a>
                 </Link>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-12 text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                  <FileText className="text-slate-500" size={32} />
               </div>
               <h3 className="text-lg font-medium text-slate-300">No posts yet</h3>
               <p className="text-slate-500 mt-1 mb-6">Get started by creating your first post.</p>
               <Link href="/admin/posts/new">
                  <a className="btn-primary inline-flex items-center gap-2">
                     <Plus size={18} />
                     Create Post
                  </a>
               </Link>
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
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const posts = await getAllPostsAdmin();
  return { props: { posts } };
}
