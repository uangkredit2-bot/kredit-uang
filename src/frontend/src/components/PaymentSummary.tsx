import { formatRupiah } from "@/lib/format";
import { ShieldCheck } from "lucide-react";

interface PaymentSummaryProps {
  /** Display label of the bill, e.g. "Tagihan Bulan Ini". */
  title: string;
  /** Whole-rupiah amount rendered with Indonesian grouping. */
  amount: bigint;
}

/**
 * Glass summary card for the confirmation state.
 *
 * Shows the bill label, the nominal in the display face, and a short
 * reassurance line clarifying that this screen is a safe, non-transactional
 * preview — no bank, gateway, or credential is involved.
 */
export function PaymentSummary({ title, amount }: PaymentSummaryProps) {
  return (
    <section
      data-ocid="payment.summary_card"
      className="surface-glass shadow-elevated animate-fade-up rounded-[var(--radius)] border border-border p-6"
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-brand text-muted-foreground">
        {title}
      </p>

      <p className="mt-4 font-display text-[2.6rem] font-bold leading-none tracking-tight text-foreground tabular-nums">
        {formatRupiah(amount)}
      </p>

      <div className="mt-6 h-px w-full bg-border" aria-hidden="true" />

      <div className="mt-5 flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
          aria-hidden="true"
        >
          <ShieldCheck className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Lingkungan pratinjau yang aman. Tidak ada dana yang berpindah dan
          tidak ada data rekening yang diminta.
        </p>
      </div>
    </section>
  );
}
