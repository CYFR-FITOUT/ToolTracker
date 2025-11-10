import React from 'react';
import { Tool, ToolStatus } from '../types';
import ToolCard from './TaskCard';
import { translations } from '../i18n';

interface ToolColumnProps {
  title: string;
  status: ToolStatus;
  tools: Tool[];
  onDeleteTool: (toolId: string) => void;
  onEditTool: (tool: Tool) => void;
  onMoveTool: (toolId: string, newStatus: ToolStatus) => void;
  t: typeof translations.en;
}

const statusColorMap: Record<ToolStatus, string> = {
  [ToolStatus.InStock]: 'border-blue-500',
  [ToolStatus.Issued]: 'border-yellow-500',
  [ToolStatus.InRepair]: 'border-orange-500',
};

const ToolColumn: React.FC<ToolColumnProps> = ({ title, status, tools, onDeleteTool, onEditTool, onMoveTool, t }) => {
  return (
    <div className={`bg-gray-800/60 rounded-xl p-4 min-h-[300px] flex flex-col border-t-4 ${statusColorMap[status]}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-bold text-lg`}>{title}</h2>
        <span className="bg-gray-700 text-gray-300 text-sm font-semibold px-2 py-1 rounded-full">
          {tools.length}
        </span>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow">
        {tools.length > 0 ? (
          tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onDelete={onDeleteTool} 
              onEdit={onEditTool} 
              onMove={onMoveTool}
              t={t}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>{t.noToolsHere}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolColumn;
