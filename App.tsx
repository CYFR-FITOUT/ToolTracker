import React, { useState, useEffect, useMemo } from 'react';
import { Tool, ToolStatus } from './types';
import ToolColumn from './components/TaskColumn';
import AiToolInput from './components/AiTaskInput';
import ToolModal from './components/TaskModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { translations, Language } from './i18n';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const savedTools = localStorage.getItem('tools');
      return savedTools ? JSON.parse(savedTools) : [];
    } catch (error) {
      console.error("Could not parse tools from localStorage", error);
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const t = useMemo(() => translations[language], [language]);

  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const addTool = (newToolData: Omit<Tool, 'id' | 'status'>) => {
    const toolToAdd: Tool = {
      ...newToolData,
      id: `tool-${Date.now()}-${Math.random()}`,
      status: ToolStatus.InStock,
    };
    setTools(prev => [toolToAdd, ...prev]);
  };

  const updateTool = (updatedTool: Tool) => {
    setTools(prev => prev.map(tool => (tool.id === updatedTool.id ? updatedTool : tool)));
    closeModal();
  };

  const deleteTool = (toolId: string) => {
    setTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  const moveTool = (toolId: string, newStatus: ToolStatus) => {
    setTools(prev => prev.map(tool => (tool.id === toolId ? { ...tool, status: newStatus } : tool)));
  };

  const openModalForEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };
  
  const openModalForCreate = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const handleSaveTool = (toolData: Omit<Tool, 'id'>) => {
    if (editingTool) {
      updateTool({ ...toolData, id: editingTool.id });
    } else {
        const newTool: Tool = {
            ...toolData,
            id: `tool-${Date.now()}`
        };
        setTools(prev => [newTool, ...prev]);
    }
    closeModal();
  };
  
  const columns = useMemo(() => {
    return [
      { status: ToolStatus.InStock, title: t.columnTitles[ToolStatus.InStock] },
      { status: ToolStatus.Issued, title: t.columnTitles[ToolStatus.Issued] },
      { status: ToolStatus.InRepair, title: t.columnTitles[ToolStatus.InRepair] },
    ];
  }, [t]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8 relative">
        <div className="absolute top-0 right-0 flex gap-2">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-md ${language === 'en' ? 'bg-yellow-600 text-white font-bold' : 'bg-gray-700 text-gray-300'}`}>EN</button>
            <button onClick={() => setLanguage('ru')} className={`px-3 py-1 text-sm rounded-md ${language === 'ru' ? 'bg-yellow-600 text-white font-bold' : 'bg-gray-700 text-gray-300'}`}>RU</button>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          {t.appTitle}
        </h1>
        <p className="text-gray-400 mt-2">{t.appSubtitle}</p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg">
           <AiToolInput onAddTool={addTool} t={t} lang={language} />
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openModalForCreate}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md transition-transform transform hover:scale-105 shadow-lg"
          >
            <PlusIcon />
            {t.addToolManually}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map(({ status, title }) => (
            <ToolColumn
              key={status}
              title={title}
              status={status}
              tools={tools.filter(tool => tool.status === status)}
              onDeleteTool={deleteTool}
              onEditTool={openModalForEdit}
              onMoveTool={moveTool}
              t={t}
            />
          ))}
        </div>
      </main>
       <ToolModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTool}
        toolToEdit={editingTool}
        t={t}
      />
    </div>
  );
};

export default App;
