'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { File } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function GalleryPage() {
  const [images, setImages] = useState<File[]>([]);
  const [filteredImages, setFilteredImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<File>(
      'files',
      (items) => {
        // Filter only images
        const imageFiles = items.filter(item => item.type === 'image');
        // Sort by order
        const sortedItems = [...imageFiles].sort((a, b) => a.order - b.order);
        setImages(sortedItems);
        setFilteredImages(sortedItems);
        
        // Extract unique categories
        const allCategories = new Set<string>();
        sortedItems.forEach(image => {
          if (image.category) {
            allCategories.add(image.category);
          }
        });
        
        setCategories(Array.from(allCategories).sort());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter images by category and search query
  useEffect(() => {
    let filtered = images;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(image => 
        image.title.toLowerCase().includes(query) || 
        (image.description && image.description.toLowerCase().includes(query)) ||
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredImages(filtered);
  }, [selectedCategory, searchQuery, images]);

  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Open image modal
  const openImageModal = (image: File) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
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
      <section className="relative bg-purple-900 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/gallery-bg.jpg" 
            alt="Ankit Dutta's Gallery"
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
            My Gallery
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A collection of moments, achievements, and memories
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Controls */}
          <motion.div 
            className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Search */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center text-gray-700 mr-2">
                  <FaFilter className="mr-2" />
                  <span className="font-medium">Filter by:</span>
                </div>
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === null 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 aspect-square rounded-lg"></div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-500">
                {selectedCategory 
                  ? `No images in the ${selectedCategory} category were found.` 
                  : searchQuery 
                    ? `No images matching "${searchQuery}" were found.`
                    : 'No images available at the moment.'}
              </p>
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => openImageModal(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-end">
                    <div className="p-3 w-full text-white transform translate-y-full hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-sm font-medium truncate">{image.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-xl font-bold text-gray-900">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="mt-2 text-gray-700">{selectedImage.description}</p>
              )}
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
              onClick={closeImageModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 