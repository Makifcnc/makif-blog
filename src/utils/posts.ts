import { BlogPost } from '@/types/blog';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAllPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${baseUrl}/api/posts`, { next: { revalidate: 60 } });
    const data = await response.json();
    return data.posts;
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
    const response = await fetch(`${baseUrl}/api/posts?id=${id}`, { next: { revalidate: 60 } });
    if (!response.ok) return undefined;
    return response.json();
}

export async function getAllTags(): Promise<string[]> {
    const response = await fetch(`${baseUrl}/api/posts`, { next: { revalidate: 60 } });
    const data = await response.json();
    return data.tags;
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const response = await fetch(`${baseUrl}/api/posts?tag=${encodeURIComponent(tag)}`, { next: { revalidate: 60 } });
    return response.json();
} 