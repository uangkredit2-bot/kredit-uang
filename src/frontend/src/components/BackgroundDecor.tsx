/**
 * Ambient background decoration for the app shell.
 *
 * Renders the soft dark-green radial wash plus a cluster of thin translucent
 * geometric circles anchored to the right edge. Purely decorative: it is
 * `aria-hidden` and never intercepts pointer events.
 */
export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="bg-atmosphere absolute inset-0" />

      <div className="absolute -right-24 top-24 h-72 w-72 animate-ring-drift">
        <div className="ring-circle h-full w-full" />
      </div>
      <div className="absolute -right-40 top-64 h-[26rem] w-[26rem] animate-ring-drift [animation-delay:-4s]">
        <div className="ring-circle-soft h-full w-full" />
      </div>
      <div className="absolute -left-32 bottom-[-6rem] h-80 w-80">
        <div className="ring-circle-soft h-full w-full" />
      </div>
    </div>
  );
}
