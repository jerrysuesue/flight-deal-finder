import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, BellRing } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "我的降價通知 — 機票降價通知" },
      { name: "description", content: "你的台北出發機票降價通知。" },
      { property: "og:title", content: "我的降價通知 — 機票降價通知" },
      { property: "og:description", content: "你的台北出發機票降價通知。" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const [routeId, setRouteId] = useState("");
  const [target, setTarget] = useState("");

  const routes = useQuery({
    queryKey: ["routes"],
    queryFn: async () => (await supabase.from("routes").select("*").order("city_en")).data ?? [],
  });
  const alerts = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("price_alerts").select("*, routes(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("price_alerts").insert({ route_id: routeId, target_price: Number(target) });
      if (error) throw error;
    },
    onSuccess: () => { setTarget(""); setRouteId(""); qc.invalidateQueries({ queryKey: ["alerts"] }); toast.success("已建立降價通知"); },
    onError: (e: Error) => toast.error(e.message.includes("duplicate") ? "你已經在追蹤這條航線了" : e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => { await supabase.from("price_alerts").update({ active }).eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { await supabase.from("price_alerts").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  return (
    <div>
      <h1 className="text-4xl">我的降價通知</h1>
      <p className="mt-2 text-muted-foreground">最低票價一降到你的目標價，我們就寄信通知你。</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (routeId && Number(target) > 0) add.mutate(); }}
        className="mt-8 grid gap-3 rounded-2xl bg-card p-5 shadow-ticket sm:grid-cols-[1fr_180px_auto]"
      >
        <Select value={routeId} onValueChange={setRouteId}>
          <SelectTrigger><SelectValue placeholder="選擇台北出發的目的地" /></SelectTrigger>
          <SelectContent>
            {routes.data?.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.city_zh} {r.city_en} ({r.destination}) · 目前 NT${r.current_lowest.toLocaleString()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="number" min={1} placeholder="目標價 NT$" value={target} onChange={(e) => setTarget(e.target.value)} />
        <Button type="submit" variant="hero" disabled={add.isPending}>新增通知</Button>
      </form>

      <div className="mt-8 space-y-3">
        {alerts.data?.length === 0 && <p className="py-12 text-center text-muted-foreground">還沒有通知——從上方選一條航線開始。</p>}
        {alerts.data?.map((a) => {
          const r = a.routes!;
          const hit = r.current_lowest <= a.target_price;
          return (
            <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl bg-card p-5 shadow-ticket">
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs tracking-widest text-muted-foreground">TPE → {r.destination}</div>
                <div className="font-display text-2xl">{r.city_zh} <span className="text-base text-muted-foreground">{r.city_en}</span></div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">目標價</div>
                <div className="font-display text-lg">NT${a.target_price.toLocaleString()}</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">目前最低</div>
                <div className={`font-display text-lg ${hit ? "text-success" : ""}`}>NT${r.current_lowest.toLocaleString()}</div>
              </div>
              {hit && <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold"><BellRing className="h-3 w-3" /> 達標！</span>}
              <Switch checked={a.active} onCheckedChange={(v) => toggle.mutate({ id: a.id, active: v })} aria-label="開關通知" />
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(a.id)} aria-label="刪除通知"><Trash2 /></Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
