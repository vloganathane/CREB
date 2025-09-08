import React, { useState } from 'react';
import { Play, BookOpen, ChevronRight } from 'lucide-react';
import { examples, getExamplesByDifficulty } from '../examples';

interface ExamplesGalleryProps {
  onLoadExample: (code: string) => void;
}

const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({ onLoadExample }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];
  
  const filteredExamples = selectedDifficulty === 'all' 
    ? examples 
    : getExamplesByDifficulty(selectedDifficulty);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-orange-500/20 text-orange-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Examples Gallery</h2>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredExamples.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No examples found for the selected difficulty.</p>
          </div>
        ) : (
          filteredExamples.map((example) => (
            <div
              key={example.id}
              className="border border-gray-700 rounded-lg bg-gray-800/50 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{example.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{example.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyBadge(example.difficulty)}`}>
                      {example.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setExpandedExample(
                        expandedExample === example.id ? null : example.id
                      )}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      title="View code"
                    >
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${
                          expandedExample === example.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    <button
                      onClick={() => onLoadExample(example.code)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                      title="Run example"
                    >
                      <Play size={14} />
                      Run
                    </button>
                  </div>
                </div>
              </div>
              
              {expandedExample === example.id && (
                <div className="border-t border-gray-700 bg-gray-900/50">
                  <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamplesGallery;
