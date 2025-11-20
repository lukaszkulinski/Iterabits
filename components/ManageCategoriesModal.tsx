
import React, { useState } from 'react';
import { X, Trash2, Save, Edit2 } from 'lucide-react';
import { Category } from '../types';
import { Language, translations } from '../translations';
import { AVAILABLE_COLORS } from '../constants';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  language: Language;
  onUpdate: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ 
  isOpen, onClose, categories, language, onUpdate, onDelete 
}) => {
  const t = translations[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  if (!isOpen) return null;

  // Filter only user custom categories
  const customCategories = categories.filter(c => !c.is_default);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdate(editingId, editName, editColor);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.deleteCategoryConfirm)) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">{t.manageCategories}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {customCategories.length === 0 && (
             <p className="text-center text-slate-500 py-4 italic">No custom categories found.</p>
          )}

          {customCategories.map(cat => (
            <div key={cat.id} className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
              {editingId === cat.id ? (
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <div className="grid grid-cols-9 gap-2">
                      {AVAILABLE_COLORS.map((c) => (
                         <button
                           key={c.name}
                           onClick={() => setEditColor(c.name)}
                           className={`w-6 h-6 rounded-full ${c.bg.replace('/20', '')} ${editColor === c.name ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                         />
                      ))}
                   </div>
                   <div className="flex justify-end gap-2 mt-2">
                      <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600">Cancel</button>
                      <button onClick={saveEdit} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1">
                        <Save className="w-3 h-3" /> Save
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-4 h-4 rounded-full ${AVAILABLE_COLORS.find(c => c.name === cat.color)?.bg.replace('/20', '')}`} />
                     <span className="text-slate-200 font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <button onClick={() => startEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;
