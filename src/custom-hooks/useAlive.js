import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendAlive } from "../services/aliveService";

const ALIVE_INTERVAL_MS = 30000;

const useAlive = () => {
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    const ping = () => {
      if (!mounted) return;
      sendAlive(`${location.pathname}${location.search}`).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") ping();
    };

    ping();
    intervalId = window.setInterval(ping, ALIVE_INTERVAL_MS);
    window.addEventListener("focus", ping);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
      window.removeEventListener("focus", ping);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname, location.search]);
};

export { useAlive };
