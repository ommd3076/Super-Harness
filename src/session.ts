import { useState } from 'react';

export type Area = 'Chat' | 'Study' | 'Workspace' | 'Research' | 'Live';
export type Exchange = { id: string; input: string; scene: string; attachments: string[]; started: number };
export type Session = { id: string; title: string; area: Area; model: string; draft: string; scene?: string; exchanges: Exchange[]; attachments: string[] };
export type Preferences = { appearance: string; density: string; width: string; composer: string; thinking: string; motion: string; activity: string; code: string; voice: 'fluid' | 'matrix' };
export const defaults: Preferences = { appearance: 'Light', density: 'Comfortable', width: 'Standard', composer: 'Rounded', thinking: 'Orbit', motion: 'Subtle', activity: 'Expanded', code: 'Comfortable', voice: 'fluid' };
export const newSession = (area: Area = 'Chat', title = area === 'Chat' ? 'New chat' : area, scene?: string): Session => ({
  id: crypto.randomUUID(), title, area, model: 'Harness 1.0', draft: '', exchanges: [], attachments: [], scene,
});
export function useStored<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved) as T;
    } catch { /* Local persistence is optional. */ }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });
  const update = (next: T | ((current: T) => T)) => setValue(current => {
    const result = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    try { localStorage.setItem(key, JSON.stringify(result)); } catch { /* Keep in-memory state. */ }
    return result;
  });
  return [value, update] as const;
}

export const examples = [
  {id:'dfa', title:'Automata and formal languages', description:'Make an interactive DFA for strings ending in abb.'},
  {id:'rsa', title:'RSA by hand', description:'Walk me through a numerical RSA example.'},
  {id:'code', title:'API design notes', description:'Help me practice an Express and Mongoose update.'},
  {id:'assessment', title:'Check my understanding', description:'Build a short interactive assessment.'},
  {id:'clarification', title:'Scope a project', description:'Ask me clarifying questions about a new project.'},
  {id:'architecture', title:'Platform architecture', description:'Map a software architecture as an interactive diagram.'},
  {id:'agents', title:'Agent execution', description:'Show me a simulated parallel agent run.'},
  {id:'finance', title:'Q4 scenario analysis', description:'Model financial scenarios with adjustable assumptions.'},
  {id:'evidence', title:'Evidence explorer', description:'Compare sources in a research evidence matrix.'},
  {id:'mixed', title:'Thinking in systems', description:'Show me a mixed-mode response about measuring a service.'},
  {id:'brief', title:'Build a decision brief', description:'Clarify a decision brief and compare the rollout scenarios.'},
];
export function inferScene(text: string) {
  const rules: [RegExp, string][] = [[/decision brief|\/brief\b/i,'brief'],[/\b(nfa|nondeterministic)\b/i,'nfa'],[/\b(dfa|abb|automata)\b/i,'dfa'],[/\brsa\b/i,'rsa'],[/express|mongoose/i,'code'],[/quiz|assessment|test my/i,'assessment'],[/clarif|scope a project/i,'clarification'],[/architecture|node.edge/i,'architecture'],[/agent|parallel run/i,'agents'],[/financ|revenue|scenario/i,'finance'],[/evidence|research|compare sources/i,'evidence'],[/mixed.mode|measuring a service|thinking in systems/i,'mixed']];
  return rules.find(([expression]) => expression.test(text))?.[1] ?? 'conversation';
}
