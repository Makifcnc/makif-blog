'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import AuthButtons from './AuthButtons';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src="/cyber-logo.png"
                            alt="Blog Logo"
                            width={40}
                            height={40}
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
                        Blog
                    </span>
                </Link>
                <AuthButtons />
            </div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Mehmet Akif ÇİNİCİ
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                    Software Developer | XR Developer | Product - Designer
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="https://github.com/Makifcnc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaGithub size={24} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mehmet-akif-cinici/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaLinkedin size={24} />
                    </a>
                </div>
            </div>
        </header>
    );
} 