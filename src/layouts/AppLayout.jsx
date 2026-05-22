import { Outlet, useLocation } from "react-router-dom";

import { AddressPrompt } from "../components/AddressPrompt";
import { BottomNav } from "../components/BottomNav";
import { useTelegramAuth } from "../hooks/useTelegramAuth";

export function AppLayout() {
  const { user, setUser, loading, error, refreshProfile } = useTelegramAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "min-h-screen px-4 py-3" : "mx-auto min-h-screen max-w-md px-4 pb-32 pt-4"}>
      {!isAdmin ? <AddressPrompt user={user} onSaved={setUser} /> : null}
      {!isAdmin && loading ? (
        <div className="glass rounded-3xl p-5 text-center font-black text-slate-500">Подключаем Telegram...</div>
      ) : null}
      <Outlet context={{ user, setUser, authLoading: loading, authError: error, refreshProfile }} />
      {!isAdmin ? <BottomNav /> : null}
    </div>
  );
}
