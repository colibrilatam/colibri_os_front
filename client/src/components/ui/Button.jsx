'use client';

import { useRouter } from 'next/navigation';

const variants = {
  primary:
    'btn-primary rounded-xl px-6 py-3 text-white font-semibold transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95',
  'primary-gradient':
    'rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-150 hover:text-gray-200 cursor-pointer hover:opacity-90 active:scale-95',
  secondary:
    'rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-150 cursor-pointer active:scale-95',
  'secondary-full':
    'w-full py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer',
  action:
    'w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer',
  danger:
    'rounded-xl bg-linear-to-r from-red-600 to-red-800 p-2 lg:px-5 lg:py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-150 cursor-pointer hover:text-gray-200 hover:opacity-90 active:scale-95',
  'danger-flat':
    'px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 cursor-pointer',
  'danger-outline':
    'rounded-xl px-5 py-4 border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer',
  ghost:
    'filter-chip rounded-xl px-5 py-3 cursor-pointer transition-all duration-150',
  'ghost-hover':
    'border-theme glass-effect rounded-xl px-5 py-3 cursor-pointer hover:glass-effect-secondary transition',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-5 py-4',
};

export default function Button({
  variant = 'primary',
  size,
  className = '',
  disabled = false,
  fullWidth = false,
  redirect,
  children,
  onClick,
  type = 'button',
  ...props
}) {
  const router = useRouter();

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (redirect) {
      if (redirect.startsWith('http')) {
        window.location.href = redirect;
      } else {
        router.push(`/${redirect}`);
      }
    }
  };

  const baseClasses = variants[variant] || variants.primary;
  const sizeClasses = size && sizes[size] ? sizes[size] : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
