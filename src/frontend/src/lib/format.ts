/**
 * Format a whole-rupiah amount as Indonesian currency.
 *
 * `1200000n` -> `"Rp 1.200.000"`. Uses a dot as the thousands separator and no
 * decimals, matching the Indonesian convention.
 */
export function formatRupiah(amount: bigint): string {
  const negative = amount < 0n;
  const digits = (negative ? -amount : amount).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}Rp ${grouped}`;
}
