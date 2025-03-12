/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import FeaturedAchievements from '@/components/home/FeaturedAchievements';
import RecentBlogPosts from '@/components/home/RecentBlogPosts';
import FeaturedSkills from '@/components/home/FeaturedSkills';
import TestimonialSlider from '@/components/home/TestimonialSlider';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants for staggered animations
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
    <>
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center text-white">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg" // You'll need to add this image
            alt="Ankit Dutta"
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Hi, I'm <span className="text-indigo-400">Ankit Dutta</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Grade 10 student passionate about swimming, guitar, coding, and STEM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about" className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-3 rounded-md font-medium">
                Learn More
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-900 transition-colors px-6 py-3 rounded-md font-medium">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* About Overview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="md:w-1/2">
              <Image
                src="/images/profile.jpg" // You'll need to add this image
                alt="Ankit Dutta"
                width={500}
                height={500}
                className="rounded-lg shadow-xl object-cover"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">About Me</h2>
              <p className="text-gray-700 mb-6 text-lg">
                I'm a grade 10 student at Cameron Heights Collegiate Institute with a passion for learning and growth. 
                I divide my time between competitive swimming with the ROW Swim Team, playing guitar, and exploring various 
                aspects of coding and STEM fields.
              </p>
              <Link href="/about" className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
                Read more about me
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Achievements Highlights */}
      <FeaturedAchievements />

      {/* Recent Blog Posts */}
      <RecentBlogPosts />

      {/* Skills Overview */}
      <FeaturedSkills />

      {/* Testimonials Section */}
      <TestimonialSlider />

      {/* Call to Action */}
      <section className="py-20 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Interested in Connecting?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Feel free to reach out if you'd like to collaborate, have questions, or just want to say hello!
            </p>
            <Link href="/contact" className="bg-white text-indigo-700 hover:bg-gray-100 transition-colors px-8 py-3 rounded-md font-medium inline-block">
              Contact Me
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
