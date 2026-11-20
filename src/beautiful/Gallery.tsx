import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import { Grid } from './Grid';
import { META } from './lib/meta';

const files = import.meta.glob('./components/primitives/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const sources = Object.fromEntries(META.map((entry) => [entry.id, files[`./components/primitives/${entry.file}`] ?? '']));

export default function Gallery() {
  return <main className="font-sans mx-auto max-w-[960px] bg-page shadow-[0_0_0_1px_var(--line)]" style={{ '--font-inter': 'Inter Variable', '--font-mono-face': 'JetBrains Mono Variable' } as React.CSSProperties}>
    <header className="border-b border-dashed border-line px-5 pt-10 sm:px-8"><h1 className="text-xl font-semibold text-ink">Beautiful UI components</h1><p className="mt-2 text-sm text-ink-2">Original interactive component gallery</p></header>
    <Grid sources={sources} />
  </main>;
}
