import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }>(
  ({ icon, className = '', ...rest }, ref) => (
    <div className="relative flex items-center">
      {icon && <span className="absolute start-4 text-slate-400 pointer-events-none flex items-center">{icon}</span>}
      <input
        ref={ref}
        className={`w-full h-12 rounded-ds-lg bg-slate-50 border border-slate-200 text-[15px] font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 ${icon ? 'ps-11 pe-4' : 'px-4'} ${className}`}
        {...rest}
      />
    </div>
  )
);
Input.displayName = 'Input';
