import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Plane, Target, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/page-meta";
import hero from "@/assets/hero.jpg";

export function Landing() {
  usePageMeta({
    title: "機票降價通知 — 台北出發，低價入手",
    description: "為台北出發的熱門航線設定目標價格，最低票價一降到你的預算，立刻寄信通知你。",
    ogTitle: "機票降價通知",
    ogDescription: "說出你的預算，我們幫你盯票價，降到目標價立刻通知。",
  });
  const { data: routes } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("routes").select("*").order("current_lowest");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <section className="relative min-h-[88vh] bg-ink text-ink-foreground overflow-hidden">
        <img src={hero} alt="日出時分雲海上的機翼" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl">
            <Plane className="h-5 w-5 text-primary" /> 機票降價通知
          </Link>
          <Button asChild variant="heroGhost" size="sm"><Link to="/sign-in">登入</Link></Button>
        </nav>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-28">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-primary">台北出發 · 低價入手</p>
          <h1 className="max-w-2xl text-5xl md:text-7xl leading-[1.1]">
            說出你的預算，<br /><em className="text-primary">好價出現我們通知你。</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ink-foreground/80">
            不在意確切的出發日期？為台北出發的熱門航線設定目標價格，最低票價一降到你的預算，我們立刻寄信通知你。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/sign-up">免費開始盯票價 <ArrowRight /></Link></Button>
            <Button asChild variant="heroGhost" size="lg"><a href="#routes">看看今日票價</a></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 grid gap-10 md:grid-cols-3">
        {[
          { icon: Target, t: "選航線、設價格", d: "東京低於 5,000？曼谷低於 4,000？目標價由你決定。" },
          { icon: Bell, t: "我們每天幫你盯", d: "我們持續追蹤各日期的最低票價，你不用再一直重新整理。" },
          { icon: Mail, t: "收到信就下單", d: "票價一降到你的目標，通知信立刻寄到你的信箱。就這麼簡單。" },
        ].map(({ icon: Icon, t, d }, i) => (
          <div key={t}>
            <div className="mb-4 flex items-center gap-3 text-primary">
              <span className="font-display text-4xl">0{i + 1}</span><Icon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section id="routes" className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl md:text-5xl">台北出發，現在的最低票價</h2>
          <p className="mt-3 text-muted-foreground">經濟艙來回、不限日期，每日更新。</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes?.map((r) => (
              <div key={r.id} className="flex overflow-hidden rounded-xl bg-card shadow-ticket">
                <div className="flex-1 p-5">
                  <div className="text-xs tracking-widest text-muted-foreground">TPE → {r.destination}</div>
                  <div className="mt-1 font-display text-2xl">{r.city_zh} <span className="text-base text-muted-foreground">{r.city_en}</span></div>
                </div>
                <div className="ticket-perf bg-secondary" />
                <div className="flex flex-col justify-center bg-accent px-5 text-right">
                  <div className="text-xs text-muted-foreground">最低</div>
                  <div className="font-display text-xl">NT${r.current_lowest.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl">下一趟旅行，看價格，不看日期。</h2>
        <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/sign-up">免費建立降價通知</Link></Button>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 機票降價通知</footer>
    </div>
  );
}
