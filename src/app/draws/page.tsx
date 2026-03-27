import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Ticket, Trophy, CalendarDays } from "lucide-react";

export default async function DrawsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all published draws, latest first
  const { data: draws } = await supabase
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Monthly Draws</h1>
        <p className="text-zinc-400">Official published draw results. Check if your scores matched the winning numbers!</p>
      </div>

      {draws && draws.length > 0 ? (
        <div className="flex flex-col gap-6">
          {draws.map((draw) => {
            const month = new Date(draw.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <div key={draw.id} className="relative p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-24 bg-violet-500/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <Ticket size={18} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{month} Draw</p>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                          <CalendarDays size={11} />
                          <span>{new Date(draw.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Published
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={14} className="text-amber-400" />
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Winning Numbers</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {(draw.winning_numbers as number[]).map((num, i) => (
                      <div key={i} className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-white font-bold text-lg shadow-inner group-hover:border-violet-500/40 transition-colors">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-3xl bg-zinc-900 border border-zinc-800 gap-4">
          <Ticket size={40} className="text-zinc-700" />
          <p className="text-zinc-500 font-medium text-lg">No draws published yet</p>
          <p className="text-zinc-600 text-sm">The admin will publish results after each monthly draw.</p>
        </div>
      )}
    </div>
  );
}
