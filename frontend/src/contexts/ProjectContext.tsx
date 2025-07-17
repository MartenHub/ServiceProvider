import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, MicroService } from '../types';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  createProject: (name: string, description: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addServiceToProject: (projectId: string, service: MicroService) => Promise<void>;
  updateService: (projectId: string, serviceId: string, updates: Partial<MicroService>) => Promise<void>;
  removeService: (projectId: string, serviceId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const createProject = async (name: string, description: string): Promise<Project> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      userId: '1', // Would come from auth context
      services: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
    
    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  };

  const deleteProject = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProjects(prev => prev.filter(project => project.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addServiceToProject = async (projectId: string, service: MicroService) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? { ...project, services: [...project.services, service], updatedAt: new Date().toISOString() }
        : project
    ));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        services: [...prev.services, service],
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const updateService = async (projectId: string, serviceId: string, updates: Partial<MicroService>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            services: project.services.map(service => 
              service.id === serviceId ? { ...service, ...updates } : service
            ),
            updatedAt: new Date().toISOString()
          }
        : project
    ));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        services: prev.services.map(service => 
          service.id === serviceId ? { ...service, ...updates } : service
        ),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const removeService = async (projectId: string, serviceId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            services: project.services.filter(service => service.id !== serviceId),
            updatedAt: new Date().toISOString()
          }
        : project
    ));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        services: prev.services.filter(service => service.id !== serviceId),
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject,
      addServiceToProject,
      updateService,
      removeService,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};