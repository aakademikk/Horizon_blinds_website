"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      setMessage("That email address does not look quite right.");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email, name: "Newsletter subscriber" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setMessage("Thank you — you are on the list.");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again, or email us directly.");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-6 flex items-center gap-2.5 text-[0.875rem] text-brand-light" role="status">
        <Check className="size-4" strokeWidth={1.6} />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-2 border-b border-white/20 transition-colors duration-500 focus-within:border-brand">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="Your email address"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "newsletter-error" : undefined}
          className="w-full bg-transparent py-3 text-[0.875rem] text-white placeholder:text-white/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe"
          className="grid size-9 shrink-0 place-items-center text-brand transition-all duration-500 hover:translate-x-1 hover:text-brand-light disabled:opacity-40"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      {state === "error" && (
        <p id="newsletter-error" role="alert" className="mt-2.5 text-[0.75rem] text-[#E5A08C]">
          {message}
        </p>
      )}
    </form>
  );
}
