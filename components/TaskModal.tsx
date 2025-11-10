import React, { useState, useEffect } from 'react';
import { Tool, ToolStatus } from '../types';
import { translations } from '../i18n';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: Omit<Tool, 'id'>) => void;
  toolToEdit: Tool | null;
  t: typeof translations.en;
}

const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onSave, toolToEdit, t }) => {
  const [name, setName] = useState('');
  const [inventoryCode, setInventoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ToolStatus>(ToolStatus.InStock);
  const [currentHolder, setCurrentHolder] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');


  useEffect(() => {
    if (toolToEdit) {
      setName(toolToEdit.name);
      setInventoryCode(toolToEdit.inventoryCode);
      setDescription(toolToEdit.description || '');
      setStatus(toolToEdit.status);
      setCurrentHolder(toolToEdit.currentHolder || '');
      setCurrentLocation(toolToEdit.currentLocation || '');
    } else {
      // Reset form for new tool
      setName('');
      setInventoryCode('');
      setDescription('');
      setStatus(ToolStatus.InStock);
      setCurrentHolder('');
      setCurrentLocation('');
    }
  }, [toolToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inventoryCode.trim()) return;
    onSave({ name, inventoryCode, description, status, currentHolder, currentLocation });
  };

  if (!isOpen) return null;

  const localizedStatusOptions = [
    { value: ToolStatus.InStock, label: t.columnTitles[ToolStatus.InStock] },
    { value: ToolStatus.Issued, label: t.columnTitles[ToolStatus.Issued] },
    { value: ToolStatus.InRepair, label: t.columnTitles[ToolStatus.InRepair] },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md m-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">{toolToEdit ? t.modalEditTitle : t.modalCreateTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t.modalToolNameLabel}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
            </div>
             <div className="col-span-2 sm:col-span-1">
              <label htmlFor="inventoryCode" className="block text-sm font-medium text-gray-300 mb-1">{t.modalInventoryCodeLabel}</label>
              <input
                id="inventoryCode"
                type="text"
                value={inventoryCode}
                onChange={(e) => setInventoryCode(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">{t.modalDescriptionLabel}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="currentHolder" className="block text-sm font-medium text-gray-300 mb-1">{t.modalHolderLabel}</label>
              <input id="currentHolder" type="text" value={currentHolder} onChange={(e) => setCurrentHolder(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
             <div>
              <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-300 mb-1">{t.modalLocationLabel}</label>
              <input id="currentLocation" type="text" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div className="col-span-1 sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">{t.modalStatusLabel}</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ToolStatus)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none">
                    {localizedStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition">{t.cancel}</button>
            <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md transition">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolModal;
