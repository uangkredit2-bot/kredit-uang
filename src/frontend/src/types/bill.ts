import type { BillView } from "@/backend";

/**
 * Frontend-facing bill shape.
 *
 * Mirrors the backend `BillView` record. The display label field is `title`
 * (NOT `label`). `amount` stays a `bigint` so no precision is lost between the
 * canister and the formatter.
 */
export interface Bill {
  id: bigint;
  title: string;
  amount: bigint;
  paymentStatus: string;
  confirmationStatus: string;
  paid: boolean;
  updatedAt: bigint;
}

/** Map a backend `BillView` into the frontend `Bill` shape. */
export function toBill(view: BillView): Bill {
  return {
    id: view.id,
    title: view.title,
    amount: view.amount,
    paymentStatus: view.paymentStatus,
    confirmationStatus: view.confirmationStatus,
    paid: view.paid,
    updatedAt: view.updatedAt,
  };
}
