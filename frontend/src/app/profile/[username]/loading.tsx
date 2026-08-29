import { AppShell } from "@/components/app-shell";
import { ProfileSkeleton } from "@/components/profile-skeleton";

export default function Loading() {
  return (
    <AppShell>
      <ProfileSkeleton />
    </AppShell>
  );
}
