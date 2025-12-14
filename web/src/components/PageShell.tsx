export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-4xl mx-auto space-y-6">{children}</div>
    </main>
  );
}
