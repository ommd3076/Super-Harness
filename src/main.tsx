import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
if (import.meta.env.DEV && location.pathname.replace(/\/$/, '') === '/dev/components') {
  import('./beautiful/Gallery').then(({ default: Gallery }) => root.render(<Gallery />));
} else {
  Promise.all([import('./App'), import('./styles.css')]).then(([{ default: App }]) => root.render(<App />));
}
