// src/hooks/useCountdown.js
import { useState, useEffect, useCallback } from "react";

export default function useCountdown(initial = 60) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const start = useCallback(() => setSeconds(initial), [initial]);
  const running = seconds > 0;

  return { seconds, start, running };
}
