'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Achievement } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaTrophy, FaFilter, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Achievement>(
      'achievements',
      (items) => {
        // Sort by date, newest first
        const sortedItems = [...items].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setAchievements(sortedItems);
        setFilteredAchievements(sortedItems);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter achievements by category
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category === null) {
      setFilteredAchievements(achievements);
    } else {
      const filtered = achievements.filter(achievement => achievement.category === category);
      setFilteredAchievements(filtered);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'swimming':
        return '🏊‍♂️';
      case 'guitar':
        return '🎸';
      case 'academic':
        return '🎓';
      default:
        return '🏆';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-amber-900 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/achievements-bg.jpg" 
            alt="Ankit Dutta's Achievements"
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
            My Achievements
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Awards, recognitions, and milestones from my journey
          </motion.p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-gray-700 mr-2">
                <FaFilter className="mr-2" />
                <span className="font-medium">Filter by:</span>
              </div>
              <button
                onClick={() => filterByCategory(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === null 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {['swimming', 'guitar', 'academic', 'other'].map(category => (
                <button 
                  key={category}
                  onClick={() => filterByCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Achievements Timeline */}
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse flex">
                  <div className="h-16 w-16 rounded-full bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No achievements found</h3>
              <p className="text-gray-500">
                {selectedCategory 
                  ? `No achievements in the ${selectedCategory} category were found.` 
                  : 'No achievements available at the moment.'}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => filterByCategory(null)}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  View All Achievements
                </button>
              )}
            </div>
          ) : (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  className="relative pl-8 sm:pl-32 py-6 group"
                >
                  {/* Timeline line */}
                  <div className="hidden sm:block absolute top-0 bottom-0 left-0 w-20 border-r-2 border-amber-200"></div>
                  
                  {/* Date bubble */}
                  <div className="absolute left-0 sm:left-16 p-2 transform -translate-x-1/2 sm:-translate-x-1/2 bg-amber-100 rounded-full border-4 border-white shadow">
                    <span className="text-xl">{getCategoryIcon(achievement.category)}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(achievement.date.toString())}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <FaBuilding className="mr-2" />
                      <span>{achievement.issuer}</span>
                    </div>
                    
                    <p className="text-gray-700">{achievement.description}</p>
                    
                    {achievement.imageUrl && (
                      <div className="mt-4 relative h-48 sm:h-64 rounded-lg overflow-hidden">
                        <Image
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        achievement.category === 'swimming' ? 'bg-blue-100 text-blue-800' :
                        achievement.category === 'guitar' ? 'bg-purple-100 text-purple-800' :
                        achievement.category === 'academic' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <FaTrophy className="mr-1" />
                        {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Inspirational Quote */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <blockquote className="text-xl italic text-gray-700 mb-4">
              &ldquo;Success is not final, failure is not fatal: It is the courage to continue that counts.&rdquo;
            </blockquote>
            <p className="text-gray-500">— Winston Churchill</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 