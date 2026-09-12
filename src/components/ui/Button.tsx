import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

/**
 * Shared button primitive. Keeps Tilmid's existing pill (rounded-full) look —
 * that shape is part of the site's visual identity, not something the new
 * design-system radius tokens are meant to replace.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5',
  secondary: 'bg-blue-50 text-primary hover:bg-blue-100',
  outline: 'bg-white text-slate-700 border border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-blue-50/50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  dark: 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-[46px] px-6 text-[15px] gap-2',
  lg: 'h-[52px] px-8 text-[17px] gap-2',
};

const BASE = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
type ButtonAsLink = CommonProps & Omit<LinkProps, 'className' | 'children'> & { href?: undefined };
type ButtonAsAnchor = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const classesFor = (variant: ButtonVariant, size: ButtonSize, fullWidth: boolean | undefined, className: string | undefined) =>
  `${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`.trim();

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', fullWidth, className, children, ...rest }) => {
  const classes = classesFor(variant, size, fullWidth, className);

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  if ('href' in rest && rest.href !== undefined) {
    const anchorRest = rest as ButtonAsAnchor;
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
};
