import Link from "next/link";
import { ArrowRight, Trophy, Heart, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center font-black italic shadow-lg shadow-violet-500/20">
              GC
            </div>
            <span className="text-xl font-bold tracking-tight">Golf Charity</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#charities" className="hover:text-white transition-colors">Charities</a>
            <a href="#prizes" className="hover:text-white transition-colors">Prizes</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2.5 text-sm font-semibold hover:text-violet-400 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-semibold transition-all shadow-lg shadow-violet-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              OVER $50K RAISED FOR CHARITY TO DATE
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
              Play with Purpose.<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent italic">
                Win with Impact.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              A completely new way to make your golf game matter. Log your Stableford scores, 
              enter the monthly draw, and support world-changing charities directly from your membership.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
              >
                Join the Draw <ArrowRight size={20} />
              </Link>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                How it Works
              </a>
            </div>

            {/* Platform Preview */}
            <div className="mt-24 rounded-3xl border border-white/10 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-[16/9] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=2000" 
                  alt="Platform Preview" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                     <Trophy size={32} className="text-white fill-white/10" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-32 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-6 p-8 rounded-3xl bg-black border border-white/5 hover:border-violet-500/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="text-violet-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold">1. Log Scores</h3>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Submit your latest Stableford scores after your round. We track your rolling history of the best 5 scores.
                </p>
              </div>

              <div className="space-y-6 p-8 rounded-3xl bg-black border border-white/5 hover:border-fuchsia-500/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-600/10 border border-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="text-fuchsia-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold">2. Support Charity</h3>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Choose a charity that matters to you. A portion of every monthly subscription goes directly to their cause.
                </p>
              </div>

              <div className="space-y-6 p-8 rounded-3xl bg-black border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold">3. Win Big</h3>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Five numbers are drawn monthly. Match your scores to the winning numbers to win cash prizes and recognition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black italic">
              GC
            </div>
            <span className="text-lg font-bold tracking-tight">Golf Charity</span>
          </div>
          <p className="text-zinc-600 text-sm">
            © 2026 Golf Charity Platform. All rights reserved. Play responsively.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
