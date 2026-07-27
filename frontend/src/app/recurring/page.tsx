"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { Toast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import { apiFetch } from "@/lib/api-client";
import { API_BASE_URL } from "@/lib/config";

interface RecurringSupport {
  id: string;
  profileId: string;
  profileUsername: string;
  profileDisplayName: string;
  profileAvatarUrl: string | null;
  amount: string;
  assetCode: string;
  frequency: string;
  nextRunAt: string;
  status: string;
  createdAt: string;
}

export default function RecurringPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<RecurringSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/");
      return;
    }

    apiFetch(`${API_BASE_URL}/v1/recurring-support`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load recurring support subscriptions");
        const data = await res.json();
        setSubscriptions(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCancel(id: string) {
    setCancelling(id);
    try {
      const res = await apiFetch(`${API_BASE_URL}/v1/recurring-support/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel subscription");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      setToast({ message: "Subscription cancelled", type: "success" });
    } catch (err: unknown) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to cancel subscription",
        type: "error",
      });
    } finally {
      setCancelling(null);
      setCancelTarget(null);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-white mb-1">Recurring support</h1>
        <p className="text-sm text-white/50 mb-8">
          Manage the creators you support on a recurring basis.
        </p>

        {loading && <p className="text-sm text-white/40">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && subscriptions.length === 0 && (
          <EmptyState
            title="No recurring support yet"
            description="When you set up a recurring drip to a creator, it will show up here."
          />
        )}

        {!loading && subscriptions.length > 0 && (
          <ul className="space-y-3">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {sub.profileAvatarUrl ? (
                    <Image
                      src={sub.profileAvatarUrl}
                      alt={sub.profileDisplayName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60 flex-shrink-0">
                      {sub.profileDisplayName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {sub.profileDisplayName}
                    </p>
                    <p className="text-xs text-white/40">
                      {sub.amount} {sub.assetCode} · {sub.frequency} · next{" "}
                      {new Date(sub.nextRunAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {cancelTarget === sub.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-white/50">Cancel?</span>
                    <button
                      onClick={() => handleCancel(sub.id)}
                      disabled={cancelling === sub.id}
                      className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/30"
                    >
                      {cancelling === sub.id ? "Cancelling…" : "Yes, cancel"}
                    </button>
                    <button
                      onClick={() => setCancelTarget(null)}
                      className="rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white"
                    >
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancelTarget(sub.id)}
                    className="flex-shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:border-red-400/40 hover:text-red-300"
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </AppShell>
  );
}
