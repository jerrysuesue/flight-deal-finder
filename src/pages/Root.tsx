import { Outlet, Link, useRevalidator, useRouteError } from "react-router";
import { useEffect } from "react";

import { queryClient } from "@/lib/query-client";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">找不到這個頁面</h2>
        <p className="mt-2 text-sm text-muted-foreground">你要找的頁面不存在，或已經被移動了。</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">頁面載入失敗</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          我們這邊出了一點問題，你可以重新整理，或回到首頁。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            再試一次
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            回到首頁
          </a>
        </div>
      </div>
    </div>
  );
}

export function Root() {
  const { revalidate } = useRevalidator();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      // Re-run route loaders (e.g. the /app auth guard) when the session changes.
      setTimeout(() => void revalidate(), 0);
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [revalidate]);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
