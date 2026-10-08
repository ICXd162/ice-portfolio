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

// Layout family: details column + form.
// There is no backend: on submit the form validates, then opens the visitor's email app
// with the brief pre-filled to Ice's address.

type Fields = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const types = ["Short form", "Long form", "Motion graphics", "Banners and stills", "Something else"];

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Add your name or company.";
  if (!f.email.trim()) e.email = "Add an email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "That email address looks incomplete.";
  if (f.message.trim().length < 20) e.message = "A sentence or two about the project helps (20 characters minimum).";
  return e;
}

const inputBase =
  "w-full border bg-ink-2 px-4 py-3 text-[15px] text-paper placeholder:text-[#8a8a90] transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent";

export function Contact() {
  const reduce = useReducedMotion();
  const [f, setF] = useState<Fields>({ name: "", email: "", type: types[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending");
    const subject = encodeURIComponent(`${f.type} project from ${f.name}`);
    const body = encodeURIComponent(`${f.message}\n\n${f.name}\n${f.email}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const field = (k: keyof Fields) => ({
    id: `c-${k}`,
    "aria-invalid": !!errors[k],
    "aria-describedby": `c-${k}-help`,
  });
  const border = (k: keyof Fields) => (errors[k] ? "border-[#f08a6c]" : "border-[#6a6a70] hover:border-paper");

  const details = [
    { icon: EnvelopeSimple, label: contact.email, href: contact.email ? `mailto:${contact.email}` : "" },
    { icon: Phone, label: contact.phone, href: contact.phone ? telHref(contact.phone) : "" },
    { icon: ChatCircle, label: `LINE: ${contact.line}`, href: contact.line ? `https://line.me/ti/p/~${contact.line}` : "" },
    { icon: InstagramLogo, label: "Instagram", href: contact.instagram },
    { icon: FacebookLogo, label: "Facebook", href: contact.facebook },
  ].filter((d) => d.href && !d.label.endsWith(": "));

  return (
    <section id="contact" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-4 md:px-8 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <h2 className="max-w-[12ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-6xl">
            {contact.heading}
          </h2>
          <ul className="mt-12 space-y-4">
            {details.map((d) => (
              <li key={d.label}>
                <a
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-[17px] text-paper transition-colors hover:text-accent"
                >
                  <d.icon size={20} className="text-mute group-hover:text-accent" />
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                role="status"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-line bg-ink-2 p-8"
              >
                <CheckCircle size={32} weight="light" className="text-accent" />
                <p className="mt-5 text-2xl font-medium tracking-tight">Your email app should now be open.</p>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-mute">
                  Press send there and I&apos;ll reply with a quote. If nothing opened, write to{" "}
                  <a className="text-paper underline underline-offset-4" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  .
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-sm text-mute underline underline-offset-4 hover:text-paper"
                >
                  Edit the brief
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                <div className="grid gap-2">
                  <label htmlFor="c-name" className="text-sm font-medium text-paper">Name or company</label>
                  <input {...field("name")} value={f.name} onChange={set("name")} autoComplete="organization" className={`${inputBase} ${border("name")}`} />
                  <p id="c-name-help" className={`text-sm ${errors.name ? "text-[#f08a6c]" : "text-mute"}`}>
                    {errors.name ?? "Who the project is for."}
                  </p>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="c-email" className="text-sm font-medium text-paper">Email</label>
                  <input {...field("email")} type="email" value={f.email} onChange={set("email")} autoComplete="email" className={`${inputBase} ${border("email")}`} />
                  <p id="c-email-help" className={`text-sm ${errors.email ? "text-[#f08a6c]" : "text-mute"}`}>
                    {errors.email ?? "Where I send the quote."}
                  </p>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <label htmlFor="c-type" className="text-sm font-medium text-paper">Project type</label>
                  <select {...field("type")} value={f.type} onChange={set("type")} className={`${inputBase} ${border("type")} appearance-none`}>
                    {types.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <p id="c-type-help" className="text-sm text-mute">Pick the closest one.</p>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <label htmlFor="c-message" className="text-sm font-medium text-paper">About the project</label>
                  <textarea {...field("message")} rows={5} value={f.message} onChange={set("message")} placeholder="Platform, length, deadline, reference links" className={`${inputBase} ${border("message")} resize-y`} />
                  <p id="c-message-help" className={`text-sm ${errors.message ? "text-[#f08a6c]" : "text-mute"}`}>
                    {errors.message ?? "Rough details are fine."}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex h-12 items-center gap-2 bg-accent px-5 text-[15px] font-medium whitespace-nowrap text-accent-ink transition-[transform,background-color] duration-300 hover:bg-paper active:translate-y-[1px] active:scale-[0.98] disabled:opacity-70"
                  >
                    {status === "sending" ? "Opening email" : "Book a project"}
                    <ArrowUpRight size={16} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                  {Object.keys(errors).some((k) => errors[k as keyof Fields]) && (
                    <p role="alert" className="inline-flex items-center gap-2 text-sm text-[#f08a6c]">
                      <WarningCircle size={16} /> Check the fields above.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
