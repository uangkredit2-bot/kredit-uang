import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers the active-bill read instead of trapping", async () => {
  const bill = await actor.getActiveBill();
  expect(bill).toMatchObject({
    id: 1n,
    title: "TAGIHAN SAAT INI",
    amount: 1_200_000n,
    confirmationStatus: "TERKONFIRMASI",
    paymentStatus: "Belum Lunas",
    paid: false,
  });
});

it("round-trips the bill through the real canister's pay path", async () => {
  const paid = await actor.payActiveBill();
  expect(paid).toMatchObject({
    id: 1n,
    amount: 1_200_000n,
    paymentStatus: "Lunas",
    paid: true,
  });
  // The paid state must be observable through the read path too, not only in
  // the mutation's own reply.
  const reread = await actor.getActiveBill();
  expect(reread).toMatchObject({ paid: true, paymentStatus: "Lunas" });
});
