import { useMemo, useState } from "react";

const initialRows = [
  { id: "atlas", name: "Atlas Research", category: "Analytics", updated: "Today", status: "Strong", owner: "Mira Chen" },
  { id: "northstar", name: "Northstar Labs", category: "Infrastructure", updated: "Yesterday", status: "Review", owner: "Jon Bell" },
  { id: "fieldnote", name: "Fieldnote Studio", category: "Design", updated: "Oct 16", status: "Strong", owner: "Ravi Shah" },
  { id: "openline", name: "Openline Systems", category: "Security", updated: "Oct 12", status: "No contact", owner: "Unassigned" },
];

export function RecordsTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(false);
  const rows = useMemo(() => initialRows.filter(row => `${row.name} ${row.category} ${row.owner}`.toLowerCase().includes(query.toLowerCase())).slice().sort((a,b) => sort ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)), [query,sort]);
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current,id]);
  return <section className="w-full min-w-0 overflow-hidden rounded-[14px] bg-surface shadow-card">
    <header className="flex items-center justify-between gap-3 border-b border-line p-3"><div><h3 className="text-sm font-semibold text-ink">Research records</h3><p className="text-xs text-ink-3">{rows.length} local sample entries</p></div><input aria-label="Filter records" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Filter records" className="w-40 rounded-lg border border-line bg-field px-2.5 py-1.5 text-xs text-ink outline-none" /></header>
    <div className="overflow-x-auto"><table className="min-w-[520px] w-full text-left text-xs"><thead className="bg-inset text-ink-3"><tr><th className="w-9 p-2.5"><input aria-label="Select all visible records" type="checkbox" checked={rows.length > 0 && rows.every(row=>selected.includes(row.id))} onChange={()=>setSelected(rows.every(row=>selected.includes(row.id)) ? selected.filter(id=>!rows.some(row=>row.id===id)) : [...new Set([...selected,...rows.map(row=>row.id)])])} /></th>{["Record","Category","Updated","Status","Owner"].map((label,index)=><th key={label} className="p-2.5 font-medium"><button type="button" onClick={()=>index===0&&setSort(value=>!value)}>{label}{index===0?(sort?" ↓":" ↑"):""}</button></th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-t border-line text-ink hover:bg-hover"><td className="p-2.5"><input aria-label={`Select ${row.name}`} type="checkbox" checked={selected.includes(row.id)} onChange={()=>toggle(row.id)} /></td><td className="p-2.5 font-medium">{row.name}</td><td className="p-2.5">{row.category}</td><td className="p-2.5">{row.updated}</td><td className="p-2.5"><span className="rounded-full bg-accent-tint px-2 py-1">{row.status}</span></td><td className="p-2.5">{row.owner}</td></tr>)}</tbody></table></div>
    {selected.length>0&&<footer className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-ink-2"><span>{selected.length} selected</span><button type="button" onClick={()=>setSelected([])} className="rounded-md px-2 py-1 hover:bg-hover">Clear selection</button></footer>}
  </section>;
}
