export const metadata = {
  title: 'About - Modern Blog',
  description: 'About this blog',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">About Us</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>
          Welcome to our modern blog platform. We are dedicated to sharing insightful stories,
          tutorials, and thoughts on the latest trends in technology and design.
        </p>
        <p>
          Our mission is to provide high-quality content that educates and inspires.
          Whether you are a developer, designer, or just a tech enthusiast, you will find
          something valuable here.
        </p>
        <h2>The Tech Stack</h2>
        <p>
          This blog is built with the latest web technologies:
        </p>
        <ul>
          <li>Next.js 14+ (App Router)</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Supabase (PostgreSQL & Storage)</li>
        </ul>
      </div>
    </div>
  );
}
