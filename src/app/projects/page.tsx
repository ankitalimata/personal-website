'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '@/lib/types/interfaces';
import { subscribeToCollection } from '@/lib/firebase/firestore';
import { FaGithub, FaExternalLinkAlt, FaFilter } from 'react-icons/fa';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Project>(
      'projects',
      (items) => {
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        setProjects(sortedItems);
        setFilteredProjects(sortedItems);
        
        // Extract all unique technologies
        const allTechnologies = new Set<string>();
        sortedItems.forEach(project => {
          project.technologies.forEach(tech => {
            allTechnologies.add(tech);
          });
        });
        
        setAvailableTechnologies(Array.from(allTechnologies).sort());
        setLoading(false);
      },
      'order',
      'asc'
    );

    return () => unsubscribe();
  }, []);

  // Filter projects by technology
  const filterByTechnology = (tech: string | null) => {
    setSelectedTech(tech);
    
    if (tech === null) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.technologies.includes(tech)
      );
      setFilteredProjects(filtered);
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
      <section className="relative bg-indigo-900 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/gallery-bg.jpg" 
            alt="Ankit Dutta's Projects"
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
            My Projects
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Exploring coding, STEM, and other creative endeavors
          </motion.p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter controls */}
          {availableTechnologies.length > 0 && (
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center text-gray-700 mr-2">
                  <FaFilter className="mr-2" />
                  <span className="font-medium">Filter by:</span>
                </div>
                <button
                  onClick={() => filterByTechnology(null)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTech === null 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                {availableTechnologies.map(tech => (
                  <button 
                    key={tech}
                    onClick={() => filterByTechnology(tech)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTech === tech 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
              <p className="text-gray-500">
                {selectedTech 
                  ? `No projects using ${selectedTech} were found. Try a different filter.` 
                  : 'No projects available at the moment.'}
              </p>
              {selectedTech && (
                <button
                  onClick={() => filterByTechnology(null)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View All Projects
                </button>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300"
                >
                  {project.imageUrl ? (
                    <div className="relative h-48">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image available</span>
                    </div>
                  )}

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 text-xs rounded-md ${
                              tech === selectedTech
                                ? 'bg-indigo-100 text-indigo-800 font-medium'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label={`GitHub repository for ${project.title}`}
                        >
                          <FaGithub className="h-5 w-5" />
                        </a>
                      )}
                      
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label={`Live demo for ${project.title}`}
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </a>
                      )}
                      
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Interested in Collaborating?</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              I am always open to working on exciting new projects or collaborating with others on
              interesting initiatives. If you have an idea or project you would like to discuss,
              I would love to hear from you.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 