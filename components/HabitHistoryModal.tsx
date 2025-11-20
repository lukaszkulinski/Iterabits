
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';
import { Language, translations } from '../translations';
import { WEEK_DAYS } from '../constants';

interface HabitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  language: Language;
  onToggle: (id: string, date: string) => void;
}

const HabitHistoryModal: React.FC<HabitHistoryModalProps> = ({ isOpen, onClose, habit, language, onToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const t = translations[language];
  const locale = language === 'pl' ? 'pl-PL' : 'en-US';

  if (!isOpen || !habit) return null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearString = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const displayMonthYear = monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1);

  const handleDayClick = (dateStr: string) => {
    // Prevent future dates if needed, currently allowing toggling past/today
    const today = new Date().toISOString().split('T')[0];
    if (dateStr > today) return;

    if (window.confirm(t.toggleConfirm)) {
        onToggle(habit.id, dateStr);
    }
  };

  // Generate calendar grid
  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const isCompleted = habit.completedDates.includes(dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isFuture = dateStr > new Date().toISOString().split('T')[0];

      let bgClass = 'bg-slate-800/50 text-slate-500 hover:bg-slate-700 cursor-pointer'; // Default interactive
      if (isCompleted) {
        bgClass = 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40 cursor-pointer hover:opacity-90';
      } else if (isToday) {
        bgClass = 'bg-slate-700 text-indigo-400 border border-indigo-500/50 cursor-pointer hover:bg-slate-600';
      }
      
      if (isFuture) {
        bgClass = 'bg-slate-900/30 text-slate-700 cursor-default';
      }

      days.push(
        <div key={d} className="flex items-center justify-center aspect-square" onClick={() => !isFuture && handleDayClick(dateStr)}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${bgClass}`}>
            {d}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
             <h3 className="font-bold text-slate-100">{t.history}</h3>
             <p className="text-xs text-indigo-400">{habit.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold text-slate-200">{displayMonthYear}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {WEEK_DAYS.map((day) => (
                    <div key={day} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {day.charAt(0)}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-2">
                {renderCalendarDays()}
            </div>
            
            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <span>Zrobione</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></div>
                    <span>Pominięte</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HabitHistoryModal;
