import { formatRupiah } from "@/lib/format";
import { TriangleAlert } from "lucide-react";

interface PaymentSuccessProps {
  /** Whole-rupiah amount that was confirmed. */
  amount: bigint;
}

/**
 * Post-confirm status panel shown in place of the summary once the
 * confirmation resolves.
 *
 * The simulation reports a service disruption: an amber circular triangle
 * warning badge pops in with `animate-check-pop`, followed by the warning
 * heading, the disruption notice, and the confirmed nominal.
 */
export function PaymentSuccess({ amount }: PaymentSuccessProps) {
  return (
    <section
      data-ocid="payment.success_state"
      className="surface-glass shadow-elevated animate-fade-up flex flex-col items-center rounded-[var(--radius)] border border-warning/40 px-6 py-10 text-center"
    >
      <span
        className="animate-check-pop flex h-20 w-20 items-center justify-center rounded-full border border-warning/45 bg-warning/15 text-warning"
        aria-hidden="true"
      >
        <TriangleAlert className="h-9 w-9" strokeWidth={2.5} />
      </span>

      <h2 className="mt-7 font-display text-2xl font-bold tracking-tight text-foreground">
        Gangguan layanan pembayaran
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sistem pembayaran sedang mengalami gangguan.
      </p>

      <p className="mt-6 font-display text-[2.1rem] font-bold leading-none tracking-tight text-foreground tabular-nums">
        {formatRupiah(amount)}
      </p>
    </section>
  );
}
