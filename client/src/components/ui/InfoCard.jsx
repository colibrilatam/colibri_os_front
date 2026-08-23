export default function Info({ icon, label, value, className = '' }) {
  return (
    <div className={className}>
      {icon && (
        <div className="glass-effect-cyan rounded-xl p-3 mb-2">
          {icon}
        </div>
      )}
      <p className="text-micro-label">{label}</p>
      <p className="text-data--label mt-1 break-words">{value || '-'}</p>
    </div>
  );
}
