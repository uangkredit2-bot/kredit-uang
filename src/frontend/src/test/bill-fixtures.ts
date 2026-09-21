import type { BillView } from "@/backend";
import type { Bill } from "@/types/bill";

/**
 * Canonical seeded bill, matching `src/backend/lib/billing.mo`'s `seed()`.
 *
 * Kept as a typed fixture so a shape drift in `BillView` fails the type-check
 * rather than silently passing through an untyped literal.
 */
export const SEEDED_BILL_VIEW: BillView = {
  id: 1n,
  title: "TAGIHAN SAAT INI",
  amount: 1_200_000n,
  confirmationStatus: "TERKONFIRMASI",
  paymentStatus: "Belum Lunas",
  paid: false,
  updatedAt: 0n,
};

/** The same bill after `payActiveBill`, as the backend returns it. */
export const PAID_BILL_VIEW: BillView = {
  ...SEEDED_BILL_VIEW,
  paymentStatus: "Lunas",
  paid: true,
  updatedAt: 1_700_000_000_000_000_000n,
};

/** Frontend-facing shape of the seeded bill, for direct component props. */
export const SEEDED_BILL: Bill = {
  id: SEEDED_BILL_VIEW.id,
  title: SEEDED_BILL_VIEW.title,
  amount: SEEDED_BILL_VIEW.amount,
  paymentStatus: SEEDED_BILL_VIEW.paymentStatus,
  confirmationStatus: SEEDED_BILL_VIEW.confirmationStatus,
  paid: SEEDED_BILL_VIEW.paid,
  updatedAt: SEEDED_BILL_VIEW.updatedAt,
};

/**
 * The subset of the generated backend interface the bill screens consume.
 *
 * Typed against the app's own `BillView` so a backend shape change surfaces
 * here at type-check time. Only the two bill methods are modelled; the rest of
 * the generated surface is irrelevant to these journeys.
 */
export interface BillActor {
  getActiveBill: () => Promise<BillView>;
  payActiveBill: () => Promise<BillView>;
}

/**
 * Build a local typed actor mock for the bill methods.
 *
 * `getActiveBill` resolves the seeded bill by default; `payActiveBill` resolves
 * the paid bill. Both are `vi.fn`-free plain functions so the mock stays a
 * simple value the caller can override per test.
 */
export function createBillActor(overrides: Partial<BillActor> = {}): BillActor {
  return {
    getActiveBill: async () => SEEDED_BILL_VIEW,
    payActiveBill: async () => PAID_BILL_VIEW,
    ...overrides,
  };
}
