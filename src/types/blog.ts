export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    author: string;
    tags?: string[];
} 