import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MicroService, ServiceTemplate, DatabaseConfig, DataModel, JWTConfig, RouteConfig, ServiceIntegration } from '../../types';
import { serviceTemplates } from '../../data/templates';

interface ServiceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: MicroService) => void;
  service?: MicroService;
}

export const ServiceConfigModal: React.FC<ServiceConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  service 
}) => {
  const [formData, setFormData] = useState<Partial<MicroService>>({
    name: '',
    template: serviceTemplates[0],
    database: {
      type: 'postgresql',
      connectionUrl: '',
      name: ''
    },
    models: [],
    jwt: {
      secret: '',
      expiration: '7d',
      algorithm: 'HS256'
    },
    routes: [],
    integrations: []
  });

  const [currentTab, setCurrentTab] = useState<'basic' | 'database' | 'models' | 'routes' | 'integrations'>('basic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        template: serviceTemplates[0],
        database: {
          type: 'postgresql',
          connectionUrl: '',
          name: ''
        },
        models: [],
        jwt: {
          secret: generateJWTSecret(),
          expiration: '7d',
          algorithm: 'HS256'
        },
        routes: [],
        integrations: []
      });
    }
  }, [service, isOpen]);

  const generateJWTSecret = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const newService: MicroService = {
        id: service?.id || Date.now().toString(),
        name: formData.name!,
        template: formData.template!,
        database: formData.database!,
        models: formData.models!,
        jwt: formData.jwt!,
        routes: formData.routes!,
        integrations: formData.integrations!,
      };
      
      await onSave(newService);
      onClose();
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'database', label: 'Database' },
    { id: 'models', label: 'Models' },
    { id: 'routes', label: 'Routes' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Create Service'} size="xl">
      <div className="space-y-6">
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

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {currentTab === 'basic' && (
            <div className="space-y-4">
              <Input
                label="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter service name"
                required
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Template
                </label>
                <select
                  value={formData.template?.id}
                  onChange={(e) => {
                    const template = serviceTemplates.find(t => t.id === e.target.value);
                    setFormData({ ...formData, template });
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {serviceTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.language} - {template.framework})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentTab === 'database' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Database Type
                </label>
                <select
                  value={formData.database?.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    database: { ...formData.database!, type: e.target.value as any }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="mysql">MySQL</option>
                  <option value="redis">Redis</option>
                </select>
              </div>
              
              <Input
                label="Database Name"
                value={formData.database?.name}
                onChange={(e) => setFormData({
                  ...formData,
                  database: { ...formData.database!, name: e.target.value }
                })}
                placeholder="Enter database name"
              />
              
              <Input
                label="Connection URL"
                value={formData.database?.connectionUrl}
                onChange={(e) => setFormData({
                  ...formData,
                  database: { ...formData.database!, connectionUrl: e.target.value }
                })}
                placeholder="Enter database connection URL"
                type="password"
              />
            </div>
          )}

          {currentTab === 'models' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Data Models</h4>
                <Button
                  onClick={() => {
                    const newModel: DataModel = {
                      id: Date.now().toString(),
                      name: 'NewModel',
                      fields: [],
                      roles: ['user']
                    };
                    setFormData({
                      ...formData,
                      models: [...(formData.models || []), newModel]
                    });
                  }}
                  size="sm"
                >
                  Add Model
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.models?.map((model, index) => (
                  <div key={model.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Input
                        value={model.name}
                        onChange={(e) => {
                          const updatedModels = [...(formData.models || [])];
                          updatedModels[index] = { ...model, name: e.target.value };
                          setFormData({ ...formData, models: updatedModels });
                        }}
                        placeholder="Model name"
                        className="text-lg font-medium"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const updatedModels = formData.models?.filter(m => m.id !== model.id);
                          setFormData({ ...formData, models: updatedModels });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {model.fields.length} fields, {model.roles.length} roles
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'routes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">API Routes</h4>
                <Button
                  onClick={() => {
                    const newRoute: RouteConfig = {
                      id: Date.now().toString(),
                      path: '/api/new-endpoint',
                      method: 'GET',
                      middlewares: [],
                      handler: 'newHandler'
                    };
                    setFormData({
                      ...formData,
                      routes: [...(formData.routes || []), newRoute]
                    });
                  }}
                  size="sm"
                >
                  Add Route
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.routes?.map((route, index) => (
                  <div key={route.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <select
                        value={route.method}
                        onChange={(e) => {
                          const updatedRoutes = [...(formData.routes || [])];
                          updatedRoutes[index] = { ...route, method: e.target.value as any };
                          setFormData({ ...formData, routes: updatedRoutes });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                      
                      <Input
                        value={route.path}
                        onChange={(e) => {
                          const updatedRoutes = [...(formData.routes || [])];
                          updatedRoutes[index] = { ...route, path: e.target.value };
                          setFormData({ ...formData, routes: updatedRoutes });
                        }}
                        placeholder="/api/endpoint"
                      />
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const updatedRoutes = formData.routes?.filter(r => r.id !== route.id);
                          setFormData({ ...formData, routes: updatedRoutes });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'integrations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Service Integrations</h4>
                <Button
                  onClick={() => {
                    const newIntegration: ServiceIntegration = {
                      id: Date.now().toString(),
                      name: 'New Integration',
                      url: '',
                      type: 'external'
                    };
                    setFormData({
                      ...formData,
                      integrations: [...(formData.integrations || []), newIntegration]
                    });
                  }}
                  size="sm"
                >
                  Add Integration
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.integrations?.map((integration, index) => (
                  <div key={integration.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Input
                        value={integration.name}
                        onChange={(e) => {
                          const updated = [...(formData.integrations || [])];
                          updated[index] = { ...integration, name: e.target.value };
                          setFormData({ ...formData, integrations: updated });
                        }}
                        placeholder="Integration name"
                      />
                      
                      <select
                        value={integration.type}
                        onChange={(e) => {
                          const updated = [...(formData.integrations || [])];
                          updated[index] = { ...integration, type: e.target.value as any };
                          setFormData({ ...formData, integrations: updated });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="internal">Internal</option>
                        <option value="external">External</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-4">
                      <Input
                        value={integration.url}
                        onChange={(e) => {
                          const updated = [...(formData.integrations || [])];
                          updated[index] = { ...integration, url: e.target.value };
                          setFormData({ ...formData, integrations: updated });
                        }}
                        placeholder="Service URL"
                        className="flex-1"
                      />
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const updated = formData.integrations?.filter(i => i.id !== integration.id);
                          setFormData({ ...formData, integrations: updated });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {service ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};