/**
 * AppFooter — footer chung cho toàn app.
 */
export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-center text-xs text-slate-400">
          © {year} Ticket Manager &mdash; Internal use only.
        </p>
      </div>
    </footer>
  );
}
