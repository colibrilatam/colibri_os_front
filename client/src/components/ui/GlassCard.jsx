const glassVariants = {
  default: 'glass-effect',
  dark: 'glass-effect-dark',
  secondary: 'glass-effect-secondary',
  red: 'glass-effect-red',
  green: 'glass-effect-green',
  cyan: 'glass-effect-cyan',
};

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-6 md:p-8',
};

export default function GlassCard({
  variant = 'default',
  padding = 'md',
  border = true,
  rounded = '2xl',
  hover = false,
  className = '',
  children,
  ...props
}) {
  const glassClass = glassVariants[variant] || glassVariants.default;
  const paddingClass = paddingMap[padding] || paddingMap.md;
  const borderClass = border ? 'border-glass' : '';
  const hoverClass = hover ? 'transition-all duration-200 hover:glass-effect-secondary' : '';

  return (
    <div
      className={`${glassClass} ${borderClass} rounded-${rounded} ${paddingClass} ${hoverClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
