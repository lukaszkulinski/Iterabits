
// Colors available for new categories
export const AVAILABLE_COLORS = [
  { name: 'emerald', bg: 'bg-emerald-500/20', text: 'text-emerald-200', border: 'border-emerald-500/30' },
  { name: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-200', border: 'border-blue-500/30' },
  { name: 'purple', bg: 'bg-purple-500/20', text: 'text-purple-200', border: 'border-purple-500/30' },
  { name: 'yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-200', border: 'border-yellow-500/30' },
  { name: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-200', border: 'border-orange-500/30' },
  { name: 'red', bg: 'bg-red-500/20', text: 'text-red-200', border: 'border-red-500/30' },
  { name: 'pink', bg: 'bg-pink-500/20', text: 'text-pink-200', border: 'border-pink-500/30' },
  { name: 'cyan', bg: 'bg-cyan-500/20', text: 'text-cyan-200', border: 'border-cyan-500/30' },
  { name: 'slate', bg: 'bg-slate-500/20', text: 'text-slate-200', border: 'border-slate-500/30' },
];

// Helper to get tailwind classes based on color name
export const getColorClasses = (colorName: string) => {
  const color = AVAILABLE_COLORS.find(c => c.name === colorName);
  return color || AVAILABLE_COLORS.find(c => c.name === 'slate')!;
};

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
