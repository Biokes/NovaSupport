"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWalletAdapter, type WalletId } from "@/lib/wallet-adapters";

export function EditProfileButton({
  username,
  walletAddress,
}: {
  username: string;
  walletAddress: string;
}) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function resolveConnectedWallet() {
      try {
        const walletId =
          typeof window !== "undefined"
            ? (localStorage.getItem("walletId") as WalletId | null)
            : null;
        const adapter = walletId ? getWalletAdapter(walletId) : undefined;
        if (!adapter) {
          setIsOwner(false);
          return;
        }
        const address = await adapter.connect().catch(() => "");
        setIsOwner(Boolean(address && address === walletAddress));
      } catch {
        setIsOwner(false);
      }
    }
    resolveConnectedWallet();
  }, [walletAddress]);

  if (!isOwner) return null;

  return (
    <Link
      href={`/profile/${username}/edit`}
      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-mint/30 bg-mint/10 px-4 py-1.5 text-sm font-semibold text-mint hover:bg-mint/20 transition-colors"
    >
      Edit profile
    </Link>
  );
}
