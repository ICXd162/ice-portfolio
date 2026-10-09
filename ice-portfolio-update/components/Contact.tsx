"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle,
  EnvelopeSimple,
  Phone,
  ChatCircle,
  InstagramLogo,
  FacebookLogo,
  WarningCircle,
} from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { contact, telHref } from "@/lib/work";

// Layout family: single large card, details left and form right.
// Submissions go to Netlify Forms (form "contact", declared in public/__forms.html).

type Fields = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const types = ["Short form", "Long form", "Motion graphics", "Banners and thumbnails", "Something else"];

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Add your name or company.";
  if (!f.email.trim()) e.email = "Add an email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "That email address looks incomplete.";
  if (f.message.trim().length < 20) e.message = "Add a sentence or two about the project (20 characters minimum).";
  return e;
}

const input =
  "w-full rounded-2xl border bg-ink px-4 py-3 text-[15px] text-paper placeholder:text-[#8a8a90] transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent";

export function Contact() {
  const reduce = useReducedMotion();
  const [f, setF] = useState<Fields>({ name: "", email: "", type: types[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending");
    try {
      const body = new URLSearchParams({ "form-name": "contact", ...f, "bot-field": "" });
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const field = (k: keyof Fields) => ({ id: `c-${k}`, name: k, "aria-invalid": !!errors[k], "aria-describedby": `c-${k}-help` });
  const border = (k: keyof Fields) => (errors[k] ? "border-[#ff8a72]" : "border-[#3a3a3e] hover:border-[#6a6a70]");
  const help = (k: keyof Fields, fallback: string) => (
    <p id={`c-${k}-help`} className={`text-sm ${errors[k] ? "text-[#ff8a72]" : "text-mute"}`}>
      {errors[k] ?? fallback}
    </p>
  );

  const details = [
    { icon: EnvelopeSimple, label: contact.email, href: contact.email ? `mailto:${contact.email}` : "" },
    { icon: Phone, label: contact.phone, href: contact.phone ? telHref(contact.phone) : "" },
    { icon: ChatCircle, label: contact.line ? `LINE: ${contact.line}` : "", href: contact.line ? `https://line.me/ti/p/~${contact.line}` : "" },
    { icon: InstagramLogo, label: "Instagram", href: contact.instagram },
    { icon: FacebookLogo, label: "Facebook", href: contact.facebook },
  ].filter((d) => d.href && d.label);

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 rounded-[28px] bg-ink-2 p-6 md:p-10 lg:grid-cols-12 lg:gap-10 lg:p-14">
          <Reveal className="lg:col-span-5">
            <h2 className="max-w-[12ch] text-4xl leading-[1.05] font-medium tracking-[-0.04em] md:text-5xl">{contact.heading}</h2>
            {contact.intro && <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-mute">{contact.intro}</p>}
            <ul className="mt-10 grid gap-3">
              {details.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    target={d.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-[17px] text-paper transition-colors hover:text-accent"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-3 text-mute group-hover:text-accent">
                      <d.icon size={18} />
                    </span>
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  className="flex h-full flex-col justify-center rounded-[var(--radius-card)] bg-ink p-8"
                >
                  <CheckCircle size={36} weight="fill" className="text-accent" />
                  <p className="mt-5 text-2xl font-medium tracking-tight">Thanks, your brief was sent.</p>
                  <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-mute">
                    I&apos;ll reply to {f.email} with a timeline and quote.
                  </p>
                  <button
                    onClick={() => {
                      setF({ name: "", email: "", type: types[0], message: "" });
                      setStatus("idle");
                    }}
                    className="mt-8 self-start text-sm text-mute underline underline-offset-4 hover:text-paper"
                  >
                    Send another brief
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  noValidate
                  onSubmit={onSubmit}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>
                  <div className="grid gap-2">
                    <label htmlFor="c-name" className="text-sm font-medium">Name or company</label>
                    <input {...field("name")} value={f.name} onChange={set("name")} autoComplete="organization" className={`${input} ${border("name")}`} />
                    {help("name", "Who the project is for.")}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="c-email" className="text-sm font-medium">Email</label>
                    <input {...field("email")} type="email" value={f.email} onChange={set("email")} autoComplete="email" className={`${input} ${border("email")}`} />
                    {help("email", "Where I send the quote.")}
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <label htmlFor="c-type" className="text-sm font-medium">Project type</label>
                    <select {...field("type")} value={f.type} onChange={set("type")} className={`${input} ${border("type")} appearance-none`}>
                      {types.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    {help("type", "Pick the closest one.")}
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <label htmlFor="c-message" className="text-sm font-medium">About the project</label>
                    <textarea
                      {...field("message")}
                      rows={5}
                      value={f.message}
                      onChange={set("message")}
                      placeholder="Platform, length, deadline, reference links"
                      className={`${input} ${border("message")} resize-y`}
                    />
                    {help("message", "Rough details are fine.")}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex h-12 items-center gap-3 rounded-full bg-accent pr-2 pl-6 text-[15px] font-medium whitespace-nowrap text-white transition-[transform,background-color] hover:bg-[#ff5a3d] active:scale-[0.97] disabled:opacity-70"
                    >
                      {status === "sending" ? "Sending" : "Book a project"}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:rotate-45">
                        <ArrowUpRight size={14} weight="bold" />
                      </span>
                    </button>
                    {status === "failed" && (
                      <p role="alert" className="inline-flex items-center gap-2 text-sm text-[#ff8a72]">
                        <WarningCircle size={16} /> Sending failed. Email {contact.email} directly instead.
                      </p>
                    )}
                    {status !== "failed" && Object.values(errors).some(Boolean) && (
                      <p role="alert" className="inline-flex items-center gap-2 text-sm text-[#ff8a72]">
                        <WarningCircle size={16} /> Check the fields above.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
