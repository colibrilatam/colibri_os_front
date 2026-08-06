'use client';

export default function Toast({ open, type = 'success', message }) {
  if (!open) return null;

  const styles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-sky-600',
  };

  return (
    <div className="fixed inset-0 z-toast flex items-center justify-center pointer-events-none">
      <div
        className={`
          px-8
          py-5
          rounded-2xl
          shadow-xl
          text-white
          ${styles[type]}
        `}
      >
        {message}
      </div>
    </div>
  );
}