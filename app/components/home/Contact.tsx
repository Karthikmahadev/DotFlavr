"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── data ───────────────────────── */

const SERVICES = [
  "Product development",
  "Recipe & flavour development",
  "Food business ideas",
  "Shelf-life improvement",
  "Consulting & technical guidance",
  "Workshops & collaborations",
  "Something else",
];

// Replace with your real details.
const EMAIL = "hello@dotflavr.com";
const WHATSAPP = "https://wa.me/910000000000";

const INK = "text-[#2a0610]";
const line =
  "w-full border-0 border-b border-[#2a0610]/30 bg-transparent px-0 py-2 text-[17px] text-[#2a0610] outline-none transition-colors placeholder:text-[#2a0610]/30 focus:border-[#2a0610]";

/* ───────────────────────── small pieces ───────────────────────── */

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#ff6f3c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path
        d="M3 13.5 9 19 21 4.5"
        className="[stroke-dasharray:28] [stroke-dashoffset:28] transition-[stroke-dashoffset] duration-500 ease-out group-has-[:checked]:[stroke-dashoffset:0]"
      />
    </svg>
  );
}

function Field({
  n,
  label,
  htmlFor,
  children,
  error,
}: {
  n: string;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="js-field">
      <label htmlFor={htmlFor} className="flex items-baseline gap-2.5">
        <span className="font-newsreader text-[15px] italic text-[#ff6f3c]">{n}</span>
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">{label}</span>
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] text-[#b3141f]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function ContactForm() {
  const root = useRef<HTMLElement>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; services?: string }>({});

  // Entrance
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top 70%", once: true };
        gsap.from(".js-c-left > *", {
          autoAlpha: 0,
          y: 26,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: st,
        });
        gsap
          .timeline({ scrollTrigger: st, defaults: { ease: "expo.out" } })
          .from(".js-paper", { autoAlpha: 0, y: 70, rotate: 3, duration: 1.3 })
          .from(".js-tape", { scaleX: 0, duration: 0.6 }, 0.7)
          .from(".js-field", { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.06 }, 0.4);
      });
    },
    { scope: root }
  );

  // The stamp lands on success.
  useGSAP(
    () => {
      if (status !== "sent") return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".js-stamp",
          { scale: 2.6, autoAlpha: 0, rotate: -26 },
          { scale: 1, autoAlpha: 1, rotate: -9, duration: 0.4, ease: "power4.in" }
        );
        gsap.fromTo(".js-paper", { y: 0 }, { y: 6, duration: 0.08, yoyo: true, repeat: 1, delay: 0.38 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".js-stamp", { autoAlpha: 1, rotate: -9 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [status] }
  );

  const toggleService = (s: string) => {
    setErrors((e) => ({ ...e, services: undefined }));
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = "That email doesn't look right.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const payload = { name, company, email, phone, services, details };
      console.log("contact payload", payload);
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setName(""); setCompany(""); setEmail(""); setPhone("");
    setServices([]); setDetails("");
    setErrors({}); setStatus("idle");
  };

  return (
    <section
      ref={root}
      id="contact"
      className="relative bg-[#2a0610] px-5 py-24 text-[#fff9eb] sm:px-8 md:py-32 lg:px-14"
    >
      <div className="mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
        {/* ───── Left: stays in view while you write ───── */}
        <div className="js-c-left self-start lg:sticky lg:top-28">
          <p className="font-newsreader text-[1.15rem] italic text-[#ffb08a]">Contact</p>

          <h2 className="mt-4 font-display text-[clamp(3.4rem,8vw,7.2rem)] font-medium leading-[0.86] tracking-[-0.045em]">
            Pull up
            <br />a{" "}
            <em className="text-[#ff6f3c]">chair.</em>
          </h2>

          <p className="mt-9 max-w-[24rem] font-newsreader text-[1.3rem] leading-[1.35] text-[#fff9eb]/85">
            Have a food idea, a product you want to develop, or simply something you&rsquo;d like to explore? Tell us about it. Let&rsquo;s figure out the possibilities together.
          </p>

          <dl className="mt-12 space-y-5 text-[15px]">
            <div className="flex gap-6 border-t border-[#fff9eb]/20 pt-5">
              <dt className="w-20 shrink-0 text-[#fff9eb]/50">Email</dt>
              <dd>
                <a href={`mailto:${EMAIL}`} className="underline decoration-[#fff9eb]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]">
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex gap-6 border-t border-[#fff9eb]/20 pt-5">
              <dt className="w-20 shrink-0 text-[#fff9eb]/50">WhatsApp</dt>
              <dd>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 underline decoration-[#fff9eb]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]">
                  Message us directly
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </dd>
            </div>
            <div className="flex gap-6 border-y border-[#fff9eb]/20 py-5">
              <dt className="w-20 shrink-0 text-[#fff9eb]/50">Based in</dt>
              <dd>Coimbatore, Tamil Nadu</dd>
            </div>
          </dl>
        </div>

        {/* ───── Right: the brief ───── */}
        <div className="relative">
          <div className="js-paper relative rotate-0 bg-[#fff9eb] px-6 pb-10 pt-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out sm:px-10 lg:rotate-[0.7deg] lg:focus-within:rotate-0">
            {/* tape */}
            <span
              aria-hidden
              className="js-tape absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[#ffb08a]/55 backdrop-blur-[1px]"
            />

            {status === "sent" ? (
              <div className={`relative flex min-h-[460px] flex-col justify-center ${INK}`}>
                <p className="font-newsreader text-[1.15rem] italic text-[#ff6f3c]">Brief received</p>
                <h3 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.2rem)] font-medium leading-[0.98] tracking-[-0.035em]">
                  Thanks{name ? `, ${name.split(" ")[0]}` : ""}.
                  <br />
                  We&rsquo;ll be in touch.
                </h3>
                <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-[#2a0610]/70">
                  We read every brief properly. Expect a reply with next steps, usually within two working days.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 w-fit text-[15px] underline decoration-[#2a0610]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]"
                >
                  Write another brief
                </button>

                <div
                  aria-hidden
                  className="js-stamp pointer-events-none absolute right-2 top-6 grid h-32 w-32 place-items-center rounded-full border-[3px] border-[#b3141f] text-[#b3141f] opacity-0"
                >
                  <span className="grid h-[104px] w-[104px] place-items-center rounded-full border border-[#b3141f] text-center font-display text-[15px] font-bold uppercase leading-tight tracking-[0.12em]">
                    Received
                    <span className="-mt-3 block text-[9px] tracking-[0.2em]">Dot Flavr</span>
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className={INK}>
                <h3 className="font-display text-[clamp(1.8rem,2.8vw,2.4rem)] font-medium leading-none tracking-[-0.035em]">
                  The brief
                </h3>
                <p className="mt-2 font-newsreader text-[1.05rem] italic text-[#2a0610]/60">
                  Tell us what you can. Skip what you can&rsquo;t.
                </p>

                <div className="mt-9 space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field n="01" label="Your name" htmlFor="c-name">
                      <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" className={line} />
                    </Field>
                    <Field n="02" label="Company / Organisation" htmlFor="c-company">
                      <input id="c-company" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Where you work (Optional)" className={line} />
                    </Field>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field n="03" label="Email" htmlFor="c-email" error={errors.email}>
                      <input
                        id="c-email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        placeholder="you@company.com"
                        className={line}
                      />
                    </Field>
                    <Field n="04" label="Phone / WhatsApp" htmlFor="c-phone">
                      <input
                        id="c-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210 (Optional)"
                        className={line}
                      />
                    </Field>
                  </div>

                  <fieldset className="js-field">
                    <legend className="flex items-baseline gap-2.5">
                      <span className="font-newsreader text-[15px] italic text-[#ff6f3c]">05</span>
                      <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">What are you exploring?</span>
                    </legend>
                    <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {SERVICES.map((s) => (
                        <label key={s} className="group flex cursor-pointer items-center gap-3 text-[16px]">
                          <input
                            type="checkbox"
                            checked={services.includes(s)}
                            onChange={() => toggleService(s)}
                            className="peer sr-only"
                          />
                          <span className="grid h-[22px] w-[22px] shrink-0 place-items-center border border-[#2a0610]/50 transition-colors group-hover:border-[#2a0610] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff6f3c]">
                            <Tick />
                          </span>
                          <span className="transition-opacity group-has-[:checked]:font-medium">{s}</span>
                        </label>
                      ))}
                    </div>
                    {errors.services && <p role="alert" className="mt-2 text-[13px] text-[#b3141f]">{errors.services}</p>}
                  </fieldset>

                  <Field n="06" label="Tell us a little about your idea." htmlFor="c-details">
                    <p className="mt-1 font-newsreader text-[0.95rem] italic text-[#2a0610]/60">
                      What are you making, exploring, or trying to figure out?
                    </p>
                    <textarea
                      id="c-details"
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Not quite sure where to start? That’s okay. Tell us what you have in mind, even if it’s just a rough idea."
                      className={`${line} mt-2 resize-y leading-relaxed`}
                    />
                  </Field>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
                  <p className="max-w-[14rem] font-newsreader text-[0.95rem] italic leading-snug text-[#2a0610]/55">
                    Your idea stays between us.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex h-[52px] items-center gap-3 bg-[#2a0610] px-8 text-[15px] font-semibold text-[#fff9eb] transition-colors duration-300 hover:bg-[#ff6f3c] disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send your note"}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>

                {status === "error" && (
                  <p role="alert" className="mt-4 text-[13px] text-[#b3141f]">
                    Something went wrong. Please try again, or email us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}