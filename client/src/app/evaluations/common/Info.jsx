export default function Info({ label, value }) {
  return (
    <div>
      <p className="text-micro-label">{label}</p>

      <p className="text-data--label">{value || '-'}</p>
    </div>
  );
}
