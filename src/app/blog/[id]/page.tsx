import { formatDate } from '@/utils/date';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogContent from '@/app/blog/[id]/BlogContent';
import { headers } from 'next/headers';
import type { BlogPost } from '@/types/blog';
import LikeButton from '@/components/LikeButton';
import { FaArrowLeft } from 'react-icons/fa';
import Comments from '@/components/Comments';

interface BlogPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getPost(id: string): Promise<BlogPost | undefined> {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process?.env?.NODE_ENV === 'development' ? 'http' : 'https';

    try {
        const res = await fetch(`${protocol}://${host}/api/posts?id=${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) return undefined;
        return res.json();
    } catch (error) {
        console.error('Error fetching post:', error);
        return undefined;
    }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.id);

    if (!post) {
        return {
            title: 'Post Bulunamadı',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function BlogPost({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.id);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen p-8 max-w-3xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors mb-8 group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Ana Sayfaya Dön
            </Link>

            <article className="mt-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                            <span>{post.author}</span>
                            <time>{formatDate(post.date)}</time>
                        </div>
                        <LikeButton postId={resolvedParams.id} />
                    </div>
                    {post.tags && (
                        <div className="flex gap-2 mt-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <BlogContent content={post.content} />

                <Comments postId={resolvedParams.id} />
            </article>
        </main>
    );
} 