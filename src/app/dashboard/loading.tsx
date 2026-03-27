import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse text-zinc-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-zinc-900 rounded-xl" />
        <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[300px] rounded-3xl bg-zinc-900 border border-zinc-800/50" />
        ))}
      </div>

      <div className="h-48 rounded-3xl bg-zinc-900 border border-zinc-800/50" />
    </div>
  );
}
