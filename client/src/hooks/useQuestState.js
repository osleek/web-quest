import { useState, useCallback } from 'react';

const STORAGE_KEY = 'cs_museum_quest_state';

const INITIAL_STATE = {
  operatorName: null,
  currentNodeId: 1,
  unlockedNodes: [1],
  score: 0,
  nodeAttempts: {},
  nodeResults: {},
  completed: false,
};

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useQuestState() {
  const [state, setState] = useState(() => loadState());

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveState(next);
      return next;
    });
  }, []);

  const setOperatorName = useCallback((name) => {
    updateState((prev) => ({ ...prev, operatorName: name }));
  }, [updateState]);

  const completeNode = useCallback((nodeId, pointsAwarded, correct) => {
    updateState((prev) => {
      const nextNodeId = nodeId + 1;
      const unlockedNodes = prev.unlockedNodes.includes(nextNodeId)
        ? prev.unlockedNodes
        : [...prev.unlockedNodes, nextNodeId];

      return {
        ...prev,
        score: prev.score + (pointsAwarded || 0),
        currentNodeId: nextNodeId <= 10 ? nextNodeId : prev.currentNodeId,
        unlockedNodes,
        nodeResults: { ...prev.nodeResults, [nodeId]: { correct, pointsAwarded } },
        completed: nodeId === 10,
      };
    });
  }, [updateState]);

  const incrementAttempt = useCallback((nodeId) => {
    let newAttempt = 1;
    updateState((prev) => {
      newAttempt = (prev.nodeAttempts[nodeId] || 0) + 1;
      return { ...prev, nodeAttempts: { ...prev.nodeAttempts, [nodeId]: newAttempt } };
    });
    return newAttempt;
  }, [updateState]);

  const resetQuest = useCallback(() => {
    saveState(INITIAL_STATE);
    setState(INITIAL_STATE);
  }, []);

  return { state, setOperatorName, completeNode, incrementAttempt, resetQuest };
}
