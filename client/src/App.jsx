import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';

import TerminalLayout from './components/TerminalLayout';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import QuestIntro from './components/QuestIntro';
import NodeTransition from './components/NodeTransition';
import ResultsScreen from './components/ResultsScreen';

import { useQuestState } from './hooks/useQuestState';
import { useTimer } from './hooks/useTimer';

import Node01Ada from './components/nodes/Node01Ada';
import Node02Turing from './components/nodes/Node02Turing';
import Node03Shannon from './components/nodes/Node03Shannon';
import Node04Cerf from './components/nodes/Node04Cerf';
import Node05Berners from './components/nodes/Node05Berners';
import Node06Codd from './components/nodes/Node06Codd';
import Node07Knuth from './components/nodes/Node07Knuth';
import Node08Hopper from './components/nodes/Node08Hopper';
import Node09Neumann from './components/nodes/Node09Neumann';
import Node10Torvalds from './components/nodes/Node10Torvalds';

const NODE_COMPONENTS = {
  1: Node01Ada, 2: Node02Turing, 3: Node03Shannon, 4: Node04Cerf, 5: Node05Berners,
  6: Node06Codd, 7: Node07Knuth, 8: Node08Hopper, 9: Node09Neumann, 10: Node10Torvalds,
};

function NodeRoute({ questState, onNodeComplete }) {
  const { id } = useParams();
  const nodeId = parseInt(id, 10);

  if (!questState.unlockedNodes.includes(nodeId)) {
    return <Navigate to={`/node/${questState.currentNodeId}`} replace />;
  }

  const NodeComponent = NODE_COMPONENTS[nodeId];
  if (!NodeComponent) return <Navigate to="/" replace />;

  return (
    <NodeComponent
      nodeId={nodeId}
      questState={questState}
      onComplete={(pointsAwarded, correct) => onNodeComplete(nodeId, pointsAwarded, correct)}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { state: questState, setOperatorName, completeNode, resetQuest } = useQuestState();
  const timer = useTimer();
  const [transition, setTransition] = useState(null);

  const handleLogin = useCallback((operatorName) => {
    setOperatorName(operatorName);
    navigate('/intro');
  }, [setOperatorName, navigate]);

  const handleQuestStart = useCallback(() => {
    timer.startTimer();
    navigate('/node/1');
  }, [timer, navigate]);

  const handleNodeComplete = useCallback((nodeId, pointsAwarded, correct) => {
    completeNode(nodeId, pointsAwarded, correct);
    if (nodeId === 10) {
      timer.stopTimer();
      navigate('/results');
    } else {
      setTransition({ nodeId });
    }
  }, [completeNode, timer, navigate]);

  const handleTransitionComplete = useCallback(() => {
    const nextId = transition?.nodeId + 1;
    setTransition(null);
    navigate(`/node/${nextId}`);
  }, [transition, navigate]);

  const handleReset = useCallback(() => {
    resetQuest();
    timer.resetTimer();
    navigate('/');
  }, [resetQuest, timer, navigate]);

  if (transition) {
    return (
      <TerminalLayout>
        <NodeTransition nodeId={transition.nodeId} onComplete={handleTransitionComplete} />
      </TerminalLayout>
    );
  }

  return (
    <TerminalLayout>
      {questState.operatorName && (
        <Header currentNodeId={questState.currentNodeId} score={questState.score} elapsed={timer.elapsed} />
      )}
      <Routes>
        <Route path="/" element={questState.operatorName ? <Navigate to="/intro" replace /> : <LoginScreen onLogin={handleLogin} />} />
        <Route path="/intro" element={!questState.operatorName ? <Navigate to="/" replace /> : <QuestIntro operatorName={questState.operatorName} onStart={handleQuestStart} />} />
        <Route path="/node/:id" element={!questState.operatorName ? <Navigate to="/" replace /> : <NodeRoute questState={questState} onNodeComplete={handleNodeComplete} />} />
        <Route path="/results" element={!questState.operatorName ? <Navigate to="/" replace /> : <ResultsScreen questState={questState} elapsedTime={timer.elapsed} onReset={handleReset} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TerminalLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
