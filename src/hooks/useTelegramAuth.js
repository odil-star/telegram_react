import WebApp from "@twa-dev/sdk";
import { useCallback, useEffect, useState } from "react";

import { getProfile, getStoredUser, saveStoredUser, telegramAuth } from "../api/api";

const demoPayload = {
  initDataUnsafe: {
    user: {
      id: "8226698296",
      first_name: "Frontend developer",
      last_name: "",
      username: "frontendMmM",
      photo_url: "",
    },
  },
};

let authRequest = null;

function getTelegramPayload() {
  const sdk = WebApp || window.Telegram?.WebApp;
  const hasTelegramPayload = Boolean(sdk?.initData || sdk?.initDataUnsafe?.user);

  if (!hasTelegramPayload) {
    return demoPayload;
  }

  return {
    initData: sdk.initData,
    initDataUnsafe: sdk.initDataUnsafe,
  };
}

function authenticateTelegram() {
  if (!authRequest) {
    authRequest = telegramAuth(getTelegramPayload()).catch((error) => {
      authRequest = null;
      throw error;
    });
  }
  return authRequest;
}

function applyTelegramTheme() {
  const tg = window.Telegram?.WebApp || WebApp;
  const version = Number.parseFloat(tg?.version || "0");

  if (version >= 6.1) {
    tg.setHeaderColor?.("#fff7ed");
    tg.setBackgroundColor?.("#fff7ed");
  }
}

export function useTelegramAuth() {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProfile = useCallback(async () => {
    try {
      const nextUser = await getProfile();
      saveStoredUser(nextUser);
      setUser(nextUser);
      return nextUser;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function auth() {
      setLoading(true);
      setError("");
      try {
        WebApp.ready();
        WebApp.expand();
        applyTelegramTheme();

        const nextUser = await authenticateTelegram();
        if (alive) setUser(nextUser);
      } catch (err) {
        if (alive) setError(err.message || "Не удалось войти через Telegram");
      } finally {
        if (alive) setLoading(false);
      }
    }

    auth();
    return () => {
      alive = false;
    };
  }, []);

  return { user, setUser, loading, error, refreshProfile };
}
