import React from 'react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Calendar, Code, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onOpen, 
  onDelete 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  return (
    <Card 
      hover 
      onClick={() => onOpen(project)}
      className="p-6 relative group"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
          {project.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {project.description || 'No description provided'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Code className="w-4 h-4" />
            <span>{project.services.length} services</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};