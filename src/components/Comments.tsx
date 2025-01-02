'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/utils/date';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
    };
}

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/posts/comments?postId=${postId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Yorumları getirme hatası:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            alert('Yorum yapmak için giriş yapmanız gerekiyor');
            return;
        }
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/posts/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    content: newComment,
                }),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Yorum gönderme hatası:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Yorumlar</h2>

            {/* Yorum formu */}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={session ? "Yorumunuzu yazın..." : "Yorum yapmak için giriş yapın"}
                    disabled={!session || isLoading}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-800 mb-2"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={!session || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
            </form>

            {/* Yorumlar listesi */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold">{comment.user.name || 'Anonim'}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </p>
                )}
            </div>
        </div>
    );
} 