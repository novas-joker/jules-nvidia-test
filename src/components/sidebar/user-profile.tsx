"use client";

import { useUser, UserButton } from "@clerk/nextjs";

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <UserButton />
      <div className="flex flex-1 flex-col overflow-hidden text-left">
        <p className="text-sm font-medium truncate">{user.fullName || user.username}</p>
        <p className="text-[10px] text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
      </div>
    </div>
  );
}
