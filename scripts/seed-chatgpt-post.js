
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const post = {
  title: 'The Rise of ChatGPT and Generative AI',
  slug: 'chatgpt-and-generative-ai',
  excerpt: 'Explore how ChatGPT is revolutionizing the way we interact with technology and what it means for the future of generative AI.',
  content: `
    <h2>Introduction</h2>
    <p>In recent years, Artificial Intelligence (AI) has made significant strides, but few developments have captured the public's imagination quite like <strong>ChatGPT</strong>. Developed by OpenAI, ChatGPT represents a major leap forward in natural language processing and generative AI.</p>

    <h2>What is ChatGPT?</h2>
    <p>ChatGPT is a large language model trained on a massive dataset of text. It uses a transformer architecture to understand and generate human-like text based on the input it receives. Unlike traditional chatbots that rely on pre-programmed responses, ChatGPT can generate novel responses, write code, compose essays, and even create poetry.</p>

    <h2>The Impact on Industries</h2>
    <p>The applications of ChatGPT are vast. In customer service, it can provide instant, accurate support. In software development, it acts as a coding companion, helping developers debug and write code faster. Content creators use it to brainstorm ideas and draft articles.</p>
    <ul>
      <li><strong>Education:</strong> Personalized tutoring and learning assistance.</li>
      <li><strong>Healthcare:</strong> Assisting in medical documentation and patient communication.</li>
      <li><strong>Creative Arts:</strong> Generating art prompts, scripts, and musical compositions.</li>
    </ul>

    <h2>Ethical Considerations</h2>
    <p>With great power comes great responsibility. The rise of generative AI raises questions about copyright, misinformation, and job displacement. It is crucial for developers and policymakers to address these challenges to ensure AI benefits society as a whole.</p>

    <h2>Conclusion</h2>
    <p>ChatGPT is just the beginning. As generative AI continues to evolve, it will undoubtedly reshape our world in ways we can only begin to imagine. Embracing this technology while being mindful of its implications is key to navigating the future of AI.</p>
  `,
  cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000', // A generic AI image URL
  published: true,
  published_at: new Date().toISOString(),
  category: 'Artificial Intelligence',
  tags: ['AI', 'ChatGPT', 'Technology', 'Generative AI'],
  reading_time: 5
};

async function seed() {
  console.log('Seeding post: ' + post.title);

  // Check if post exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', post.slug)
    .single();

  if (existingPost) {
    console.log('Post already exists. Updating...');
    const { error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', existingPost.id);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      console.log('Post updated successfully.');
    }
  } else {
    console.log('Creating new post...');
    const { error } = await supabase
      .from('posts')
      .insert([post]);

    if (error) {
      console.error('Error creating post:', error);
    } else {
      console.log('Post created successfully.');
    }
  }
}

seed();
