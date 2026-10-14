import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Plane, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Shell,
});

function Shell() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg"><Plane className="h-5 w-5 text-primary" /> 機票降價通知</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-ink-foreground/70">{user.email}</span>
            <Button variant="heroGhost" size="sm" onClick={signOut}><LogOut /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10"><Outlet /></main>
    </div>
  );
}
