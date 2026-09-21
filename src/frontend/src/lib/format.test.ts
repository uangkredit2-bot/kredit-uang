import { describe, expect, it } from "vitest";

import { formatRupiah } from "@/lib/format";

describe("formatRupiah", () => {
  it("formats the canonical bill nominal with Indonesian grouping", () => {
    expect(formatRupiah(1_200_000n)).toBe("Rp 1.200.000");
  });

  it("groups thousands and leaves small values ungrouped", () => {
    expect(formatRupiah(0n)).toBe("Rp 0");
    expect(formatRupiah(999n)).toBe("Rp 999");
    expect(formatRupiah(1_000n)).toBe("Rp 1.000");
    expect(formatRupiah(1_234_567_890n)).toBe("Rp 1.234.567.890");
  });

  it("keeps the sign for negative amounts", () => {
    expect(formatRupiah(-1_200_000n)).toBe("-Rp 1.200.000");
  });
});
