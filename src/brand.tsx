export function Brand({size=28}:{size?:number}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 3v42M3 24h42M9 9l30 30m0-30L9 39" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M24 12c0 6.6 5.4 12 12 12-6.6 0-12 5.4-12 12 0-6.6-5.4-12-12-12 6.6 0 12-5.4 12-12Z" fill="currentColor"/>
  </svg>;
}
