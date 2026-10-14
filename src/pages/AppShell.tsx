import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Plane, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { requireUser } from "@/routes";

export function AppShell() {
  const { user } = useLoaderData<typeof requireUser>();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  }
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/app" className="flex items-center gap-2 font-display text-lg"><Plane className="h-5 w-5 text-primary" /> 機票降價通知</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-ink-foreground/70">{user.email}</span>
            <Button variant="heroGhost" size="sm" onClick={signOut}><LogOut /> 登出</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10"><Outlet /></main>
    </div>
  );
}
