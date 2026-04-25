export interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  imageUrl: string;
  videoUrl?: string; // Optional: YouTube embed URL atau local video path
  aspectRatio?: string; // e.g., "16:9", "4:5", "1:1", "9:16" - default is "16:9"
  logo?: string;
  link?: string;
  downloadUrl?: string; // Optional: path to a downloadable file under public/
  downloadName?: string; // Optional: suggested filename for download
}

export interface Skill {
  id: string;
  name: string;
  icon?: string; // SVG path or Lucide name (optional now)
  imageUrl?: string; // Optional image URL for glass background effect
  color: string;
  projects: Project[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  skills: string[];
  type: 'full-time' | 'freelance' | 'internship' | 'project';
}
