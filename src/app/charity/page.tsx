import { createClient } from "@/utils/supabase/server";
import { selectCharity } from "./actions";
import { redirect } from "next/navigation";
import { HeartHandshake, CheckCircle2, Users } from "lucide-react";

export default async function CharityPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  // Guard: must be logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all charities and the user's current selection in parallel
  const [{ data: charities }, { data: profile }] = await Promise.all([
    supabase.from("charities").select("*").order("total_raised", { ascending: false }),
    supabase.from("profiles").select("selected_charity_id").eq("id", user.id).single(),
  ]);

  const selectedCharityId = profile?.selected_charity_id;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Choose Your Charity</h1>
        <p className="text-zinc-400">A portion of every subscription goes directly to your selected charity. Change anytime.</p>
      </div>

      {resolvedSearchParams?.message && (
        <div className="p-4 text-sm text-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          {resolvedSearchParams.message}
        </div>
      )}

      {/* Charity Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {charities?.map((charity) => {
          const isSelected = charity.id === selectedCharityId;

          return (
            <div
              key={charity.id}
              className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300 overflow-hidden group ${
                isSelected
                  ? "bg-zinc-900 border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {/* Glow on selection */}
              {isSelected && (
                <div className="absolute top-0 right-0 p-20 bg-violet-600/10 blur-[60px] rounded-full pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Charity Image */}
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-5 bg-zinc-800">
                  <img
                    src={charity.image_url}
                    alt={charity.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{charity.name}</h3>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} />
                      Selected
                    </div>
                  )}
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed mb-5 flex-1">{charity.description}</p>

                <div className="flex items-center justify-between mb-5 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Users size={14} />
                    <span>Community Supported</span>
                  </div>
                  <span className="font-semibold text-emerald-400">
                    ${charity.total_raised.toLocaleString()} raised
                  </span>
                </div>

                <form>
                  <input type="hidden" name="charity_id" value={charity.id} />
                  <button
                    formAction={selectCharity}
                    disabled={isSelected}
                    className={`w-full py-3 rounded-xl font-medium transition-all text-sm ${
                      isSelected
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/30 cursor-default"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {isSelected ? "Currently Supporting" : "Select This Charity"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
