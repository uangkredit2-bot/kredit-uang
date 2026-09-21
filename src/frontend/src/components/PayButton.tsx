import { ArrowRight } from "lucide-react";

interface PayButtonProps {
  /** Invoked when the user presses the primary CTA. */
  onPay: () => void;
}

/**
 * Primary call to action.
 *
 * Full-width mint pill with dark bold label and a dark circular disc holding
 * the right arrow. Hover and pressed states shift the disc and lift the
 * surface slightly; motion is limited to transform and opacity.
 */
export function PayButton({ onPay }: PayButtonProps) {
  return (
    <button
      type="button"
      onClick={onPay}
      data-ocid="home.pay_button"
      className="bg-gradient-primary group mt-10 flex w-full items-center justify-between gap-4 rounded-full py-4 pl-7 pr-3 text-left shadow-elevated transition-smooth hover:-translate-y-0.5 hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:brightness-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span className="font-display text-lg font-bold tracking-[-0.01em] text-primary-foreground">
        Bayar Tagihan Sekarang
      </span>

      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary transition-smooth group-hover:translate-x-0.5 motion-reduce:transform-none"
        aria-hidden="true"
      >
        <ArrowRight className="h-5 w-5" />
      </span>
    </button>
  );
}
