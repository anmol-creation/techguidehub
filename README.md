# Professional Blog with Admin Panel

A modern, full-featured blog application built with Next.js, Tailwind CSS, and Supabase. This project includes a public-facing blog and a secure admin panel for managing posts.

## Features

- **Modern UI/UX**: Clean design with Inter font and a responsive layout.
- **Dark Mode**: Fully supported dark mode toggle.
- **Admin Panel**: Secure dashboard to create, edit, and delete posts.
- **Rich Text Editor**: Integrated TipTap editor for writing blog posts.
- **Image Upload**: Drag-and-drop image uploading powered by Supabase Storage.
- **Database**: PostgreSQL database managed by Supabase.
- **SEO Friendly**: Server-side rendering and optimized meta tags.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Heroicons](https://heroicons.com/)

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Supabase account and a new project.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

Create a `.env.local` file in the root directory and add the following environment variables. You can find these in your Supabase project settings.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password_here
```

> **Note**: The `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set here will be the credentials used to log in to the admin panel.

### Database Setup

1. Go to your Supabase project's SQL Editor.
2. Run the SQL scripts provided in the `supabase/` directory (e.g., `schema.sql`) to set up the required tables and policies.

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

To access the admin panel:
1. Navigate to `http://localhost:3000/admin`.
2. Log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you defined in your `.env.local` file.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to a Git repository.
2. Import the project into Vercel.
3. Add the environment variables listed above in the Vercel project settings.
4. Deploy!
