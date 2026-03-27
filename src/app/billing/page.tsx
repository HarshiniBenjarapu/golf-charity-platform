"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Crown, Loader2 } from "lucide-react";

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$25",
    period: "/ month",
    description: "Flexible monthly plan. Cancel anytime.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? "price_monthly_placeholder",
    icon: Zap,
    color: "violet",
    features: [
      "5 golf score slots (Rolling 5)",
      "Entry into monthly charity draw",
      "Select & support your charity",
      "Access to draw history",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$250",
    period: "/ year",
    description: "Save $50 vs monthly. Best value.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ?? "price_yearly_placeholder",
    icon: Crown,
    color: "amber",
    features: [
      "Everything in Monthly",
      "2 months free ($50 savings)",
      "Priority draw entry",
      "Early access to new features",
    ],
    badge: "Best Value",
  },
];

export default function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string };
}) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planId: string) => {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">Choose Your Plan</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Every subscription directly funds your selected charity. Play golf, support a cause, and win monthly prizes.
        </p>
      </div>

      {searchParams?.success && (
        <div className="p-4 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium animate-in fade-in">
          ✅ Subscription activated! Welcome aboard.
        </div>
      )}
      {searchParams?.cancelled && (
        <div className="p-4 text-center rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 animate-in fade-in">
          Checkout cancelled. You can subscribe anytime.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isLoading = loadingPlan === plan.id;
          const isAmber = plan.color === "amber";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col p-7 rounded-3xl border shadow-xl overflow-hidden transition-all ${
                isAmber
                  ? "bg-zinc-900 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.08)]"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-5 right-5 px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {plan.badge}
                </div>
              )}

              <div className={`p-3 rounded-xl w-fit mb-5 border ${
                isAmber ? "bg-amber-500/10 border-amber-500/20" : "bg-violet-500/10 border-violet-500/20"
              }`}>
                <Icon size={22} className={isAmber ? "text-amber-400" : "text-violet-400"} />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-sm text-zinc-500 mb-5">{plan.description}</p>

              <div className="flex items-end gap-1 mb-7">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-zinc-500 mb-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${isAmber ? "text-amber-400" : "text-violet-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.priceId, plan.id)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all focus:ring-2 disabled:opacity-60 ${
                  isAmber
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] focus:ring-amber-500/40"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] focus:ring-violet-500/40"
                }`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : `Subscribe ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-600">
        Payments are securely processed by Stripe. You can cancel anytime from your billing portal.
      </p>
    </div>
  );
}
