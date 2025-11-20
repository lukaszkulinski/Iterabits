
import React, { useState, useEffect } from 'react';
import { X, User, Save, Loader2 } from 'lucide-react';
import { Language, translations } from '../translations';
import { supabase } from '../services/supabaseClient';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user: any;
  onProfileUpdated: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, language, user, onProfileUpdated }) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.user_metadata && user.user_metadata.full_name) {
      setName(user.user_metadata.full_name);
    } else {
      setName('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });

    if (!error) {
      onProfileUpdated();
      onClose();
    } else {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <User className="w-5 h-5 text-indigo-400" />
             {t.profile}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
           <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-300 text-2xl font-bold border border-indigo-500/30">
                 {name ? name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
              </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">{t.yourName}</label>
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder={t.namePlaceholder}
               className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
             />
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t.email}</label>
              <div className="w-full px-4 py-3 rounded-xl bg-slate-800/30 border border-white/5 text-slate-400 cursor-not-allowed">
                 {user.email}
              </div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all mt-4 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {t.save}</>}
           </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
