import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { trackVisit } from "../api/api";
import { AddressPrompt } from "../components/AddressPrompt";
import { BottomNav } from "../components/BottomNav";
import { useTelegramAuth } from "../hooks/useTelegramAuth";

export function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    trackVisit({
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    }).catch(() => {});
  }, [location.pathname, location.search]);

  if (isAdmin) {
    return (
      <div className="min-h-screen px-4 py-3">
        <Outlet />
      </div>
    );
  }

  return <ClientLayout />;
}

function ClientLayout() {
  const { user, setUser, loading, error, refreshProfile } = useTelegramAuth();

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-32 pt-4">
      <AddressPrompt user={user} onSaved={setUser} />
      {loading ? (
        <div className="glass rounded-3xl p-5 text-center font-black text-slate-500">Подключаем Telegram...</div>
      ) : null}
      <Outlet context={{ user, setUser, authLoading: loading, authError: error, refreshProfile }} />
      <BottomNav />
    </div>
  );
}
