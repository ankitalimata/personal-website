'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { format } from 'date-fns';

const RecentBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<BlogPost>(
      'blogPosts',
      (items) => {
        // Sort by published date (most recent first) and take the most recent 3
        const sortedPosts = [...items].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.date).getTime();
          const dateB = new Date(b.publishedAt || b.date).getTime();
          return dateB - dateA;
        }).slice(0, 3);
        
        setPosts(sortedPosts);
        setLoading(false);
      },
      'publishedAt',
      'desc',
      3
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return '';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Blog Posts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thoughts, insights, and updates on my journey through swimming, music, and tech.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
              >
                {post.imageUrl && (
                  <div className="relative h-48">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-2">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-500 mb-3 text-sm">
                      {formatDate(post.publishedAt || post.date)}
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-auto"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-transparent rounded-md font-medium hover:bg-indigo-600 hover:text-white transition-colors"
          >
            View All Blog Posts
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogPosts; 