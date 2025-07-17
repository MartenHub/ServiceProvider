import React from 'react';
import { MicroService } from '../../types';
import { Card } from '../ui/Card';
import { Database, Shield, Globe, Settings, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ServiceCardProps {
  service: MicroService;
  onEdit: (service: MicroService) => void;
  onDelete: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onEdit, 
  onDelete 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this service?')) {
      onDelete(service.id);
    }
  };

  return (
    <Card 
      hover 
      onClick={() => onEdit(service)}
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
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600">
            {service.template.name} ({service.template.language})
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">{service.database.type}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">{service.models.length} models</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">{service.routes.length} routes</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">{service.integrations.length} integrations</span>
          </div>
        </div>
      </div>
    </Card>
  );
};