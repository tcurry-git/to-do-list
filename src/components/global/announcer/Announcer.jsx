export function Announcer({ text }){
    return <div role="status" aria-live="polite" aria-atomic='true' aria-relevant="text" tabIndex={-1} hidden>{text}</div>
}