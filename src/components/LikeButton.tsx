'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        fetchLikeStatus();
    }, [postId]);

    const fetchLikeStatus = async () => {
        try {
            const res = await fetch(`/api/posts/like?postId=${postId}`);
            const data = await res.json();
            setLiked(data.userLiked);
            setLikesCount(data.likesCount);
        } catch (error) {
            console.error('Beğeni durumu alınamadı:', error);
        }
    };

    const handleLike = async () => {
        if (!session) {
            router.push('/auth/login');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/posts/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();

            if (res.ok) {
                setLiked(data.liked);
                setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Beğeni hatası:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${liked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            aria-label={liked ? 'Beğeniyi kaldır' : 'Beğen'}
        >
            <FaHeart className={`${liked ? 'fill-current' : 'stroke-current fill-none'} ${isLoading ? 'animate-pulse' : ''
                }`} />
            <span>{likesCount}</span>
        </button>
    );
} 