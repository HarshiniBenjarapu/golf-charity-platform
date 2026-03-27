import { createClient } from "@/utils/supabase/server";
import { submitScore } from "./actions";
import { redirect } from "next/navigation";
import { Target, Calendar, TrendingUp } from "lucide-react";

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  // 1. Get authenticated user — redirect to login if not signed in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch this user's latest 5 scores from DB (descending = latest first)
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const maxScore = 45;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Score Tracker</h1>
        <p className="text-zinc-400">Submit your latest golf score and monitor your history.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* ---- Score Submission Form ---- */}
        <div className="relative p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 p-24 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Target size={20} className="text-violet-400" />
              </div>
              <h2 className="font-semibold text-xl text-zinc-100">Submit Score</h2>
            </div>

            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">
                  Score (1 – 45)
                </label>
                <input
                  type="number"
                  name="score_value"
                  min={1}
                  max={45}
                  required
                  placeholder="e.g. 36"
                  className="px-5 py-4 text-2xl font-bold text-center rounded-2xl bg-black border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-white placeholder-zinc-700 outline-none"
                />
                <p className="text-xs text-zinc-600 text-center">Only your latest 5 scores are retained</p>
              </div>

              {resolvedSearchParams?.message && (
                <div className="p-3 text-sm text-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {resolvedSearchParams.message}
                </div>
              )}

              <button
                formAction={submitScore}
                className="w-full py-4 rounded-2xl font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] active:scale-95 focus:ring-2 focus:ring-violet-500/40"
              >
                Submit Score
              </button>
            </form>
          </div>
        </div>

        {/* ---- Score History ---- */}
        <div className="relative p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
          <div className="absolute bottom-0 right-0 p-24 bg-fuchsia-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                  <TrendingUp size={20} className="text-fuchsia-400" />
                </div>
                <h2 className="font-semibold text-xl text-zinc-100">Your History</h2>
              </div>
              <span className="text-xs text-zinc-500">Latest 5</span>
            </div>

            {scores && scores.length > 0 ? (
              <div className="flex flex-col gap-5">
                {scores.map((score) => {
                  const percentage = (score.score_value / maxScore) * 100;
                  const date = new Date(score.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div key={score.id} className="flex items-center gap-4 group">
                      <div className="flex items-center gap-1.5 w-16 text-sm text-zinc-500">
                        <Calendar size={12} />
                        <span>{date}</span>
                      </div>

                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="w-8 text-right font-bold text-zinc-100 text-lg">
                        {score.score_value}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 text-center gap-3 border-2 border-dashed border-zinc-800 rounded-2xl">
                <Target size={32} className="text-zinc-700" />
                <p className="text-zinc-600 font-medium">No scores yet</p>
                <p className="text-xs text-zinc-700">Submit your first score on the left!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
