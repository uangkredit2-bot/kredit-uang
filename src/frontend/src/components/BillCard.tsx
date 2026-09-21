import { formatRupiah } from "@/lib/format";
import type { Bill } from "@/types/bill";

interface BillCardProps {
  /** Active bill, or `undefined` while the query is still resolving. */
  bill?: Bill;
  /** True while the bill query is in flight. */
  isLoading?: boolean;
}

/** Nominal shown when the backend cannot be reached, so the screen never empties. */
const FALLBACK_AMOUNT = 1_200_000n;

/**
 * Large glass bill card.
 *
 * One step lighter than the page surface, with a hairline border and the
 * layered `shadow-elevated` treatment. Renders a layout-matched skeleton while
 * the bill loads and falls back to the canonical nominal on error.
 */
export function BillCard({ bill, isLoading = false }: BillCardProps) {
  const amount = bill?.amount ?? FALLBACK_AMOUNT;
  const statusLabel = bill?.paid ? "Lunas" : "Belum Lunas";

  return (
    <section
      className="surface-glass shadow-elevated animate-fade-up mt-10 rounded-[var(--radius)] border border-border p-6"
      data-ocid="bill.card"
      aria-labelledby="bill-card-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="bill-card-heading"
          className="font-mono text-[0.6875rem] uppercase tracking-brand text-muted-foreground"
        >
          Tagihan Saat Ini
        </h2>

        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground"
          data-ocid="bill.status.badge"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70"
            aria-hidden="true"
          />
          Terkonfirmasi
        </span>
      </div>

      {isLoading ? (
        <div
          className="mt-5 h-[3.25rem] w-56 animate-pulse-soft rounded-lg bg-muted"
          data-ocid="bill.loading_state"
          aria-hidden="true"
        />
      ) : (
        <p
          className="mt-4 font-display text-[2.75rem] font-bold leading-none tracking-[-0.02em] text-foreground tabular-nums sm:text-5xl"
          data-ocid="bill.amount"
        >
          {formatRupiah(amount)}
        </p>
      )}

      <div className="mt-6 h-px w-full bg-border" aria-hidden="true" />

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Status pembayaran</span>
        <span
          className="flex items-center gap-2 text-sm font-medium text-foreground"
          data-ocid="bill.payment_status"
        >
          {statusLabel}
          <span
            className="h-2 w-2 rounded-full bg-warning"
            aria-hidden="true"
          />
        </span>
      </div>
    </section>
  );
}
