import { PaymentSuccess } from "@/components/PaymentSuccess";
import { PaymentSummary } from "@/components/PaymentSummary";
import { useActiveBill, usePayActiveBill } from "@/hooks/use-bill";
import { formatRupiah } from "@/lib/format";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from "lucide-react";

/** Nominal shown when the backend bill is unavailable. */
const FALLBACK_AMOUNT = 1_200_000n;
const FALLBACK_TITLE = "Tagihan Saat Ini";

interface PaymentPageProps {
  /** Return to the home screen. */
  onBack: () => void;
}

/**
 * Single-screen payment confirmation flow.
 *
 * Two states share one screen: the confirmation state (summary + primary CTA)
 * and the post-confirm state (service-disruption warning + return action). The
 * flow is purely presentational — no bank, gateway, or credential is ever
 * involved.
 */
export function PaymentPage({ onBack }: PaymentPageProps) {
  const billQuery = useActiveBill();
  const payBill = usePayActiveBill();

  const amount = billQuery.data?.amount ?? FALLBACK_AMOUNT;
  const title = billQuery.data?.title ?? FALLBACK_TITLE;
  const isSuccess = payBill.isSuccess;

  return (
    <div
      data-ocid="payment.page"
      className="flex flex-1 flex-col pt-10 animate-fade-in"
    >
      <button
        type="button"
        data-ocid="payment.back_button"
        onClick={onBack}
        className="transition-smooth -ml-2 inline-flex w-fit items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali
      </button>

      <h1 className="mt-8 font-display text-[2rem] font-bold leading-tight tracking-tight text-foreground">
        {isSuccess ? "Konfirmasi Selesai" : "Konfirmasi Pembayaran"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {isSuccess
          ? "Konfirmasi Anda telah tercatat. Berikut status layanan pembayaran saat ini."
          : "Periksa kembali rincian tagihan Anda sebelum melanjutkan."}
      </p>

      <div className="mt-8">
        {isSuccess ? (
          <PaymentSuccess amount={amount} />
        ) : (
          <PaymentSummary title={title} amount={amount} />
        )}
      </div>

      {payBill.isError ? (
        <div
          data-ocid="payment.error_state"
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-[var(--radius)] border border-destructive/40 bg-destructive/10 px-4 py-3"
        >
          <p className="text-sm leading-relaxed text-foreground">
            Konfirmasi gagal diproses. Silakan coba lagi.
          </p>
        </div>
      ) : null}

      <div className="mt-auto pt-10">
        {isSuccess ? (
          <button
            type="button"
            data-ocid="payment.secondary_button"
            onClick={onBack}
            className="transition-smooth flex h-14 w-full items-center justify-center rounded-full border border-border bg-card font-display text-base font-semibold text-foreground hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Kembali ke Beranda
          </button>
        ) : (
          <button
            type="button"
            data-ocid="payment.confirm_button"
            onClick={() => payBill.mutate()}
            disabled={payBill.isPending}
            className="transition-smooth bg-gradient-primary flex h-16 w-full items-center justify-between rounded-full pl-7 pr-2 font-display text-base font-bold text-primary-foreground shadow-elevated hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>
              {payBill.isPending
                ? "Memproses…"
                : payBill.isError
                  ? "Coba Lagi"
                  : "Konfirmasi Pembayaran"}
            </span>
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background/85 text-foreground"
              aria-hidden="true"
            >
              {payBill.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : payBill.isError ? (
                <RotateCcw className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </span>
          </button>
        )}

        <p className="mt-5 text-center font-mono text-[0.65rem] uppercase tracking-brand text-muted-foreground">
          {isSuccess ? "Konfirmasi tercatat" : "Pratinjau aman"}
        </p>
      </div>
    </div>
  );
}
