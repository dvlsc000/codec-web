/**
 * The About page's opening statement. Static, calm typography: the main claim
 * in full white, the clause after the em dash on its own line in a softer tone
 * (the dash itself is only read by screen readers),
 * and the logo's orange pixel in place of the final full stop.
 */
export function Statement({ text, className = "" }: { text: string; className?: string }) {
  const [main, rest] = text.split(/\s+—\s+/);
  const tail = (rest ?? "").replace(/\.$/, "");

  return (
    <p className={`font-display font-normal leading-[1.24] tracking-[-0.03em] text-fg ${className}`}>
      {main}
      {tail && (
        <>
          <span className="sr-only"> —</span>
          <span className="mt-3 block text-muted md:mt-4">
            {tail}
            <span aria-hidden="true" className="ml-[0.12em] inline-block size-[0.22em] translate-y-[-0.02em] rounded-[1.5px] bg-ember align-baseline" />
            <span className="sr-only">.</span>
          </span>
        </>
      )}
    </p>
  );
}
