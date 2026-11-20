import { useId, useRef, useState } from 'react';
import Flowchart from '../upstream/Flowchart';
import { UpstreamReview } from '../upstream/ReferenceKit';
import { useStored } from '../session';

export function ParameterChart({ title, points, multiplier }: {
  title: string;
  points: { label: string; value: number }[];
  multiplier: number;
}) {
  if (points.length === 0) return <p className="iu-caption">No chart values available.</p>;
  const scale = Math.min(3, Math.max(0, multiplier));
  const upper = Math.max(1, ...points.map(point => point.value * 1.6), ...points.map(point => point.value * scale));
  const lower = Math.min(0, ...points.map(point => point.value * 1.6), ...points.map(point => point.value * scale));
  const samples = points.map((point, index) => ({
    ...point,
    x: 17 + index * 286 / Math.max(1, points.length - 1),
    y: 124 - (point.value * scale - lower) * 108 / (upper - lower),
    result: Math.round(point.value * scale * 10) / 10,
  }));
  return <figure className="iu-output">
    <figcaption><strong>{title || 'Projection'}</strong><span>{Math.round(scale * 100)}% of baseline</span></figcaption>
    <svg viewBox="0 0 320 142" role="img" aria-label={`${title || 'Projection'} at ${Math.round(scale * 100)} percent of baseline`}>
      <path className="iu-chart-grid" d="M17 16H303 M17 70H303 M17 124H303"/>
      <polyline className="iu-chart-line" points={samples.map(({ x, y }) => `${x},${y}`).join(' ')}/>
      {samples.map(({ label, result, x, y }, index)=><circle key={index} cx={x} cy={y} r="3.5"><title>{label}: {result}</title></circle>)}
    </svg>
    <dl className="iu-chart-values">{samples.map(({ label, result }, index)=><div key={index}><dt>{label}</dt><dd>{result}</dd></div>)}</dl>
  </figure>;
}

export function DataTable({ title, data, columns, editable, cell, onCell }: {
  title: string;
  data: string[][];
  columns: string[];
  editable?: boolean;
  cell: (row: number, column: number) => string;
  onCell: (row: number, column: number, value: string) => void;
}) {
  return <div className="iu-output iu-table-wrap" tabIndex={0} role="region" aria-label={title || 'Data table'}>
    <table className="iu-table">
      <caption>{title || 'Data table'}</caption>
      <thead><tr>{columns.map((label, column)=><th scope="col" key={column}>{label}</th>)}</tr></thead>
      <tbody>{data.map((row, index)=><tr key={index}>{row.map((_, column)=><td key={column}>{editable
        ? <input aria-label={`${columns[column]}, row ${index + 1}`} value={cell(index, column)} maxLength={200} onChange={event=>onCell(index,column,event.target.value)}/>
        : cell(index,column)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

export function WorkflowDiagram({ title, blocks }: { title: string; blocks: { label: string; description: string }[] }) {
  const steps = blocks.map((block, index)=>({id:`step-${index}`,row:index,w:300,x:.5,title:block.label,caption:block.description}));
  const edges = steps.slice(1).map((step,index)=>({ from:steps[index].id, to:step.id }));
  return <section className="iu-diagram" aria-label={title || 'Workflow diagram'}>
    <h3>{title || 'Workflow diagram'}</h3>
    {steps.length > 0 ? <Flowchart steps={steps} edges={edges}/> : <p className="iu-caption">No workflow steps available.</p>}
  </section>;
}

const escapeText = (value: string) => value.replace(/[<>&]/g, char => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[char]!));

type Version = { id: string; content: string; savedAt: string };

export function ArtifactPreview({ title, content, isolated, versionKey, onRestore }: {
  title: string;
  content: string;
  isolated: boolean;
  versionKey: string;
  onRestore?: (value: string) => void;
}) {
  const previewText = content || 'Write a draft to see its preview.';
  const label = title || 'Draft preview';
  const readerTitle = useId();
  const reader = useRef<HTMLDialogElement>(null);
  const [saved, setSaved] = useStored<Version[]>(versionKey, []);
  const [selectedId, select] = useState('');
  const versions = Array.isArray(saved) ? saved : [];
  const selected = versions.find(version=>version.id===selectedId);

  function saveVersion() {
    const version = { id: crypto.randomUUID(), content, savedAt: new Date().toISOString() };
    setSaved(current=>[version, ...(Array.isArray(current) ? current : [])].slice(0, 10));
    select(version.id);
  }

  return <section className="iu-output iu-artifact">
    <h3>{label}</h3>
    {isolated
      ? <iframe title={title || 'Sandboxed document preview'} sandbox=""
          srcDoc={`<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><meta name="viewport" content="width=device-width"><style>body{margin:0;padding:16px;font:14px/1.55 system-ui;color:#292e36;background:#f5f7fa;white-space:pre-wrap;overflow-wrap:anywhere}</style><body>${escapeText(previewText)}</body></html>`}/>
      : <p>{previewText}</p>}
    <div className="iu-actions">
      <button className="iu-secondary" type="button" onClick={()=>reader.current?.showModal()}>Read draft</button>
      {onRestore && <button className="iu-secondary" type="button" disabled={!content.trim() || versions[0]?.content===content} onClick={saveVersion}>Save version</button>}
    </div>
    {versions.length > 0 && <details className="iu-versions">
      <summary>Saved versions ({versions.length})</summary>
      <label>Version
        <select value={selectedId} onChange={event=>select(event.target.value)}>
          <option value="">Choose a saved version</option>
          {versions.map((version,index)=><option key={version.id} value={version.id}>Version {versions.length-index} · {new Date(version.savedAt).toLocaleString()}</option>)}
        </select>
      </label>
      {selected && <>
        <p>{selected.content}</p>
        <button type="button" className="iu-secondary" onClick={()=>onRestore?.(selected.content)}>Restore this version</button>
      </>}
    </details>}
    <dialog ref={reader} aria-labelledby={readerTitle} className="iu-reader">
      <header><h2 id={readerTitle}>{label}</h2><button type="button" className="iu-secondary" onClick={()=>reader.current?.close()}>Close reader</button></header>
      <p>{previewText}</p>
    </dialog>
  </section>;
}

export function LocalApproval({ title, value, onDecision }: { title: string; value: string; onDecision: (decision: string) => void }) {
  return <section className="iu-approval" aria-label="Local approval">
    {value
      ? <div className="iu-actions"><p role="status">{value}</p><button className="iu-secondary" type="button" onClick={()=>onDecision('')}>Review again</button></div>
      : <UpstreamReview questions={[{ q:title || 'Approve this local change?', type:'radio', options:['Approve local change','Request changes'] }]}
          labels={{ send:'Record decision' }} onSubmitted={answers=>onDecision(answers[0]?.includes(0) ? 'Local change approved.' : 'Changes requested.')}/>}
  </section>;
}
