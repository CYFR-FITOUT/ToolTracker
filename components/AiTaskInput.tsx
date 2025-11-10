
import React, { useState } from 'react';
import { Tool } from '../types';
import { parseToolFromNaturalLanguage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface AiToolInputProps {
  onAddTool: (newTool: Omit<Tool, 'id' | 'status'>) => void;
}

const AiToolInput: React.FC<AiToolInputProps> = ({ onAddTool }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newTool = await parseToolFromNaturalLanguage(prompt);
      onAddTool(newTool);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full">
          <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Log new hammer drill inv #H78-B, assign to Dave at the North Site'"
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Parsing...
            </>
          ) : (
            'Add Tool with AI'
          )}
        </button>
      </form>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default AiToolInput;
