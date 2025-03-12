'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Achievement } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { format } from 'date-fns';

const FeaturedAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Achievement>(
      'achievements',
      (items) => {
        setAchievements(items.slice(0, 4)); // Get top 4 achievements
        setLoading(false);
      },
      'order',
      'asc',
      4
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return '';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, 'MMMM yyyy');
  };

  // Categories with corresponding colors
  const categoryColors = {
    'swimming': 'bg-blue-100 text-blue-800',
    'guitar': 'bg-purple-100 text-purple-800',
    'academic': 'bg-green-100 text-green-800',
    'other': 'bg-gray-100 text-gray-800'
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Some of my notable certifications and accomplishments in swimming, guitar, and academics.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No achievements available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
              >
                {achievement.imageUrl && (
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{achievement.title}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColors[achievement.category as keyof typeof categoryColors] || categoryColors.other}`}>
                      {achievement.category}
                    </span>
                  </div>
                  <p className="text-gray-500 mb-2">
                    <span className="font-medium">{achievement.issuer}</span> • {formatDate(achievement.date)}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/achievements"
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-transparent rounded-md font-medium hover:bg-indigo-600 hover:text-white transition-colors"
          >
            View All Achievements
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAchievements; 