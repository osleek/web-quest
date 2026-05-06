import { useState, useEffect, useRef, useCallback } from 'react';

const TIMER_KEY = 'cs_museum_timer';

function loadTimerState() {
  try {
    const raw = sessionStorage.getItem(TIMER_KEY);
    if (!raw) return { timerStartedAt: null, timerElapsed: 0, timerRunning: false };
    return JSON.parse(raw);
  } catch {
    return { timerStartedAt: null, timerElapsed: 0, timerRunning: false };
  }
}

function saveTimerState(state) {
  try {
    sessionStorage.setItem(TIMER_KEY, JSON.stringify(state));
  } catch {}
}

export function useTimer() {
  const saved = loadTimerState();

  const initialElapsed = saved.timerRunning && saved.timerStartedAt
    ? saved.timerElapsed + Math.floor((Date.now() - saved.timerStartedAt) / 1000)
    : saved.timerElapsed;

  const [elapsed, setElapsed] = useState(initialElapsed);
  const [running, setRunning] = useState(saved.timerRunning);

  const startedAtRef = useRef(saved.timerRunning ? Date.now() - (initialElapsed - saved.timerElapsed) * 1000 : null);
  const baseElapsedRef = useRef(saved.timerRunning ? saved.timerElapsed : initialElapsed);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = baseElapsedRef.current + Math.floor((now - startedAtRef.current) / 1000);
        setElapsed(newElapsed);
        saveTimerState({ timerStartedAt: startedAtRef.current, timerElapsed: baseElapsedRef.current, timerRunning: true });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const startTimer = useCallback(() => {
    if (running) return;
    const now = Date.now();
    startedAtRef.current = now;
    baseElapsedRef.current = elapsed;
    setRunning(true);
    saveTimerState({ timerStartedAt: now, timerElapsed: elapsed, timerRunning: true });
  }, [running, elapsed]);

  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    saveTimerState({ timerStartedAt: null, timerElapsed: elapsed, timerRunning: false });
  }, [elapsed]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setRunning(false);
    startedAtRef.current = null;
    baseElapsedRef.current = 0;
    saveTimerState({ timerStartedAt: null, timerElapsed: 0, timerRunning: false });
  }, []);

  const getElapsed = useCallback(() => elapsed, [elapsed]);

  return { elapsed, running, startTimer, stopTimer, resetTimer, getElapsed };
}
