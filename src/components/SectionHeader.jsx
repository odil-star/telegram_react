export function SectionHeader({ title, action }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between gap-4">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      {action}
    </div>
  );
}
