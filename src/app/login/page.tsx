import { login, signup } from "./actions";
import { Sparkles } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-100 p-4">
      
      {/* Platform Branding */}
      <div className="flex flex-col items-center gap-3 mb-10 group cursor-default">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
          <span className="text-2xl font-bold text-white tracking-widest">GC</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          GCSP Elevate
        </h1>
      </div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 p-32 bg-violet-600/10 blur-[100px] rounded-full point-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">Welcome Back</h2>

          <form className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-400" htmlFor="email">
                Email Address
              </label>
              <input
                className="px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-white placeholder-zinc-600 outline-none"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-400" htmlFor="password">
                Password
              </label>
              <input
                className="px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-white placeholder-zinc-600 outline-none"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-1 mt-2">
               <label className="text-sm font-medium text-zinc-400" htmlFor="first_name">
                First Name (For Signup Only)
              </label>
              <input
                className="px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-white placeholder-zinc-600 outline-none"
                name="first_name"
                placeholder="Eleanor"
              />
            </div>
            
            <div className="flex flex-col gap-1">
               <label className="text-sm font-medium text-zinc-400" htmlFor="last_name">
                Last Name (For Signup Only)
              </label>
              <input
                className="px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-white placeholder-zinc-600 outline-none"
                name="last_name"
                placeholder="Shellstrop"
              />
            </div>

            {resolvedSearchParams?.message && (
              <div className="p-4 mt-2 mb-2 text-sm text-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {resolvedSearchParams.message}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                formAction={login}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] focus:ring-2 focus:ring-violet-500/40"
              >
                Sign In
              </button>
              
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm">Or</span>
                  <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <button
                formAction={signup}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
