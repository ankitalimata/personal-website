'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaCalendar, FaTag, FaClock } from 'react-icons/fa';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<BlogPost>(
      'blogPosts',
      (items) => {
        // Sort by publishedAt or date, newest first
        const sortedItems = [...items].sort((a, b) => {
          const dateA = a.publishedAt || a.date;
          const dateB = b.publishedAt || b.date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        setPosts(sortedItems);
        setFilteredPosts(sortedItems);
        
        // Extract unique categories from tags
        const allCategories = new Set<string>();
        sortedItems.forEach(post => {
          if (post.category) {
            allCategories.add(post.category);
          } else if (post.tags && post.tags.length > 0) {
            // Use first tag as category if no category specified
            allCategories.add(post.tags[0]);
          }
        });
        
        setCategories(Array.from(allCategories).sort());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter posts by category
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category === null) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.category === category || 
        (post.tags && post.tags.includes(category))
      );
      setFilteredPosts(filtered);
    }
  };

  // Format date to readable format
  const formatDate = (dateValue: string | Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString(undefined, options);
  };

  // Calculate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/blog-bg.jpg" 
            alt="Ankit Dutta's Blog"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Blog
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Thoughts, ideas, and insights on technology, STEM, and personal growth
          </motion.p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with Categories */}
            <div className="lg:w-1/4">
              <motion.div 
                className="sticky top-24 bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => filterByCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === null 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Posts
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => filterByCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Blog Posts */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No blog posts found</h3>
                  <p className="text-gray-500">
                    {selectedCategory 
                      ? `No posts in the ${selectedCategory} category were found.` 
                      : 'No blog posts available at the moment.'}
                  </p>
                  {selectedCategory && (
                    <button
                      onClick={() => filterByCategory(null)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View All Posts
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredPosts.map((post) => (
                    <motion.article 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {(post.coverImage || post.coverImageUrl || post.imageUrl) && (
                        <div className="relative h-64 w-full">
                          <Image
                            src={post.coverImage || post.coverImageUrl || post.imageUrl || ''}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                          <div className="flex items-center">
                            <FaCalendar className="mr-2" />
                            <span>{formatDate(post.publishedAt || post.date)}</span>
                          </div>
                          
                          {(post.category || (post.tags && post.tags.length > 0)) && (
                            <div className="flex items-center">
                              <FaTag className="mr-2" />
                              <span>{post.category || (post.tags && post.tags[0])}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <FaClock className="mr-2" />
                            <span>{getReadingTime(post.content)} min read</span>
                          </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">{post.title}</h2>
                        
                        <p className="text-gray-700 mb-4">
                          {post.excerpt || post.content.substring(0, 150)}
                          {!post.excerpt && post.content.length > 150 ? '...' : ''}
                        </p>
                        
                        <Link 
                          href={post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Read More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
              
              {/* Subscribe Section */}
              <motion.div 
                className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="mb-6">Subscribe to my newsletter to receive the latest blog posts and updates directly in your inbox.</p>
                
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-md flex-grow text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 