import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProjects } from './contexts/ProjectContext';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetail';
import { Project } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { setCurrentProject } = useProjects();
  const [currentView, setCurrentView] = useState<'dashboard' | 'project'>('dashboard');

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('project');
  };

  const handleBackToDashboard = () => {
    setCurrentProject(null);
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard onOpenProject={handleOpenProject} />
      )}
      {currentView === 'project' && (
        <ProjectDetail onBack={handleBackToDashboard} />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;