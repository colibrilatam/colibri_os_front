const textareaBase =
  'w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 resize-none focus:outline-none focus:border-[var(--action-primary)] transition-colors duration-150';

export default function Textarea({
  label,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}) {
  const textareaId = id || props.name;
  const errorClasses = error ? 'border-red-500' : '';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="text-micro-label block mb-2">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`${textareaBase} ${errorClasses} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
