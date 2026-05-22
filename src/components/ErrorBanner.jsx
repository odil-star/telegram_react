export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
      {message}
    </div>
  );
}
