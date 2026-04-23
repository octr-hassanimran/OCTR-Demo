export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold">Page not found</div>
        <div className="text-[13px] text-[var(--text-faint)]">
          The route you requested does not exist. Use the sidebar to navigate.
        </div>
      </div>
    </div>
  );
}
