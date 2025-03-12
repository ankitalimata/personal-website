/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AboutMeItem } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaSwimmer, FaGuitar, FaCode, FaFlask, FaGraduationCap } from 'react-icons/fa';

export default function AboutPage() {
  const [aboutItems, setAboutItems] = useState<AboutMeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<AboutMeItem>(
      'aboutMe',
      (items) => {
        // Sort by order
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        setAboutItems(sortedItems);
        setLoading(false);
      },
      'order',
      'asc'
    );

    return () => unsubscribe();
  }, []);

  // For animation
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
      <section className="relative bg-indigo-900 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/contact-bg.jpg" 
            alt="About Ankit Dutta"
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
            About Me
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get to know Ankit Dutta, a 10th grade student passionate about swimming, guitar, coding, and STEM
          </motion.p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/profile.jpg"
                alt="Ankit Dutta"
                width={400}
                height={500}
                className="rounded-lg shadow-xl object-cover"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </motion.div>
            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Hello, I'm Ankit</h2>
              {loading ? (
                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
              ) : (
                <div className="text-gray-700 space-y-4">
                  {aboutItems
                    .filter(item => item.section === 'intro')
                    .map(item => (
                      <p key={item.id} className="text-lg">{item.content}</p>
                    ))}
                  {aboutItems.filter(item => item.section === 'intro').length === 0 && (
                    <p className="text-lg">
                      I'm a 10th grade student at Cameron Heights Collegiate Institute with a passion for learning
                      and personal growth. I'm enthusiastic about swimming, playing guitar, coding, and exploring
                      STEM fields.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">My Interests</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Here are some of the activities and fields I'm passionate about
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 text-center" 
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FaSwimmer className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Swimming</h3>
              <p className="text-gray-600">
                Competitive swimmer with the ROW Swim Team. Certified with Bronze Medallion, Bronze Cross, and National Lifeguard.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 text-center"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <FaGuitar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Guitar</h3>
              <p className="text-gray-600">
                Passionate guitarist with various certifications and experience in different musical styles.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 text-center"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <FaCode className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Coding</h3>
              <p className="text-gray-600">
                Enthusiastic about software development and programming. Active member of the Coding Club.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 text-center"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <FaFlask className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">STEM</h3>
              <p className="text-gray-600">
                Passionate about science, technology, engineering, and mathematics. Member of the STEM Club.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">My Education</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              My academic journey and achievements
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:w-1/4 flex justify-center">
              <div className="p-6 bg-indigo-100 rounded-full">
                <FaGraduationCap className="h-16 w-16 text-indigo-600" />
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-bold mb-1 text-gray-900">Cameron Heights Collegiate Institute</h3>
              <p className="text-lg text-indigo-600 mb-4">Grade 10 Student</p>
              <div className="text-gray-600 space-y-3">
                <p>
                  Currently maintaining strong academics with a focus on STEM subjects. 
                  Actively participating in extracurricular activities including the Swim Team, 
                  Coding Club, and STEM Club.
                </p>
                <p>
                  Developing skills in problem-solving, critical thinking, and collaboration
                  through both academic work and extracurricular involvement.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Future Goals</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              What I'm working towards and aspiring to achieve
            </p>
          </motion.div>

          {loading ? (
            <div className="animate-pulse h-40 bg-white rounded-lg"></div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-gray-700 space-y-4">
                {aboutItems
                  .filter(item => item.section === 'goals')
                  .map(item => (
                    <div key={item.id} className="mb-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  ))}
                {aboutItems.filter(item => item.section === 'goals').length === 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Short-term Goals</h3>
                    <p className="mb-6">
                      I'm working towards achieving higher certifications in swimming and guitar,
                      developing more advanced coding projects, and maintaining academic excellence.
                    </p>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Long-term Vision</h3>
                    <p>
                      I aspire to pursue higher education in a STEM field, potentially combining my
                      interests in technology and science. I aim to make meaningful contributions
                      to projects that have a positive impact on society.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Let's Connect!</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Feel free to reach out if you'd like to learn more about my interests, projects, 
              or potential collaborations.
            </p>
            <a href="/contact" className="bg-white text-indigo-700 hover:bg-indigo-50 transition-colors px-8 py-3 rounded-md font-medium inline-block">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 