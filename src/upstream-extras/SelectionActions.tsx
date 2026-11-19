import { useState } from "react";
import { Check, ChevronDown, RotateCcw, Sparkles, X } from "lucide-react";

const original = "The team reviewed the latest research and prepared a concise summary for the next planning session.";
const rewrites: Record<string,string> = {
  Improve: "The team analyzed recent research and prepared a clear summary for the upcoming planning session.",
  Shorten: "The team summarized recent research for the next planning session.",
  Clarify: "The team reviewed recent research and wrote a clear summary to guide the next planning session.",
};

export function SelectionActions() {
  const [action,setAction]=useState("");
  const [result,setResult]=useState("");
  const [more,setMore]=useState(false);
  const [prompt,setPrompt]=useState("");
  const run=(kind:string)=>{setAction(kind);window.setTimeout(()=>{setResult(rewrites[kind]??`Updated the passage using this instruction: ${kind}.`);setAction("");},550);};
  const reset=()=>{setResult("");setPrompt("");setMore(false);};
  return <section className="w-full max-w-[460px] rounded-[14px] bg-surface p-4 shadow-card"><p className="text-[13px] leading-relaxed text-ink">{result||original}</p><div className="mt-3 flex flex-wrap items-center gap-1 rounded-full bg-inset p-1">
    {action?<span className="px-3 py-1 text-xs text-ink-2">Working locally…</span>:result?<><button onClick={reset} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs text-canvas"><Check size={14}/>Keep</button><button onClick={reset} className="rounded-full px-3 py-1.5 text-xs text-ink-2 hover:bg-hover">Discard</button><button aria-label="Try again" onClick={()=>run("Improve")} className="ml-auto rounded-full p-1.5 text-ink-2 hover:bg-hover"><RotateCcw size={14}/></button></>:<><input value={prompt} onChange={event=>setPrompt(event.target.value)} placeholder="Describe edits" aria-label="Describe edits" className="min-w-24 flex-1 bg-transparent px-2 text-xs text-ink outline-none placeholder:text-ink-3"/><button onClick={()=>run(prompt.trim()||"Improve")} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-ink-2 hover:bg-hover"><Sparkles size={14}/>Improve</button>{more&&<><button onClick={()=>run("Shorten")} className="rounded-full px-2.5 py-1.5 text-xs text-ink-2 hover:bg-hover">Shorten</button><button onClick={()=>run("Clarify")} className="rounded-full px-2.5 py-1.5 text-xs text-ink-2 hover:bg-hover">Clarify</button></>}<button aria-expanded={more} aria-label="Show more actions" onClick={()=>setMore(value=>!value)} className="rounded-full p-1.5 text-ink-2 hover:bg-hover">{more?<X size={14}/>:<ChevronDown size={14}/>}</button></>}
  </div></section>;
}
