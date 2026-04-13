// =====================================================
// FINANCE APP - Note Input
// =====================================================

'use client';

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function NoteInput({ 
  value, 
  onChange, 
  placeholder = "What was this for?" 
}: NoteInputProps) {
  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
        Note (Optional)
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
      />
    </div>
  );
}
