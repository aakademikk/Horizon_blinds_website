"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import SceneImage from "@/components/scene/SceneImage";
import { CtaLink } from "@/components/ui/Cta";
import { finderQuestions } from "@/lib/content";
import { gbp, products } from "@/lib/products";
import { presetFor } from "@/lib/presets";

export default function ProductFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const reduce = useReducedMotion();

  const total = finderQuestions.length;
  const done = step >= total;

  const ranked = useMemo(() => {
    const scores = new Map<string, number>();
    finderQuestions.forEach((q) => {
      const chosen = q.options.find((o) => o.id === answers[q.id]);
      if (!chosen) return;
      Object.entries(chosen.weights).forEach(([id, w]) => {
        scores.set(id, (scores.get(id) ?? 0) + w);
      });
    });

    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ product: products.find((p) => p.id === id)!, score }))
      .filter((r) => r.product)
      .slice(0, 3);
  }, [answers]);

  const maxScore = ranked[0]?.score ?? 1;

  function choose(questionId: string, optionId: string) {
    setAnswers((a) => ({ ...a, [questionId]: optionId }));
    // A short pause so the selection is visibly registered before moving on.
    window.setTimeout(() => setStep((s) => s + 1), reduce ? 0 : 260);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="border border-line bg-section">
      {/* ----------------------------------------------------------- header */}
      <div className="flex items-center justify-between gap-6 border-b border-line px-6 py-5 md:px-10">
        <div className="flex items-center gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              aria-label="Previous question"
              className="grid size-9 place-items-center border border-line text-muted transition-colors duration-500 hover:border-brand hover:text-brand-deep"
            >
              <ArrowLeft className="size-4" strokeWidth={1.4} />
            </button>
          )}
          <span className="eyebrow text-faint" data-tnum>
            {done ? "Your results" : `Question ${step + 1} of ${total}`}
          </span>
        </div>

        {(step > 0 || done) && (
          <button
            type="button"
            onClick={restart}
            className="flex items-center gap-2 text-[0.75rem] text-muted transition-colors duration-500 hover:text-brand-deep"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.5} />
            Start again
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="h-px w-full bg-line">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-brand-deep to-brand-light"
          animate={{ scaleX: done ? 1 : step / total }}
          initial={false}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="p-6 md:p-12">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="display-lg !text-[clamp(1.75rem,3vw,2.5rem)] text-ink">
                {finderQuestions[step].question}
              </h3>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
                {finderQuestions[step].hint}
              </p>

              <div
                role="radiogroup"
                aria-label={finderQuestions[step].question}
                className="mt-10 grid gap-3 sm:grid-cols-2"
              >
                {finderQuestions[step].options.map((o) => {
                  const selected = answers[finderQuestions[step].id] === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(finderQuestions[step].id, o.id)}
                      className={[
                        "group border p-6 text-left transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        selected
                          ? "border-brand bg-brand/[0.07]"
                          : "border-line hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-soft",
                      ].join(" ")}
                    >
                      <span className="block font-display text-[1.375rem] font-light text-ink">
                        {o.label}
                      </span>
                      <span className="mt-1.5 block text-[0.8125rem] text-muted">{o.note}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="display-lg text-ink">Based on your answers…</h3>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
                Three we would genuinely put forward. Bring these up at the survey and we will show
                you samples of each.
              </p>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {ranked.map(({ product, score }, i) => (
                  <motion.article
                    key={product.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.12 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`card-luxe overflow-hidden ${i === 0 ? "ring-1 ring-brand" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                      <SceneImage {...presetFor(product.id)} className="size-full" />
                      {i === 0 && (
                        <span className="absolute left-4 top-4 bg-brand px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.18em] text-ink">
                          Best match
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="display-md !text-[1.25rem] text-ink">{product.name}</h4>
                        <span className="shrink-0 text-[0.75rem] text-faint" data-tnum>
                          {Math.round((score / maxScore) * 100)}%
                        </span>
                      </div>
                      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">
                        {product.strapline}
                      </p>
                      <p className="mt-4 text-[0.8125rem] text-muted" data-tnum>
                        From {gbp(Math.round((product.rate * 1.4) / 10) * 10)} per window, fitted
                      </p>
                      <Link
                        href={`/${product.family}#${product.slug.replace("-blinds", "")}`}
                        className="link-underline mt-5 inline-block text-[0.8125rem] text-ink"
                      >
                        Read more
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="mt-12 flex flex-col gap-4 border-t border-line pt-9 sm:flex-row sm:items-center">
                <CtaLink href="/contact#survey" variant="ink">
                  Book a Home Visit
                </CtaLink>
                <p className="text-[0.8125rem] leading-relaxed text-muted">
                  Mention this shortlist and we will bring exactly these samples with us.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
