"use client";

import { useState, useEffect } from "react";
import { 
  Dices, 
  Megaphone, 
  Users, 
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Ticket,
  Trophy,
  HeartHandshake,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    winning_numbers: number[];
    winners: { match5: number; match4: number; match3: number };
    prize_pools: any;
    individual_prizes: any;
    total_users_checked: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"draws" | "users" | "winners" | "charities">("draws");
  const [users, setUsers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "users") {
        const { data } = await supabase.from("profiles").select("*, charities(name)").order("created_at", { ascending: false });
        setUsers(data || []);
      } else if (activeTab === "winners") {
        const { data } = await supabase.from("winners").select("*, profiles(full_name, email), draws(month)").order("created_at", { ascending: false });
        setWinners(data || []);
      } else if (activeTab === "charities") {
        const { data } = await supabase.from("charities").select("*").order("name");
        setCharities(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateDraw = async () => {
    setIsSimulating(true);
    setSimulationResults(null);
    setPublishSuccess(false);
    try {
      const res = await fetch("/api/draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "simulate" }),
      });
      const data = await res.json();
      setSimulationResults(data);
    } catch {
      alert("Simulation failed.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulationResults) return;
    setIsPublishing(true);
    try {
      const res = await fetch("/api/draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", ...simulationResults }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPublishSuccess(true);
      setSimulationResults(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdateWinnerStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("winners").update({ status }).eq("id", id);
    if (!error) fetchAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Platform Admin</h1>
          <p className="text-zinc-400">Complete control over draws, users, and charity operations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
        {[
          { id: "draws", label: "Draws", icon: Ticket },
          { id: "winners", label: "Winner Verification", icon: Trophy },
          { id: "users", label: "Subscribers", icon: Users },
          { id: "charities", label: "Charities", icon: HeartHandshake },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8">
        {/* TAB: DRAWS */}
        {activeTab === "draws" && (
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-6">Execution Engine</h2>
                  {publishSuccess && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold">
                      Draw Published Successfully!
                    </div>
                  )}
                  <div className="space-y-4">
                    <button 
                      onClick={handleSimulateDraw}
                      disabled={isSimulating}
                      className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-all"
                    >
                      {isSimulating && <Loader2 className="animate-spin" />}
                      Simulate Monthly Draw
                    </button>
                    <button 
                      onClick={handlePublish}
                      disabled={!simulationResults || isPublishing}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                    >
                      {isPublishing && <Loader2 className="animate-spin" />}
                      Publish Results
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden min-h-[400px]">
                <h2 className="text-xl font-bold mb-6">Simulation Analysis</h2>
                {simulationResults ? (
                  <div className="space-y-8">
                    <div className="flex justify-center gap-4">
                      {simulationResults.winning_numbers.map((n, i) => (
                        <div key={i} className="w-14 h-14 rounded-full bg-zinc-950 border-2 border-violet-500/50 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 text-center">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Match 5</p>
                        <p className="text-2xl font-black text-white">{simulationResults.winners.match5}</p>
                        <p className="text-emerald-400 font-bold text-sm mt-1">Pool: ${simulationResults.prize_pools.match5.toFixed(2)}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 text-center">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Match 4</p>
                        <p className="text-2xl font-black text-white">{simulationResults.winners.match4}</p>
                        <p className="text-sky-400 font-bold text-sm mt-1">Pool: ${simulationResults.prize_pools.match4.toFixed(2)}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 text-center">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Match 3</p>
                        <p className="text-2xl font-black text-white">{simulationResults.winners.match3}</p>
                        <p className="text-amber-400 font-bold text-sm mt-1">Pool: ${simulationResults.prize_pools.match3.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/20">
                      <p className="text-sm text-center text-zinc-400">
                        Simulation based on **{simulationResults.total_users_checked}** active profiles. 
                        Rollover of **${simulationResults.prize_pools.rollover_included.toFixed(2)}** included in Match-5 jackpot.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] gap-3 text-zinc-600">
                    <Dices size={48} />
                    <p>Run a simulation to see projected winners and prize distribution.</p>
                  </div>
                )}
              </div>
           </div>
        )}

        {/* TAB: WINNERS */}
        {activeTab === "winners" && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
             <h2 className="text-xl font-bold mb-6">Winner Verification System</h2>
             {isLoading ? <Loader2 className="animate-spin mx-auto my-12" /> : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-zinc-800 text-xs font-bold uppercase text-zinc-500">
                       <th className="pb-4 px-4">User</th>
                       <th className="pb-4 px-4">Draw</th>
                       <th className="pb-4 px-4">Match</th>
                       <th className="pb-4 px-4">Prize</th>
                       <th className="pb-4 px-4">Proof</th>
                       <th className="pb-4 px-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-800/50">
                     {winners.map(w => (
                       <tr key={w.id} className="text-sm">
                         <td className="py-4 px-4">
                           <div className="font-bold">{w.profiles?.full_name}</div>
                           <div className="text-xs text-zinc-500">{w.profiles?.email}</div>
                         </td>
                         <td className="py-4 px-4">{new Date(w.draws?.month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                         <td className="py-4 px-4">{w.match_type}-Match</td>
                         <td className="py-4 px-4 font-bold text-emerald-400">${Number(w.prize_amount).toFixed(2)}</td>
                         <td className="py-4 px-4">
                           {w.proof_url ? (
                             <a href={w.proof_url} target="_blank" className="flex items-center gap-1 text-violet-400 hover:text-white">
                               <ImageIcon size={14} /> View
                             </a>
                           ) : <span className="text-zinc-600">No Proof</span>}
                         </td>
                         <td className="py-4 px-4 text-right space-x-2">
                           {w.status === 'pending' && (
                             <>
                               <button onClick={() => handleUpdateWinnerStatus(w.id, 'approved')} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold border border-emerald-500/20">Verify</button>
                               <button onClick={() => handleUpdateWinnerStatus(w.id, 'rejected')} className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-lg font-bold border border-rose-500/20">Reject</button>
                             </>
                           )}
                           {w.status === 'approved' && (
                             <button onClick={() => handleUpdateWinnerStatus(w.id, 'paid')} className="px-3 py-1 bg-violet-600 text-white rounded-lg font-bold">Mark Paid</button>
                           )}
                           {w.status === 'paid' && <span className="text-emerald-400 font-bold">✅ Paid</span>}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === "users" && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
             <h2 className="text-xl font-bold mb-6">Subscribers Directory</h2>
             {isLoading ? <Loader2 className="animate-spin mx-auto my-12" /> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(u => (
                    <div key={u.id} className="p-4 rounded-2xl bg-black/40 border border-zinc-800 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white">{u.full_name}</div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          u.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}>
                          {u.subscription_status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 bg-zinc-800/50 p-2 rounded-lg">
                        <span className="font-bold">Charity:</span> {u.charities?.name || 'None'}
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        )}

        {/* TAB: CHARITIES */}
        {activeTab === "charities" && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Charity Management</h2>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-xl font-bold text-sm">Add Charity</button>
             </div>
             {isLoading ? <Loader2 className="animate-spin mx-auto my-12" /> : (
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {charities.map(c => (
                   <div key={c.id} className="bg-black/40 border border-zinc-800 rounded-3xl overflow-hidden">
                     {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-32 object-cover opacity-50" />}
                     <div className="p-4">
                        <h3 className="font-bold text-white">{c.name}</h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{c.description}</p>
                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                           <span className="text-xs font-bold text-emerald-400">${c.total_raised} raised</span>
                           <button className="text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
