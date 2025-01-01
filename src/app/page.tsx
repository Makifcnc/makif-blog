import Link from 'next/link';
import { formatDate } from '@/utils/date';
import Header from '@/components/Header';
import { headers } from 'next/headers';
import { BlogPost } from '@/types/blog';
import PostLikeButton from '@/components/PostLikeButton';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getData(searchParams: { [key: string]: string | string[] | undefined }) {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process?.env?.NODE_ENV === 'development' ? 'http' : 'https';

  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined;
  const url = tag
    ? `${protocol}://${host}/api/posts?tag=${encodeURIComponent(tag)}`
    : `${protocol}://${host}/api/posts`;

  try {
    const res = await fetch(url, {
      cache: 'no-store'
    });
    const data = await res.json();

    // Beğeni sayılarını al
    const postsWithLikes = await Promise.all(
      (tag ? data : data.posts).map(async (post: BlogPost) => {
        const likeRes = await fetch(
          `${protocol}://${host}/api/posts/like?postId=${post.id}`,
          { cache: 'no-store' }
        );
        const likeData = await likeRes.json();
        return {
          ...post,
          likesCount: likeData.likesCount
        };
      })
    );

    return {
      posts: postsWithLikes,
      tags: tag ? [] : data.tags,
      currentTag: tag
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { posts: [], tags: [], currentTag: undefined };
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const { posts, tags, currentTag } = await getData(resolvedParams);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="flex gap-8">
          {/* Blog posts */}
          <div className="flex-grow space-y-8">
            {posts.map((post: BlogPost & { likesCount: number }) => (
              <article key={post.id} className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-800">
                <div className="relative">
                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  </Link>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex gap-4">
                      <span>{post.author}</span>
                      <time>{formatDate(post.date)}</time>
                    </div>
                    <PostLikeButton postId={post.id} initialLikesCount={post.likesCount} />
                  </div>
                </div>
              </article>
            ))}
            {posts.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {currentTag ? 'Bu etikete ait gönderi bulunamadı.' : 'Henüz gönderi bulunmuyor.'}
              </p>
            )}
          </div>

          {/* Tags sidebar */}
          <div className="w-64 shrink-0">
            <div className="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Etiketler</h2>
              <div className="space-y-2">
                <Link
                  href="/"
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!currentTag
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Tümü
                </Link>
                {tags.map((t: string) => (
                  <Link
                    key={t}
                    href={`/?tag=${encodeURIComponent(t)}`}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${currentTag === t
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
