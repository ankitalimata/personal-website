// Common base interface for all items
export interface BaseItem {
  id: string;
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Project interface
export interface Project extends BaseItem {
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

// Blog Post interface
export interface BlogPost extends BaseItem {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  slug?: string;
  date: Date | string;
  publishedDate?: Date | string;
  publishedAt?: Date | string;
  published?: boolean;
  updatedAt?: Date | string;
}

// Achievement interface
export interface Achievement extends BaseItem {
  title: string;
  description: string;
  date: Date | string;
  issuer: string;
  imageUrl?: string;
  category: 'swimming' | 'guitar' | 'academic' | 'other';
}

// Extracurricular interface
export interface Extracurricular extends BaseItem {
  title: string;
  organization: string;
  role: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string; // Optional for ongoing activities
  imageUrl?: string;
  category: 'swimming' | 'guitar' | 'coding' | 'stem' | 'other';
}

// File interface
export interface File extends BaseItem {
  title: string;
  description?: string;
  url: string;
  type: 'image' | 'document' | 'other';
  category?: string;
  tags?: string[];
}

// About Me item interface
export interface AboutMeItem extends BaseItem {
  title: string;
  content: string;
  section: 'intro' | 'bio' | 'interests' | 'goals' | 'other';
}

// Collaboration interface
export interface Collaboration extends BaseItem {
  title: string;
  partnerId: string;
  partnerName: string;
  description: string;
  imageUrl?: string;
  startDate: Date | string;
  endDate?: Date | string;
  projectUrl?: string;
}

// Work Experience interface
export interface WorkExperience extends BaseItem {
  company: string;
  position: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string;
  location?: string;
  skills?: string[];
  imageUrl?: string;
}

// Volunteering interface
export interface Volunteering extends BaseItem {
  organization: string;
  role: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string;
  location?: string;
  imageUrl?: string;
  hours?: number;
}

// Education interface
export interface Education extends BaseItem {
  institution: string;
  degree?: string;
  field?: string;
  startDate: Date | string;
  endDate?: Date | string;
  grade?: string;
  description?: string;
  achievements?: string[];
}

// Contact interface
export interface Contact extends BaseItem {
  name: string;
  email: string;
  message: string;
  date: Date | string;
  responded: boolean;
}

// Testimonial interface
export interface Testimonial extends BaseItem {
  name: string;
  role: string;
  content: string;
  imageUrl?: string;
  organization?: string;
}

// Skill interface
export interface Skill extends BaseItem {
  name: string;
  category: 'swimming' | 'guitar' | 'coding' | 'academic' | 'other';
  proficiency: number; // 1-5 scale
  description?: string;
  icon?: string;
}

// FAQ interface
export interface FAQ extends BaseItem {
  question: string;
  answer: string;
  category?: string;
} 