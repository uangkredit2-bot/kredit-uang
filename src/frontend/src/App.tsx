import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";
import { PaymentPage } from "@/pages/PaymentPage";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export type Route = "home" | "payment";

/**
 * App root: owns the minimal client-side route state and renders the shared
 * shell around the active page. The payment route is reachable from the home
 * screen via the primary CTA.
 */
export default function App() {
  const [route, setRoute] = useState<Route>("home");

  return (
    <AppShell
      header={
        <>
          <span className="font-display text-sm font-bold uppercase tracking-brand text-foreground">
            Limit Pinjaman
          </span>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary"
            aria-label="Keamanan terjamin"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
        </>
      }
    >
      {route === "home" ? (
        <HomePage onPay={() => setRoute("payment")} />
      ) : (
        <PaymentPage onBack={() => setRoute("home")} />
      )}
    </AppShell>
  );
}
