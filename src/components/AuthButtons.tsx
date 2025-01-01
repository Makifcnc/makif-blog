'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthButtons() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex gap-2">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }

    if (session?.user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300">
                    {session.user.name || session.user.email}
                </span>
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                    Çıkış Yap
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
            >
                Giriş Yap
            </Link>
            <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
                Kaydol
            </Link>
        </div>
    );
} 