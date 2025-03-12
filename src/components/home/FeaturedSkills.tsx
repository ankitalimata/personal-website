'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skill } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaTrophy, FaGuitar, FaCode, FaGraduationCap, FaAward } from 'react-icons/fa';

const FeaturedSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Skill>(
      'skills',
      (items) => {
        // Sort by proficiency (highest first)
        const sortedSkills = [...items].sort((a, b) => b.proficiency - a.proficiency).slice(0, 6);
        setSkills(sortedSkills);
        setLoading(false);
      },
      'proficiency',
      'desc',
      6
    );

    return () => unsubscribe();
  }, []);

  // Category icons mapping
  const categoryIcons = {
    'swimming': <FaTrophy className="h-6 w-6" />,
    'guitar': <FaGuitar className="h-6 w-6" />,
    'coding': <FaCode className="h-6 w-6" />,
    'academic': <FaGraduationCap className="h-6 w-6" />,
    'other': <FaAward className="h-6 w-6" />
  };

  // Category colors mapping
  const categoryColors = {
    'swimming': 'bg-blue-500',
    'guitar': 'bg-purple-500',
    'coding': 'bg-green-500',
    'academic': 'bg-yellow-500',
    'other': 'bg-gray-500'
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A showcase of my abilities across swimming, guitar, coding, and academics.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No skills available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 text-white ${categoryColors[skill.category as keyof typeof categoryColors] || categoryColors.other}`}>
                      {categoryIcons[skill.category as keyof typeof categoryIcons] || categoryIcons.other}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{skill.category}</p>
                    </div>
                  </div>
                  
                  {/* Proficiency Bar */}
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Proficiency</span>
                      <span className="text-sm font-medium text-gray-700">{skill.proficiency}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${categoryColors[skill.category as keyof typeof categoryColors] || categoryColors.other}`}
                        style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {skill.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{skill.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/skills"
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-transparent rounded-md font-medium hover:bg-indigo-600 hover:text-white transition-colors"
          >
            View All Skills
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSkills; 