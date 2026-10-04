import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Same rule the API enforces: 8 to 72 bytes (bcrypt ignores anything past 72).
export const passwordProblem = (password: string): string | null => {
  if (!password) return null;
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (new TextEncoder().encode(password).length > 72) return 'Le mot de passe ne peut pas dépasser 72 octets.';
  return null;
};

// Masked by default; the admin can reveal it to hand the password to the user.
export const PasswordField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className="w-full h-12 ps-3.5 pe-12 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
