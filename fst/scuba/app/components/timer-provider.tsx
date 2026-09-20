"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type TimerContextValue = {
  seconds: number;
  running: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  const value = useMemo(
    () => ({
      seconds,
      running,
      start: () => setRunning(true),
      pause: () => setRunning(false),
      reset: () => {
        setSeconds(0);
        setRunning(false);
      },
    }),
    [seconds, running]
  );

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used inside a TimerProvider");
  }
  return context;
}
