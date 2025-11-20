
import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronLeft, Settings, Save } from 'lucide-react';
import { Category, Habit } from '../types';
import { Language, translations } from '../translations';
import { supabase } from '../services/supabaseClient';
import { AVAILABLE_COLORS } from '../constants';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, categoryId: string) => void;
  onUpdate: (id: string, title: string, categoryId: string) => void;
  language: Language;
  categories: Category[];
  onCategoryCreated: () => void;
  onManageCategories: () => void;
  initialHabit?: Habit | null; // If present, we are in Edit mode
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ 
  isOpen, onClose, onAdd, onUpdate, language, categories, onCategoryCreated, onManageCategories, initialHabit 
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  
  // Custom category state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('blue');

  // Reset or populate fields on open
  useEffect(() => {
    if (isOpen) {
      if (initialHabit) {
        // Edit Mode
        setTitle(initialHabit.title);
        // Find category, fallback to 'Other' or first available
        const exists = categories.some(c => c.id === initialHabit.category_id);
        if (exists) {
            setCategoryId(initialHabit.category_id);
        } else if (categories.length > 0) {
            setCategoryId(categories[0].id);
        }
      } else {
        // Create Mode
        setTitle('');
        if (categories.length > 0 && !categoryId) {
          setCategoryId(categories[0].id);
        }
      }
      setIsCreatingCategory(false);
      setNewCatName('');
    }
  }, [isOpen, initialHabit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      if (initialHabit) {
        onUpdate(initialHabit.id, title, categoryId);
      } else {
        onAdd(title, categoryId);
      }
      onClose();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('categories').insert({
      name: newCatName,
      color: newCatColor,
      user_id: user.id,
      is_default: false
    });

    if (!error) {
      onCategoryCreated(); // Refresh parent list
      setIsCreatingCategory(false);
      setNewCatName('');
      setNewCatColor('blue');
    } else {
      console.error("Error creating category:", error);
    }
  };

  const getCategoryName = (cat: Category) => {
    if (cat.is_default) {
      const key = `cat_${cat.name.toLowerCase()}` as keyof typeof t;
      return t[key] || cat.name;
    }
    return cat.name;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
             {isCreatingCategory && (
               <button onClick={() => setIsCreatingCategory(false)} className="mr-2 text-slate-400 hover:text-white">
                 <ChevronLeft className="w-5 h-5" />
               </button>
             )}
             <h2 className="text-xl font-bold text-white">
               {isCreatingCategory 
                  ? t.createCategory 
                  : (initialHabit ? t.editHabit : t.newHabit)
               }
             </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isCreatingCategory ? (
             /* CREATE CATEGORY FORM */
             <form onSubmit={handleCreateCategory} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.categoryName}</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="np. Hobby"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">{t.categoryColor}</label>
                  <div className="grid grid-cols-5 gap-3">
                    {AVAILABLE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setNewCatColor(c.name)}
                        className={`w-full aspect-square rounded-full flex items-center justify-center border-2 transition-all ${
                          newCatColor === c.name ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        } ${c.bg.replace('/20', '')}`} 
                      >
                        {newCatColor === c.name && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all mt-4 shadow-lg shadow-indigo-500/20"
                >
                  {t.create}
                </button>
             </form>
          ) : (
            /* CREATE/EDIT HABIT FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.habitName}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.habitNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  autoFocus
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-medium text-slate-300">{t.category}</label>
                   <button 
                      type="button"
                      onClick={onManageCategories}
                      className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                   >
                      <Settings className="w-3 h-3" /> {t.manageCategories}
                   </button>
                </div>
                <div className="space-y-2">
                   <select
                      value={categoryId}
                      onChange={(e) => {
                        if(e.target.value === 'new') {
                           setIsCreatingCategory(true);
                        } else {
                           setCategoryId(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-800">
                          {getCategoryName(c)}
                        </option>
                      ))}
                      <option disabled>──────────</option>
                      <option value="new" className="bg-indigo-900 text-indigo-200 font-bold">+ {t.createCategory}</option>
                    </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={!title.trim() || !categoryId}
                className="w-full py-3.5 bg-white text-slate-900 hover:bg-indigo-50 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {initialHabit ? (
                    <><Save className="w-5 h-5" /> {t.save}</>
                ) : (
                    <><Plus className="w-5 h-5" /> {t.create}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
