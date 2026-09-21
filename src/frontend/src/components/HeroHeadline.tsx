/**
 * Hero headline block.
 *
 * Three-line display headline where the first two lines stay in the foreground
 * tone and the final word carries the single mint accent of the screen. The
 * subtext sits in a muted tone with a comfortable measure for mobile reading.
 */
export function HeroHeadline() {
  return (
    <section
      className="animate-fade-up pt-10"
      data-ocid="home.hero.section"
      aria-labelledby="home-hero-heading"
    >
      <h1
        id="home-hero-heading"
        className="font-display text-[3.25rem] font-bold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[3.75rem]"
      >
        <span className="block">Tenang,</span>
        <span className="block">semua</span>
        <span className="block text-accent-mint">terkendali.</span>
      </h1>

      <p className="mt-6 max-w-[22rem] text-base leading-relaxed text-muted-foreground">
        Lihat bagaimana pembayaran tagihan bekerja dalam lingkungan yang aman.
      </p>
    </section>
  );
}
