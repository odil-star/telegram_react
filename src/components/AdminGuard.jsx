import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { adminMe } from "../api/api";
import { ErrorBanner } from "./ErrorBanner";

export function AdminGuard({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, authenticated: false, error: "" });

  useEffect(() => {
    let alive = true;
    adminMe()
      .then(() => {
        if (alive) setState({ loading: false, authenticated: true, error: "" });
      })
      .catch((error) => {
        if (!alive) return;
        if (error.status === 401) {
          setState({ loading: false, authenticated: false, error: "" });
        } else {
          setState({ loading: false, authenticated: false, error: error.message });
        }
      });
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (state.loading) {
    return <div className="glass mx-auto max-w-xl rounded-3xl p-6 text-center font-black text-slate-500">Проверяем вход...</div>;
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-xl pt-8">
        <ErrorBanner message={state.error} />
      </div>
    );
  }

  if (!state.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
