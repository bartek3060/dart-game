import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { usePlayerGameContext } from "@/contexts/PlayerGameContext/usePlayerGameContext";

export function RouteResetListener() {
  const location = useLocation();
  const { resetGame } = usePlayerGameContext();
  const prevPathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    // Reset game when leaving gameplay route
    if (
      prevPathnameRef.current === "/gameplay" &&
      location.pathname !== "/gameplay"
    ) {
      resetGame();
    }
    prevPathnameRef.current = location.pathname;
  }, [location.pathname, resetGame]);

  return null;
}
