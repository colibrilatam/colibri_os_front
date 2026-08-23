const inputBase =
  'w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 focus:outline-none focus:border-[var(--action-primary)] transition-colors duration-150';

export default function Input({
  label,
  error,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || props.name;
  const errorClasses = error ? 'border-red-500' : '';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="text-micro-label block mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`${inputBase} ${errorClasses} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
