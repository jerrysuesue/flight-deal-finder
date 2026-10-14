CREATE TABLE public.routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin text NOT NULL DEFAULT 'TPE',
  destination text NOT NULL,
  city_en text NOT NULL,
  city_zh text NOT NULL,
  current_lowest integer NOT NULL,
  currency text NOT NULL DEFAULT 'TWD',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (origin, destination)
);
GRANT SELECT ON public.routes TO anon, authenticated;
GRANT ALL ON public.routes TO service_role;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Routes are public" ON public.routes FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.routes (destination, city_en, city_zh, current_lowest) VALUES
('NRT','Tokyo','東京',6890),('KIX','Osaka','大阪',5980),('ICN','Seoul','首爾',5490),
('OKA','Okinawa','沖繩',4280),('BKK','Bangkok','曼谷',5120),('SIN','Singapore','新加坡',6350),
('HKG','Hong Kong','香港',3890),('FUK','Fukuoka','福岡',5650),('DAD','Da Nang','峴港',6990),
('CTS','Sapporo','札幌',8920);

CREATE TABLE public.price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  target_price integer NOT NULL CHECK (target_price > 0),
  active boolean NOT NULL DEFAULT true,
  last_notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, route_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_alerts TO authenticated;
GRANT ALL ON public.price_alerts TO service_role;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own alerts select" ON public.price_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own alerts insert" ON public.price_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own alerts update" ON public.price_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own alerts delete" ON public.price_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);