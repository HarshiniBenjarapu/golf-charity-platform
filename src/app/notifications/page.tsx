export default function NotificationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Notifications</h1>
        <p className="text-zinc-400">View recent updates about subscription charges and draw results.</p>
      </div>
      <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-medium text-zinc-500">No New Notifications</h2>
      </div>
    </div>
  );
}
