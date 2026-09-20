import fs from 'fs';
import path from 'path';

export interface DiveLog {
  id: string;
  location: string;
  depth: number;
  duration: number; // in minutes
  date: string;
}

const dbPath = path.join(process.cwd(), 'dive-logs.json');

// Initialize DB file if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
};

export const getLogs = (): DiveLog[] => {
  initDb();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

export const addLog = (log: Omit<DiveLog, 'id'>): DiveLog => {
  const logs = getLogs();
  const newLog = { ...log, id: Date.now().toString() };
  logs.push(newLog);
  fs.writeFileSync(dbPath, JSON.stringify(logs, null, 2));
  return newLog;
};

export const updateLog = (id: string, updatedLog: Partial<DiveLog>): DiveLog | null => {
  const logs = getLogs();
  const index = logs.findIndex((log) => log.id === id);
  if (index === -1) return null;

  const log = { ...logs[index], ...updatedLog };
  logs[index] = log;
  fs.writeFileSync(dbPath, JSON.stringify(logs, null, 2));
  return log;
};

export const deleteLog = (id: string): boolean => {
  const logs = getLogs();
  const filteredLogs = logs.filter((log) => log.id !== id);
  if (logs.length === filteredLogs.length) return false;

  fs.writeFileSync(dbPath, JSON.stringify(filteredLogs, null, 2));
  return true;
};
