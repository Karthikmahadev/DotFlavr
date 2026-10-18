import { MaskLine } from "./MaskLine";

const HEADLINE =
  "font-display uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2.5rem,11vw,11rem)] md:text-[10vw]";

export default function HeroStory() {
  return (
    <div
      id="story"
      className="pointer-events-none absolute inset-0 z-20 motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:inset-auto motion-reduce:bg-wine"
    >
      {/* Darkens the images so cream text stays readable over any photo */}
      <div aria-hidden className="js-scrim absolute inset-0 bg-wine opacity-0 motion-reduce:hidden" />

      {/* Statement 1 */}
      <div className="js-s1 absolute inset-0 flex flex-col justify-center px-6 text-cream md:px-10 motion-reduce:relative motion-reduce:inset-auto motion-reduce:py-28">
        <p className="js-story-fade mb-6 font-mono text-xs uppercase tracking-[0.2em]">
          01 — The question
        </p>
        <h2 className={HEADLINE}>
          <MaskLine>Every</MaskLine>
          <MaskLine>industry</MaskLine>
          <MaskLine>has a table.</MaskLine>
        </h2>
      </div>

      {/* Statement 2 */}
      <div className="js-s2 absolute inset-0 flex flex-col items-start justify-center px-6 text-cream md:items-end md:px-10 md:text-right motion-reduce:relative motion-reduce:inset-auto motion-reduce:py-28">
        <p className="js-story-fade mb-6 font-mono text-xs uppercase tracking-[0.2em]">
          02 — The people
        </p>
        <h2 className={HEADLINE}>
          <MaskLine>But who’s</MaskLine>
          <MaskLine>sitting</MaskLine>
          <MaskLine>
            <span className="text-flame">around it?</span>
          </MaskLine>
        </h2>
      </div>
    </div>
  );
}