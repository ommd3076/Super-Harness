import React, { useEffect, useState } from 'react';
import './runtime.css';

export type RuntimeValue = string | number | boolean | null;
export type ChoiceOption = string | number | { label: string; value: RuntimeValue; description?: string };
export type Condition = { id: string; equals?: RuntimeValue; notEquals?: RuntimeValue; truthy?: boolean };
type BaseNode = { id?: string; prompt?: string; label?: string; text?: string; value?: RuntimeValue; children?: UIChild[]; items?: UIChild[] };
export type UIChild = string | number | UINode | UIChild[] | null;
export type UINode =
  | (BaseNode & { type: 'stack'|'column'|'row'|'grid'|'card'|'panel'|'group'|'section'|'form'|'steps'; children?: UIChild[]; items?: UIChild[] })
  | (BaseNode & { type: 'heading'|'title'|'caption'|'paragraph'|'clarify'|'feedback'|'text' })
  | (BaseNode & { type: 'input'|'text-input'|'textarea'|'code'; placeholder?: string; rows?: number; required?: boolean })
  | (BaseNode & { type: 'number'|'range'; min?: number; max?: number; step?: number })
  | (BaseNode & { type: 'choice'|'select'; options: ChoiceOption[] })
  | (BaseNode & { type: 'checkbox'; checked?: boolean })
  | (BaseNode & { type: 'button'|'action'; event?: 'submit'|'continue'|'reveal'; disabled?: boolean })
  | (BaseNode & { type: 'conditional'; when: Condition })
  | (BaseNode & { type: 'reveal'; initiallyOpen?: boolean })
  | (BaseNode & { type: 'widget'; widget: 'badge'|'callout'|'metric'|'progress'|'divider'; tone?: 'neutral'|'positive'|'warning'|'negative'; max?: number });

export type RuntimeEventName = 'control.change'|'choice.select'|'control.toggle'|'reveal.toggle'|'form.submit'|'button.submit';
export type RuntimeEvent = { type: RuntimeEventName; status: 'accepted'; nodeId: string; value?: RuntimeValue; sessionId: string; instanceId: string; occurredAt: string };
export type IntelligentUIProps = { definition: unknown; sessionId: string; instanceId: string; onEvent?: (event: RuntimeEvent) => void };

type NodeDef = Record<string, unknown> & { type: string; id?: string; children?: unknown; items?: unknown };
const registry = new Set(['stack','column','row','grid','card','panel','group','section','form','steps','text','heading','title','caption','paragraph','clarify','feedback','input','text-input','textarea','code','number','range','choice','select','checkbox','button','action','conditional','reveal','widget']);
const maxDepth = 40;
const maxString = 4000;
const text = (v: unknown, limit = maxString): string => typeof v === 'string' ? v.slice(0, limit) : typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
const numeric = (v: unknown, fallback: number) => typeof v === 'number' && Number.isFinite(v) ? v : fallback;
const safeValue = (v: unknown): RuntimeValue => typeof v === 'string' ? v.slice(0, maxString) : typeof v === 'number' && Number.isFinite(v) || typeof v === 'boolean' || v === null ? v as RuntimeValue : null;

/** Validates the closed node vocabulary, drops executable/unknown props, and bounds recursive depth. */
export function validateDefinition(value: unknown): UIChild {
  const ancestors = new WeakSet<object>();
  const visit = (input: unknown, depth: number): UIChild => {
    if (input == null || typeof input === 'boolean') return null;
    if (typeof input === 'string') return input.slice(0, maxString);
    if (typeof input === 'number') return Number.isFinite(input) ? input : null;
    if (typeof input !== 'object') return null;
    if (ancestors.has(input)) return { type: 'text', text: '[Circular UI definition]' };
    if (depth >= maxDepth) return { type: 'text', text: '[Nested content limit reached]' };
    ancestors.add(input);
    let result: UIChild;
    if (Array.isArray(input)) {
      result = input.map(child => visit(child, depth + 1));
    } else {
      const raw = input as Record<string, unknown>;
      const typeValue = typeof raw.type === 'string' ? raw.type : raw.kind;
      const type = typeof typeValue === 'string' ? typeValue.toLowerCase().slice(0, 32) : '';
      const base = { type: registry.has(type) ? type : 'text', id: text(raw.id, 120), prompt: text(raw.prompt), label: text(raw.label), text: text(raw.text) } as Record<string, unknown>;
      if (Object.hasOwn(raw, 'value')) base.value = safeValue(raw.value);
      if (Object.hasOwn(raw, 'answer')) base.answer = safeValue(raw.answer);
      for (const key of ['placeholder','event']) if (typeof raw[key] === 'string') base[key] = text(raw[key], 300);
      for (const key of ['min','max','step','rows']) if (typeof raw[key] === 'number' && Number.isFinite(raw[key])) base[key] = raw[key];
      for (const key of ['checked','required','disabled','initiallyOpen']) if (typeof raw[key] === 'boolean') base[key] = raw[key];
      if (raw.when && typeof raw.when === 'object') {
        const when = raw.when as Record<string, unknown>;
        if (typeof when.id === 'string') base.when = { id: text(when.id, 120), equals: when.equals === undefined ? undefined : safeValue(when.equals), notEquals: when.notEquals === undefined ? undefined : safeValue(when.notEquals), truthy: typeof when.truthy === 'boolean' ? when.truthy : undefined } satisfies Condition;
      }
      if (['choice','select'].includes(type) && Array.isArray(raw.options)) base.options = raw.options.map((option): ChoiceOption => {
        if (typeof option === 'string' || typeof option === 'number') return typeof option === 'string' ? option.slice(0, maxString) : option;
        if (option && typeof option === 'object') {
          const o = option as Record<string, unknown>;
          return { label: text(o.label ?? o.text ?? o.value), value: safeValue(o.value), description: text(o.description, 500) };
        }
        return '';
      });
      if (type === 'widget') {
        const widget = raw.widget;
        base.widget = ['badge','callout','metric','progress','divider'].includes(String(widget)) ? widget : 'callout';
        base.tone = ['neutral','positive','warning','negative'].includes(String(raw.tone)) ? raw.tone : 'neutral';
      }
      const children = raw.children ?? raw.items;
      if (children !== undefined) base.children = visit(children, depth + 1);
      result = base as UINode;
    }
    ancestors.delete(input);
    return result;
  };
  return visit(value, 0);
}

