import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div>
      <PostForm />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const authCookie = req.cookies['admin-auth'];

  if (!authCookie || authCookie !== 'true') {
     return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
