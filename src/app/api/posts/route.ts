import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import { NextResponse } from 'next/server';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

async function getAllPosts(): Promise<BlogPost[]> {
    const fileNames = await fs.readdir(postsDirectory);
    const allPosts = await Promise.all(
        fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(async fileName => {
                const fullPath = path.join(postsDirectory, fileName);
                const fileContents = await fs.readFile(fullPath, 'utf8');
                const { data, content } = matter(fileContents);

                return {
                    id: data.id,
                    title: data.title,
                    excerpt: data.excerpt,
                    date: data.date,
                    author: data.author,
                    content: content,
                    tags: data.tags || [],
                } as BlogPost;
            })
    );

    return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const id = searchParams.get('id');

    try {
        const posts = await getAllPosts();

        if (id) {
            const post = posts.find(p => p.id === id);
            if (!post) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json(post);
        }

        if (tag) {
            const filteredPosts = posts.filter(post => post.tags?.includes(tag));
            return NextResponse.json(filteredPosts);
        }

        const tags = new Set<string>();
        posts.forEach(post => {
            post.tags?.forEach(tag => tags.add(tag));
        });

        return NextResponse.json({
            posts,
            tags: Array.from(tags).sort()
        });
    } catch (error) {
        console.error('Error reading posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 