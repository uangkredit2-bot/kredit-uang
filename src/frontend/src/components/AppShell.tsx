import { BackgroundDecor } from "@/components/BackgroundDecor";
import type { ReactNode } from "react";

interface AppShellProps {
  /** Header content rendered inside the centered column. */
  header?: ReactNode;
  /** Main page content. */
  children: ReactNode;
}

/**
 * Shared application shell.
 *
 * Mobile-first: a single centered column capped at 480px with a 20px gutter,
 * sitting on the dark atmosphere background with the geometric circle
 * decoration behind it. The header slot stays inside the same column so the
 * brand line and page content share one vertical rhythm.
 */
export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background">
      <BackgroundDecor />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5">
        {header ? (
          <header className="flex items-center justify-between pt-8">
            {header}
          </header>
        ) : null}

        <main className="flex flex-1 flex-col pb-10">{children}</main>
      </div>
    </div>
  );
}
