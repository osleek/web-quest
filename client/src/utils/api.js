const BASE_URL = '/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();
    if (!res.ok) return { error: data.error || `HTTP ${res.status}`, data: null };
    return { error: null, data };
  } catch {
    return { error: 'Ошибка соединения с сервером.', data: null };
  }
}

export async function startSession(operatorName) {
  return request('POST', '/session/start', { operatorName });
}

export async function getNode(nodeId) {
  return request('GET', `/nodes/${nodeId}`);
}

export async function submitAnswer(nodeId, answer, attemptNumber) {
  return request('POST', `/nodes/${nodeId}/answer`, { answer, attemptNumber });
}

export async function executeSql(query) {
  return request('POST', '/sql/execute', { query });
}

export async function getSqlTable() {
  return request('GET', '/sql/table');
}

export async function getLeaderboard() {
  return request('GET', '/leaderboard');
}

export async function submitResult(operatorName, score, elapsedTime) {
  return request('POST', '/leaderboard', { operatorName, score, elapsedTime });
}