/** Data only: this component can render only entries from the fixed registry above. */
export function IntelligentUI({ definition, sessionId, instanceId, onEvent }: IntelligentUIProps) {
  const storageKey = `intelligent-ui:${encodeURIComponent(sessionId)}:${encodeURIComponent(instanceId)}`;
  const [values, setValues] = useState<Record<string, RuntimeValue>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        const clean: Record<string, RuntimeValue> = {};
        for (const [key, value] of Object.entries(saved)) clean[text(key, 120)] = safeValue(value);
        setValues(clean);
      } else setValues({});
    } catch { setValues({}); }
  }, [storageKey]);
  const emit = (type: RuntimeEventName, id: string, value?: RuntimeValue) => onEvent?.({ type, status: 'accepted', nodeId: id, value, sessionId, instanceId, occurredAt: new Date().toISOString() });
  const update = (id: string, value: RuntimeValue, type: RuntimeEventName = 'control.change') => {
    setValues(previous => {
      const next = { ...previous, [id]: value };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage may be disabled */ }
      return next;
    });
    emit(type, id, value);
  };
  const render = (input: UIChild, path: string): React.ReactNode => {
    if (Array.isArray(input)) return input.map((child, i) => <React.Fragment key={`${path}.${i}`}>{render(child, `${path}.${i}`)}</React.Fragment>);
    if (input == null) return null;
    if (typeof input !== 'object') return <span key={path}>{String(input)}</span>;
    const node = input as UINode;
    const raw = node as unknown as NodeDef;
    const type = node.type;
    const id = text(node.id, 120) || path;
    const prompt = text(node.prompt || node.label || node.text);
    const body = render(node.children ?? [], `${path}.children`);
    if (['stack','column','row','grid','card','panel','group','section','steps'].includes(type)) {
      const className = type === 'row' ? 'iu-row' : type === 'grid' ? 'iu-grid' : ['card','panel'].includes(type) ? 'iu-card' : type === 'section' ? 'iu-section' : 'iu-stack';
      if (type === 'form') return <form key={id} className="iu-stack" onSubmit={e => { e.preventDefault(); setSubmitted(v => ({ ...v, [id]: true })); emit('form.submit', id, true); }}>{prompt && <div className="iu-label">{prompt}</div>}{body}<button type="submit" className="iu-button">Submit</button>{submitted[id] && <span className="iu-submit-status" role="status">Submitted</span>}</form>;
      return <div key={id} className={className}>{prompt && <div className="iu-label">{prompt}</div>}{body}</div>;
    }
    if (['heading','title','caption','paragraph','clarify','feedback','text'].includes(type) && !(type === 'text' && (raw.placeholder !== undefined || raw.answer !== undefined || raw.value !== undefined))) {
      const Tag = type === 'heading' || type === 'title' ? 'h3' : type === 'caption' ? 'small' : 'p';
      return <Tag key={id} className={`iu-${type}`}>{prompt || text(node.value)}</Tag>;
    }
    if (type === 'conditional') {
      const condition = raw.when as Condition | undefined;
      const current = condition ? values[condition.id] : undefined;
      const visible = condition ? (condition.equals !== undefined ? current === condition.equals : condition.notEquals !== undefined ? current !== condition.notEquals : condition.truthy === false ? !current : Boolean(current)) : false;
      return visible ? <React.Fragment key={id}>{body}</React.Fragment> : null;
    }
    if (type === 'reveal') {
      const open = Boolean(values[id] ?? raw.initiallyOpen);
      return <section key={id} className="iu-reveal"><button type="button" className="iu-reveal-button" aria-expanded={open} onClick={() => update(id, !open, 'reveal.toggle')}>{prompt || 'Show details'}</button>{open && <div className="iu-reveal-body">{body}</div>}</section>;
    }
    if (type === 'widget') {
      const widget = raw.widget;
      if (widget === 'divider') return <hr key={id} className="iu-divider" />;
      if (widget === 'progress') { const value = numeric(raw.value, 0); return <div key={id} className="iu-widget"><label>{prompt}<progress max={numeric(raw.max, 100)} value={value} /></label></div>; }
      if (widget === 'metric') return <div key={id} className="iu-widget iu-metric"><span>{prompt}</span><strong>{text(raw.value)}</strong></div>;
      return <div key={id} className={`iu-widget iu-${widget} iu-tone-${String(raw.tone ?? 'neutral')}`}>{prompt || text(raw.value)}</div>;
    }
    if (type === 'button' || type === 'action') return <span key={id} className="iu-button-wrap"><button className="iu-button" type="button" disabled={Boolean(raw.disabled)} onClick={() => { setSubmitted(v => ({ ...v, [id]: true })); emit('button.submit', id, typeof raw.value === 'string' || typeof raw.value === 'number' || typeof raw.value === 'boolean' ? raw.value : true); }}>{prompt || 'Continue'}</button>{submitted[id] && <span className="iu-submit-status" role="status">Submitted</span>}</span>;
    if (type === 'input' || type === 'text-input' || type === 'text') {
      const val = values[id] ?? text(raw.answer ?? raw.value);
      return <label key={id} className="iu-field">{prompt && <span>{prompt}</span>}<input value={typeof val === 'string' ? val : String(val ?? '')} placeholder={text(raw.placeholder)} required={Boolean(raw.required)} onChange={e => update(id, e.target.value)} /></label>;
    }
    if (type === 'number' || type === 'range') {
      const min = numeric(raw.min, type === 'range' ? 0 : -Number.MAX_SAFE_INTEGER);
      const max = numeric(raw.max, type === 'range' ? 100 : Number.MAX_SAFE_INTEGER);
      const val = values[id] === null && type === 'number' ? '' : Math.max(min, Math.min(max, numeric(values[id], numeric(raw.value, type === 'range' ? min : 0))));
      return <label key={id} className="iu-field">{prompt && <span>{prompt}</span>}<input type={type} min={min} max={max} step={numeric(raw.step, 1)} value={val} onChange={e => update(id, e.target.value === '' ? null : e.target.valueAsNumber)} />{type === 'range' && <output>{val}</output>}</label>;
    }
    if (type === 'textarea' || type === 'code') {
      const val = values[id] ?? text(raw.answer ?? raw.value);
      return <label key={id} className={`iu-field ${type === 'code' ? 'iu-code' : ''}`}>{prompt && <span>{prompt}</span>}<textarea value={typeof val === 'string' ? val : String(val ?? '')} placeholder={text(raw.placeholder)} rows={Math.max(1, Math.min(18, numeric(raw.rows, 4)))} onChange={e => update(id, e.target.value)} /></label>;
    }
    if (type === 'choice' || type === 'select') {
      const options = Array.isArray(raw.options) ? raw.options as ChoiceOption[] : [];
      const selected = values[id] ?? '';
      return <fieldset key={id} className="iu-choices"><legend>{prompt}</legend>{options.map((entry, i) => {
        const opt = typeof entry === 'object' && entry !== null ? entry : { label: String(entry), value: entry };
        const value = String(opt.value); const label = opt.label;
        return <label className="iu-option" key={`${id}.${i}`}><input type="radio" name={`${storageKey}:${id}`} value={value} checked={selected === opt.value || String(selected) === value} onChange={() => update(id, opt.value, 'choice.select')} />{label}</label>;
      })}</fieldset>;
    }
    if (type === 'checkbox') return <label key={id} className="iu-option"><input type="checkbox" checked={Boolean(values[id] ?? raw.checked)} onChange={e => update(id, e.target.checked, 'control.toggle')} />{prompt}</label>;
    return <div key={id} className="iu-unknown">{prompt}</div>;
  };

  const validated = validateDefinition(definition);
  if (validated == null) return <div className="iu-error" role="status">This interface description could not be rendered.</div>;
  return <div className="intelligent-ui" data-session={sessionId} data-instance={instanceId}>{render(validated, 'root')}</div>;
}

export default IntelligentUI;
