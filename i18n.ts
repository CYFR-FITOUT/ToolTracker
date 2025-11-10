import { ToolStatus } from './types';

export const translations = {
  en: {
    appTitle: 'ToolTracker AI',
    appSubtitle: 'Intelligent tool tracking for your job site.',
    addToolWithAI: 'Add Tool with AI',
    addToolManually: 'Add Tool Manually',
    aiInputPlaceholder: "e.g., 'Log new hammer drill inv #H78-B, assign to Dave at the North Site'",
    parsing: 'Parsing...',
    geminiError: 'Failed to understand the tool details. Please try phrasing it differently.',
    columnTitles: {
      [ToolStatus.InStock]: 'In Stock',
      [ToolStatus.Issued]: 'Issued',
      [ToolStatus.InRepair]: 'In Repair',
    },
    noToolsHere: 'No tools here.',
    holderLabel: 'Holder:',
    locationLabel: 'Location:',
    modalEditTitle: 'Edit Tool',
    modalCreateTitle: 'Create New Tool',
    modalToolNameLabel: 'Tool Name',
    modalInventoryCodeLabel: 'Inventory Code',
    modalDescriptionLabel: 'Description',
    modalHolderLabel: 'Assigned To (Holder)',
    modalLocationLabel: 'Location',
    modalStatusLabel: 'Status',
    cancel: 'Cancel',
    save: 'Save',
    geminiSystemInstruction: `You are a tool management assistant for a construction company. Your role is to parse user input into a structured JSON tool object. Extract the tool's name, its unique inventory code, a description if provided, and who it's assigned to (currentHolder) and where it is (currentLocation).`
  },
  ru: {
    appTitle: 'Трекер Инструментов AI',
    appSubtitle: 'Интеллектуальный учет инструментов на вашем объекте.',
    addToolWithAI: 'Добавить через AI',
    addToolManually: 'Добавить вручную',
    aiInputPlaceholder: "напр., 'Новый перфоратор, инв. #П-105, выдать Ивану на объект 'Центр''",
    parsing: 'Анализ...',
    geminiError: 'Не удалось распознать детали. Попробуйте перефразировать запрос.',
    columnTitles: {
      [ToolStatus.InStock]: 'На складе',
      [ToolStatus.Issued]: 'Выдано',
      [ToolStatus.InRepair]: 'В ремонте',
    },
    noToolsHere: 'Здесь нет инструментов.',
    holderLabel: 'У кого:',
    locationLabel: 'Где:',
    modalEditTitle: 'Редактировать',
    modalCreateTitle: 'Добавить инструмент',
    modalToolNameLabel: 'Название',
    modalInventoryCodeLabel: 'Инвентарный номер',
    modalDescriptionLabel: 'Описание',
    modalHolderLabel: 'Ответственный',
    modalLocationLabel: 'Местоположение',
    modalStatusLabel: 'Статус',
    cancel: 'Отмена',
    save: 'Сохранить',
    geminiSystemInstruction: `Ты — ассистент по учету инструментов в строительной компании. Твоя задача — преобразовать запрос пользователя в структурированный JSON-объект. Извлеки название инструмента, его уникальный инвентарный номер, описание (если есть), кому он выдан (currentHolder) и где находится (currentLocation).`
  },
};

export type Language = keyof typeof translations;
