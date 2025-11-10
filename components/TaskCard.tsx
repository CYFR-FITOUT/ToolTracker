import React from 'react';
import { Tool, ToolStatus } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { translations } from '../i18n';

interface ToolCardProps {
  tool: Tool;
  onDelete: (id: string) => void;
  onEdit: (tool: Tool) => void;
  onMove: (id: string, newStatus: ToolStatus) => void;
  t: typeof translations.en;
}

const statusBorderColor: Record<ToolStatus, string> = {
    [ToolStatus.InStock]: 'border-l-4 border-blue-500',
    [ToolStatus.Issued]: 'border-l-4 border-yellow-500',
    [ToolStatus.InRepair]: 'border-l-4 border-orange-500',
};


const ToolCard: React.FC<ToolCardProps> = ({ tool, onDelete, onEdit, onMove, t }) => {
  const { id, name, description, status, inventoryCode, currentHolder, currentLocation } = tool;

  const handleMove = (direction: 'forward' | 'backward') => {
    if (direction === 'forward') {
      if (status === ToolStatus.InStock) onMove(id, ToolStatus.Issued);
      else if (status === ToolStatus.Issued) onMove(id, ToolStatus.InRepair);
    } else {
      if (status === ToolStatus.InRepair) onMove(id, ToolStatus.Issued);
      else if (status === ToolStatus.Issued) onMove(id, ToolStatus.InStock);
    }
  };

  return (
    <div className={`bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer transition-shadow hover:shadow-xl ${statusBorderColor[status]}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-100 pr-2">{name}</h3>
        <div className={`text-xs font-mono px-2 py-1 rounded bg-gray-600 text-gray-300`}>
          {inventoryCode}
        </div>
      </div>
      {description && <p className="text-gray-400 text-sm my-2">{description}</p>}
      
      <div className="text-sm text-gray-300 mt-2 space-y-1">
        {currentHolder && <div><span className="font-semibold text-gray-400">{t.holderLabel}</span> {currentHolder}</div>}
        {currentLocation && <div><span className="font-semibold text-gray-400">{t.locationLabel}</span> {currentLocation}</div>}
      </div>

      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-600">
        <div className="flex gap-2">
          {status !== ToolStatus.InStock && <button onClick={() => handleMove('backward')} className="text-gray-400 hover:text-white">&larr;</button>}
          {status !== ToolStatus.InRepair && <button onClick={() => handleMove('forward')} className="text-gray-400 hover:text-white">&rarr;</button>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(tool)} className="text-gray-400 hover:text-blue-400 transition-colors">
            <EditIcon />
          </button>
          <button onClick={() => onDelete(id)} className="text-gray-400 hover:text-red-400 transition-colors">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
