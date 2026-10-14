import { redirect, type RouteObject } from "react-router";

import { supabase } from "@/integrations/supabase/client";
import { Root, ErrorPage, NotFound } from "./pages/Root";
import { Landing } from "./pages/Landing";
import { AuthPage } from "./pages/Auth";
import { AppShell } from "./pages/AppShell";
import { Dashboard } from "./pages/Dashboard";

// Guards /app: unauthenticated visitors are sent to /sign-in.
export async function requireUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect("/sign-in");
  return { user: data.user };
}

export const routes: RouteObject[] = [
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Landing /> },
      { path: "sign-in", element: <AuthPage mode="in" /> },
      { path: "sign-up", element: <AuthPage mode="up" /> },
      // Legacy URL: earlier confirmation emails and OAuth flows return to /auth.
      { path: "auth", element: <AuthPage mode="in" /> },
      {
        path: "app",
        loader: requireUser,
        element: <AppShell />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      { path: "dashboard", loader: () => redirect("/app") },
      { path: "*", element: <NotFound /> },
    ],
  },
];
