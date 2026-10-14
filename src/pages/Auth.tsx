import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageMeta } from "@/lib/page-meta";

export function AuthPage({ mode }: { mode: "in" | "up" }) {
  usePageMeta({
    title: "登入 — 機票降價通知",
    description: "登入以管理你的台北出發機票降價通知。",
    ogTitle: "登入 — 機票降價通知",
    ogDescription: "管理你的機票降價通知。",
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app", { replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate("/app", { replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/sign-in" } });
      if (error) toast.error(error.message);
      else toast.success("請到信箱收確認信，完成帳號開通。");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setBusy(false);
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/sign-in" },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-ticket">
        <Link to="/" className="mb-6 flex items-center gap-2 font-display text-xl"><Plane className="h-5 w-5 text-primary" /> 機票降價通知</Link>
        <h1 className="text-3xl">{mode === "in" ? "歡迎回來" : "開始盯票價"}</h1>
        <Button variant="outline" className="mt-6 w-full" onClick={google}>使用 Google 繼續</Button>
        <div className="my-4 text-center text-xs text-muted-foreground">或</div>
        <form onSubmit={submit} className="space-y-3">
          <div><Label htmlFor="email">電子郵件</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="pw">密碼</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>{mode === "in" ? "登入" : "建立帳號"}</Button>
        </form>
        <button className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate(mode === "in" ? "/sign-up" : "/sign-in")}>
          {mode === "in" ? "第一次來？建立帳號" : "已經有帳號了？登入"}
        </button>
      </div>
    </div>
  );
}
