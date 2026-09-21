import { BillCard } from "@/components/BillCard";
import { HeroHeadline } from "@/components/HeroHeadline";
import { PayButton } from "@/components/PayButton";
import { useActiveBill } from "@/hooks/use-bill";

interface HomePageProps {
  /** Advance to the payment confirmation screen. */
  onPay: () => void;
}

/**
 * Home screen.
 *
 * Renders only inner content — `AppShell` already supplies the centered
 * column, background, and header. Composition is a single mobile-first stack:
 * hero headline, glass bill card, full-width primary CTA.
 */
export function HomePage({ onPay }: HomePageProps) {
  const { data: bill, isLoading } = useActiveBill();

  return (
    <div className="flex flex-1 flex-col" data-ocid="home.page">
      <HeroHeadline />
      <BillCard bill={bill} isLoading={isLoading} />
      <PayButton onPay={onPay} />
    </div>
  );
}
