'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Testimonial>(
      'testimonials',
      (items) => {
        setTestimonials(items);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
      }, 5000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  const handlePrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
  };

  // Variants for animations
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <section className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What others have to say about my work and contributions.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials available at the moment.</p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden relative h-80 sm:h-64 rounded-lg">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={currentIndex}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="bg-white rounded-lg shadow-xl p-8 h-full flex flex-col justify-center">
                    <FaQuoteLeft className="text-indigo-200 mb-4 h-8 w-8" />
                    <blockquote className="text-gray-700 text-lg mb-6 italic">
                      {testimonials[currentIndex].content}
                    </blockquote>
                    <div className="flex items-center mt-auto">
                      {testimonials[currentIndex].imageUrl ? (
                        <div className="mr-4 relative overflow-hidden rounded-full h-12 w-12">
                          <Image 
                            src={testimonials[currentIndex].imageUrl} 
                            alt={testimonials[currentIndex].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mr-4 bg-indigo-100 rounded-full h-12 w-12 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-xl">
                            {testimonials[currentIndex].name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{testimonials[currentIndex].name}</p>
                        <p className="text-gray-500 text-sm">{testimonials[currentIndex].role} {testimonials[currentIndex].organization ? `at ${testimonials[currentIndex].organization}` : ''}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-0 right-0 px-4">
                <button 
                  onClick={handlePrev}
                  className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-indigo-600 focus:outline-none"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-indigo-600 focus:outline-none"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Dots for navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (intervalRef.current) clearInterval(intervalRef.current);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 w-2 rounded-full focus:outline-none ${
                      index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSlider; 