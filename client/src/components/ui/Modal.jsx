'use client';

import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  maxWidth = '2xl',
  padding = true,
  className = '',
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] overlay-bg flex items-center justify-center p-4 md:p-6">
      <div
        className={`glass-effect rounded-2xl w-full max-w-${maxWidth} max-h-[90vh] overflow-y-auto custom-scrollbar ${className}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle, icon, onClose, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 p-6 border-theme-bottom ${className}`.trim()}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="glass-effect-cyan rounded-xl p-3">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-h3">{title}</h3>
          {subtitle && (
            <p className="text-body--muted mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="filter-chip rounded-xl p-2 cursor-pointer shrink-0"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ className = '', children }) {
  return (
    <div className={`p-6 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function ModalFooter({ className = '', children }) {
  return (
    <div className={`p-6 border-theme-top flex items-center justify-end gap-3 ${className}`.trim()}>
      {children}
    </div>
  );
}
