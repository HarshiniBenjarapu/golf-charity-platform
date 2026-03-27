"use client";

import { useState } from "react";
import { 
  Dices, 
  Megaphone, 
  Users, 
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Ticket
} from "lucide-react";

// Mock data
const mockUsers = [
  { id: 1, name: "Eleanor Shellstrop", email: "eleanor@goodplace.com", status: "Active", charity: "Oceans Tomorrow", joined: "Jan 12, 2026" },
  { id: 2, name: "Chidi Anagonye", email: "chidi@ethics.edu", status: "Inactive", charity: "Global Read", joined: "Feb 04, 2026" },
  { id: 3, name: "Tahani Al-Jamil", email: "tahani@highsociety.uk", status: "Active", charity: "Oceans Tomorrow", joined: "Mar 15, 2026" },
  { id: 4, name: "Jason Mendoza", email: "jason@jaguars.com", status: "Active", charity: "Wildlife Fund", joined: "Jan 28, 2026" },
  { id: 5, name: "Michael", email: "michael@architects.inc", status: "Inactive", charity: "Global Read", joined: "Nov 02, 2025" },
];

export default function AdminDashboardPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    numbers: number[];
    winners: { match5: number; match4: number; match3: number };
    total_users_checked: number;
  } | null>(null);
  
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
      setSimulationResults({
        numbers: data.winning_numbers,
        winners: data.winners,
        total_users_checked: data.total_users_checked,
      });
    } catch {
      alert("Simulation failed. Please try again.");
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
        body: JSON.stringify({ action: "publish", winning_numbers: simulationResults.numbers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPublishSuccess(true);
      setSimulationResults(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Administrator
          </h1>
          <p className="text-zinc-400">
            Manage upcoming draws and view subscriber metrics.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Draw Management Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 bg-violet-600/10 blur-[100px] rounded-full point-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <Ticket size={20} className="text-violet-400" />
                </div>
                <h2 className="font-semibold text-xl text-zinc-100 tracking-wide">Draw Management</h2>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800/50 mb-6">
                <p className="text-sm text-zinc-500 font-medium mb-1">Current Period</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-white tracking-tight">March 2026</p>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                </div>
              </div>

              {/* Simulation Results Area */}
              {publishSuccess && (
                <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                  <p className="text-emerald-400 font-semibold">✅ Draw Published Successfully!</p>
                </div>
              )}
              {simulationResults && (
                <div className="mb-6 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 animate-in slide-in-from-top-4 duration-500">
                  <p className="text-xs text-violet-300 uppercase tracking-wider font-semibold mb-3">Simulated Results</p>
                  <div className="flex gap-2 justify-center mb-4">
                    {simulationResults.numbers.map((num, i) => (
                      <div key={i} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950 border border-zinc-700 text-white font-bold shadow-inner">
                        {num}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-zinc-300">
                    Match-5: <span className="font-bold text-emerald-400">{simulationResults.winners.match5}</span> &nbsp;|
                    Match-4: <span className="font-bold text-sky-400">{simulationResults.winners.match4}</span> &nbsp;|
                    Match-3: <span className="font-bold text-amber-400">{simulationResults.winners.match3}</span>
                  </p>
                  <p className="text-xs text-zinc-600 text-center mt-2">{simulationResults.total_users_checked} users checked</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleSimulateDraw}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 transition-all focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Dices size={18} className={isSimulating ? "animate-spin" : "group-hover:-translate-y-0.5 transition-transform"} />
                  {isSimulating ? "Simulating..." : "Simulate Draw"}
                </button>
                
                <button 
                  onClick={handlePublish}
                  disabled={!simulationResults || isPublishing}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-black bg-emerald-500 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:ring-2 focus:ring-emerald-500/40 group relative overflow-hidden"
                >
                  {simulationResults && <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />}
                  <Megaphone size={18} className={`relative z-10 ${simulationResults ? "group-hover:scale-110" : ""} transition-transform`} />
                  <span className="relative z-10">{isPublishing ? "Publishing..." : "Publish Results"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users & Subs Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Users size={20} className="text-blue-400" />
                </div>
                <h2 className="font-semibold text-xl text-zinc-100 tracking-wide">Subscribers Directory</h2>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  className="block w-full sm:w-64 p-2 pl-9 text-sm bg-black/50 border border-zinc-800 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-500 transition-all shadow-inner"
                  placeholder="Search users..."
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-800/50 bg-black/20">
              <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">User</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-4 font-semibold hidden sm:table-cell">Charity</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-200">{user.name}</span>
                          <span className="text-xs text-zinc-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === "Active" ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 size={14} />
                            <span className="font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <XCircle size={14} />
                            <span>Inactive</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-zinc-300">
                        {user.charity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6 text-sm text-zinc-500">
              <span>Showing 5 of 1,245 users</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 hover:text-zinc-300 transition-colors">Previous</button>
                <button className="px-3 py-1 hover:text-zinc-300 transition-colors">Next</button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}
