import React, { useState, useEffect, useMemo } from 'react';
import { Tool, ToolStatus } from './types';
import ToolColumn from './components/TaskColumn';
import AiToolInput from './components/AiTaskInput';
import ToolModal from './components/TaskModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { translations, Language } from './i18n';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const t = useMemo(() => translations[language], [language]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tools');
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error("Failed to fetch tools", error);
      }
    };
    fetchTools();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const addTool = async (newToolData: Omit<Tool, 'id' | 'status'>) => {
    try {
      const response = await fetch('http://localhost:3001/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newToolData, status: ToolStatus.InStock }),
      });
      const newTool = await response.json();
      setTools(prev => [newTool, ...prev]);
    } catch (error) {
      console.error("Failed to add tool", error);
    }
  };

  const updateTool = async (updatedTool: Tool) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tools/${updatedTool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTool),
      });
      const updated = await response.json();
      setTools(prev => prev.map(tool => (tool.id === updated.id ? updated : tool)));
      closeModal();
    } catch (error) {
      console.error("Failed to update tool", error);
    }
  };

  const deleteTool = async (toolId: string) => {
    try {
      await fetch(`http://localhost:3001/api/tools/${toolId}`, {
        method: 'DELETE',
      });
      setTools(prev => prev.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error("Failed to delete tool", error);
    }
  };

  const moveTool = async (toolId: string, newStatus: ToolStatus) => {
    const toolToMove = tools.find(tool => tool.id === toolId);
    if (!toolToMove) return;

    const updatedTool = { ...toolToMove, status: newStatus };

    try {
      await fetch(`http://localhost:3001/api/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTool),
      });
      setTools(prev => prev.map(tool => (tool.id === toolId ? updatedTool : tool)));
    } catch (error) {
      console.error("Failed to move tool", error);
    }
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

  const handleSaveTool = async (toolData: Omit<Tool, 'id' | 'status'> & { status?: ToolStatus }) => {
    if (editingTool) {
        await updateTool({ ...editingTool, ...toolData });
    } else {
        await addTool(toolData);
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
