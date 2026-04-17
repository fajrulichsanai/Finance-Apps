// =====================================================
// FINANCE APP - Description Input
// =====================================================

'use client';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DescriptionInput({ 
  value, 
  onChange, 
  placeholder = "Untuk apa? (cth: gaji bulanan, freelance, bonus)" 
}: DescriptionInputProps) {
  const maxLength = 200;
  const charCount = value.length;

  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Deskripsi
        </p>
        <span className="text-[10px] text-slate-400">
          {charCount}/{maxLength}
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.substring(0, maxLength))}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
      />
    </div>
  );
}
