"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Trophy, Upload, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WinnerProofPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [winner, setWinner] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchWinner();
  }, [id]);

  const fetchWinner = async () => {
    const { data } = await supabase
      .from("winners")
      .select("*, draws(month)")
      .eq("id", id)
      .single();
    setWinner(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload to Supabase Storage (assuming a bucket named 'proofs' exists)
      const fileName = `${winner.user_id}/${winner.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from("proofs")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("proofs")
        .getPublicUrl(fileName);

      // 2. Update winners table
      const { error: updateError } = await supabase
        .from("winners")
        .update({ proof_url: publicUrl })
        .eq("id", id);

      if (updateError) throw updateError;

      setProofUrl(publicUrl);
      setIsSuccess(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: any) {
      alert(err.message || "Upload failed. Please ensure a 'proofs' bucket exists in your Supabase project.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!winner) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-violet-500" /></div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full point-events-none" />
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Trophy size={40} className="text-violet-400" />
          </div>

          <h1 className="text-3xl font-black text-white mb-2 italic">Claim Your Prize!</h1>
          <p className="text-zinc-500 mb-8">
            Congratulations on your **{winner.match_type}-Match** win for the **{new Date(winner.draws?.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}** draw.
          </p>

          <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 mb-8">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Prize Amount</p>
            <p className="text-4xl font-black text-emerald-400 font-mono">${Number(winner.prize_amount).toFixed(2)}</p>
          </div>

          {!isSuccess ? (
            <div className="space-y-6">
              <div className="text-left bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                   <Upload size={18} className="text-violet-400" />
                   Verification Required
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  To verify your win, please upload a screenshot or photo of your scores from the golf platform for this month. The platform admin will review your submission before releasing the payout.
                </p>

                <label className="block">
                  <span className="sr-only">Choose proof image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-zinc-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-600 file:text-white
                      hover:file:bg-violet-500
                      transition-all cursor-pointer"
                  />
                </label>
              </div>

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-violet-400 animate-pulse">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Uploading your proof...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-6">
               <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in duration-500">
                  <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-white">Proof Submitted!</h3>
               <p className="text-zinc-500 text-sm">
                 Your win verification request has been sent to the admin. 
                 You will be redirected to the dashboard shortly.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
