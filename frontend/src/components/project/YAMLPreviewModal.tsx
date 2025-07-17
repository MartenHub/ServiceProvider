import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Project } from '../../types';
import { generateYAMLConfig } from '../../utils/yamlGenerator';
import { Download, Copy, Check } from 'lucide-react';

interface YAMLPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const YAMLPreviewModal: React.FC<YAMLPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  project 
}) => {
  const [currentTab, setCurrentTab] = useState<'docker' | 'kubernetes' | 'env'>('docker');
  const [copied, setCopied] = useState(false);
  
  const yamlConfig = generateYAMLConfig(project);

  const tabs = [
    { id: 'docker', label: 'Docker Compose', content: yamlConfig.dockerCompose },
    { id: 'kubernetes', label: 'Kubernetes', content: yamlConfig.kubernetes },
    { id: 'env', label: 'Environment', content: yamlConfig.environment },
  ];

  const currentContent = tabs.find(tab => tab.id === currentTab)?.content || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${project.name}-${currentTab}.yml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generated YAML Configuration" size="xl">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm text-gray-100 whitespace-pre-wrap">
            {currentContent}
          </pre>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};