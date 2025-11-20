
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Habit, DayStatus } from '../types';
import { Language, translations } from '../translations';

interface AnalyticsDashboardProps {
  habits: Habit[];
  language: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ habits, language }) => {
  const t = translations[language];
  const locale = language === 'pl' ? 'pl-PL' : 'en-US';

  // Calculate last 7 days completion
  const data = useMemo(() => {
    const days: DayStatus[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      let completed = 0;
      habits.forEach(h => {
        if (h.completedDates.includes(dateStr)) completed++;
      });

      days.push({
        date: dateStr,
        completedCount: completed,
        totalHabits: habits.length
      });
    }
    return days;
  }, [habits]);

  const overallCompletionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const totalPossible = habits.length * 7;
    const totalCompleted = data.reduce((acc, curr) => acc + curr.completedCount, 0);
    return Math.round((totalCompleted / totalPossible) * 100);
  }, [habits, data]);

  const bestDay = useMemo(() => {
      if (data.length === 0) return 'N/A';
      const max = Math.max(...data.map(d => d.completedCount));
      const best = data.find(d => d.completedCount === max);
      if (!best) return 'N/A';
      // Format the best day name
      const date = new Date(best.date);
      const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }, [data, locale]);

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 backdrop-blur-sm">
        <p>{t.addHabitToSeeAnalytics}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl text-white shadow-lg shadow-indigo-500/30 border border-white/10">
          <p className="text-indigo-100 text-sm font-medium mb-1">{t.weeklySuccess}</p>
          <p className="text-4xl font-bold tracking-tight">{overallCompletionRate}%</p>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md">
          <p className="text-slate-400 text-sm font-medium mb-1">{t.bestDay}</p>
          <p className="text-2xl font-bold text-slate-100">{bestDay}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-semibold text-slate-200 mb-6">{t.activityLast7Days}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  const d = new Date(val).toLocaleDateString(locale, { weekday: 'short' });
                  return d.charAt(0).toUpperCase() + d.slice(1);
                }} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  color: '#f1f5f9'
                }}
                itemStyle={{ color: '#818cf8' }}
                formatter={(value: number) => [value, 'Completed']}
                labelFormatter={(label) => new Date(label).toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' })}
              />
              <Bar dataKey="completedCount" radius={[6, 6, 6, 6]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.completedCount === 0 ? 'rgba(148, 163, 184, 0.1)' : 'url(#colorGradient)'} 
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
