import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Plane, Target, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "機票降價通知 Flight Price Notifier — Fly from Taipei on budget" },
      { name: "description", content: "Set a target price for popular routes from Taipei. We email you the moment the cheapest fare drops below it." },
      { property: "og:title", content: "機票降價通知 Flight Price Notifier" },
      { property: "og:description", content: "Name your budget. We watch the fares from Taipei and email you when it's a deal." },
    ],
  }),
  component: Landing,
});

function Landing() {
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
        <img src={hero} alt="Plane wing above clouds at sunrise" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl">
            <Plane className="h-5 w-5 text-primary" /> 機票降價通知
          </Link>
          <Button asChild variant="heroGhost" size="sm"><Link to="/auth">Sign in</Link></Button>
        </nav>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-28">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-primary">Flight Price Notifier · from TPE</p>
          <h1 className="max-w-2xl text-5xl md:text-7xl leading-[1.02]">
            Name your budget.<br /><em className="text-primary">We'll tell you when.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ink-foreground/80">
            Don't care exactly when you fly? Set a target price on popular routes from Taipei — we email you the moment the cheapest fare drops to it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/auth">Start watching — free <ArrowRight /></Link></Button>
            <Button asChild variant="heroGhost" size="lg"><a href="#routes">See today's fares</a></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 grid gap-10 md:grid-cols-3">
        {[
          { icon: Target, t: "Pick a route & a price", d: "Tokyo under NT$5,000? Bangkok under NT$4,000? You set the number." },
          { icon: Bell, t: "We watch every day", d: "We track the cheapest fare across dates so you don't have to refresh." },
          { icon: Mail, t: "Get the email, book it", d: "When the fare hits your target, it lands in your inbox. That's it." },
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
          <h2 className="text-4xl md:text-5xl">Lowest fares from Taipei, right now</h2>
          <p className="mt-3 text-muted-foreground">Round-trip economy, any date. Updated daily.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes?.map((r) => (
              <div key={r.id} className="flex overflow-hidden rounded-xl bg-card shadow-ticket">
                <div className="flex-1 p-5">
                  <div className="text-xs tracking-widest text-muted-foreground">TPE → {r.destination}</div>
                  <div className="mt-1 font-display text-2xl">{r.city_zh} <span className="text-base text-muted-foreground">{r.city_en}</span></div>
                </div>
                <div className="ticket-perf bg-secondary" />
                <div className="flex flex-col justify-center bg-accent px-5 text-right">
                  <div className="text-xs text-muted-foreground">from</div>
                  <div className="font-display text-xl">NT${r.current_lowest.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl">Your next trip is a price, not a date.</h2>
        <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/auth">Create a free alert</Link></Button>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 機票降價通知 Flight Price Notifier</footer>
    </div>
  );
}
