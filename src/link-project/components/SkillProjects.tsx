import React from 'react';
import ExpandableCardContainer from './ExpandableCardContainer';
import { Skill } from '../../types';

interface SkillProjectsProps {
  skill: Skill;
}

const SkillProjects: React.FC<SkillProjectsProps> = ({ skill }) => {
  return <ExpandableCardContainer skill={skill} />;
};

export default SkillProjects;
