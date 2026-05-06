import { useState, useCallback } from 'react';
import { getLeaderboard as fetchLeaderboard } from '../utils/api';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLeaderboard();
    if (err) {
      setError(err);
    } else {
      setLeaderboard(data?.leaderboard || []);
    }
    setLoading(false);
  }, []);

  return { leaderboard, loading, error, loadLeaderboard };
}
