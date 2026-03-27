import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  HeartHandshake,
  Target,
  CreditCard,
  ArrowRight,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Guard: must be logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parallel fetch: profile + scores + latest draws
  const [{ data: profile }, { data: scores }, { data: draws }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, charities(name, description)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const charity = profile?.charities as { name: string; description: string } | null;
  const isActive = profile?.subscription_status === "active";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Your Dashboard</h1>
        <p className="text-zinc-400">Manage your subscription, review scores, and see your charity&apos;s impact.</p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CARD 1: Subscription Status */}
        <div className="group relative flex flex-col p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Activity size={20} className="text-emerald-400" />
                </div>
                <h2 className="font-medium text-lg text-zinc-100">Subscription</h2>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-2 mb-auto space-y-3">
              <p className="text-2xl font-bold text-white tracking-tight">
                {isActive ? "Premium Member" : "No Active Plan"}
              </p>
              <p className="text-sm text-zinc-500">
                {isActive ? "Your subscription is active and contributing to charity." : "Activate a plan to participate in monthly draws."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/50">
              <Link href="/billing" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors border border-zinc-700">
                <CreditCard size={18} />
                Manage Billing
              </Link>
            </div>
          </div>
        </div>

        {/* CARD 2: Selected Charity */}
        <div className="group relative flex flex-col p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 p-32 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <HeartHandshake size={20} className="text-sky-400" />
              </div>
              <h2 className="font-medium text-lg text-zinc-100">Supporting</h2>
            </div>
            <div className="flex flex-col items-center text-center gap-3 mb-auto">
              <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Sparkles size={22} className="text-sky-400" />
              </div>
              {charity ? (
                <>
                  <p className="text-xl font-bold text-white">{charity.name}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{charity.description}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-zinc-500">No charity selected</p>
                  <p className="text-sm text-zinc-600">Choose a charity your subscription will support.</p>
                </>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/50">
              <Link href="/charity" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors border border-zinc-700 group">
                {charity ? "Change Charity" : "Select Charity"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* CARD 3: Latest 5 Scores */}
        <div className="group relative flex flex-col p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden min-h-[300px]">
          <div className="absolute bottom-0 right-0 p-32 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                  <Target size={20} className="text-fuchsia-400" />
                </div>
                <h2 className="font-medium text-lg text-zinc-100">Latest Scores</h2>
              </div>
              <span className="text-xs text-zinc-500">Out of 45</span>
            </div>
            <div className="flex-1 space-y-4">
              {scores && scores.length > 0 ? scores.map((score) => {
                const pct = (score.score_value / 45) * 100;
                const date = new Date(score.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={score.id} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-zinc-500">{date}</span>
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right font-bold text-zinc-100">{score.score_value}</span>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                  <Trophy size={28} className="text-zinc-700" />
                  <p className="text-zinc-600 text-sm">No scores yet. Submit your first score!</p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/50">
              <Link href="/scores" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-zinc-400 hover:text-white font-medium transition-colors">
                View All History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Draw History Section */}
      <div className="relative p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Ticket size={20} className="text-amber-400" />
              </div>
              <h2 className="font-semibold text-xl text-zinc-100">Recent Draw Results</h2>
            </div>
            <Link href="/draws" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {draws && draws.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {draws.map((draw) => {
                const month = new Date(draw.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
                return (
                  <div key={draw.id} className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/50">
                    <p className="text-sm font-medium text-zinc-400 mb-3">{month}</p>
                    <div className="flex gap-2 flex-wrap">
                      {(draw.winning_numbers as number[]).map((num: number, i: number) => (
                        <div key={i} className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm font-bold">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-zinc-800 gap-3">
              <Ticket size={28} className="text-zinc-700" />
              <p className="text-zinc-600 text-sm">No draws published yet. Check back after the monthly draw!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
