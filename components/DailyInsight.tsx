
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Language, translations } from '../translations';

interface DailyInsightProps {
  insight: string | null;
  loading: boolean;
  onRefresh: () => void;
  language: Language;
}

const DailyInsight: React.FC<DailyInsightProps> = ({ insight, loading, onRefresh, language }) => {
  const t = translations[language];

  return (
    <div className="mb-6 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-start justify-between gap-4">
        
        <div className="flex-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
            {t.dailyInsight}
          </h3>
          
          {loading ? (
            <div className="space-y-2 animate-pulse">
               <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
               <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-slate-200 leading-relaxed text-sm font-medium">
              "{insight || t.insightWelcome}"
            </p>
          )}
        </div>

        <button 
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-500 hover:text-indigo-300 transition-all mt-1"
          title={t.refresh}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default DailyInsight;
