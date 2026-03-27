export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-pulse text-zinc-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-zinc-900 rounded-xl" />
        <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 rounded-3xl bg-zinc-900 border border-zinc-800/50" />
        ))}
      </div>
    </div>
  );
}
