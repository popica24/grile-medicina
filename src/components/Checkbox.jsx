export function Checkbox({ state = 'unchecked' }) {
  // state: 'unchecked' | 'checked' | 'partial'
  const cls = state === 'checked' ? 'cb checked' : state === 'partial' ? 'cb partial' : 'cb'
  return (
    <span className={cls} role="checkbox" aria-checked={state === 'checked'}>
      {state === 'checked' && (
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}
