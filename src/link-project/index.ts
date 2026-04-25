/**
 * Projects Page Module
 *
 * This module contains the dedicated Projects page which displays all portfolio projects
 * organized by skills. It provides a clean, professional interface for showcasing work.
 *
 * Structure:
 * - Projects.tsx: Main page component with skill filtering
 * - components/SkillProjects.tsx: Renders projects for a selected skill
 * - components/ProjectCard.tsx: Individual project card component
 * - components/ProjectDetailModal.tsx: Detailed view modal for project information
 *
 * Data Flow:
 * Projects page fetches skills from data.ts and displays them as filter tabs.
 * Selecting a skill triggers SkillProjects component to render projects for that skill.
 * Clicking a project opens ProjectDetailModal with full project details.
 *
 * Scalability:
 * To add new projects, simply update the projects array in data.ts under the relevant skill.
 * The page will automatically display them without code changes.
 *
 * To add new skills, add a new Skill object to SKILLS_DATA in data.ts.
 * The page will automatically create a new filter tab for the skill.
 */

export { default as Projects } from './Projects';
export { default as SkillProjects } from './components/SkillProjects';
export { default as ProjectCard } from './components/ProjectCard';
export { default as ProjectDetailModal } from './components/ProjectDetailModal';
