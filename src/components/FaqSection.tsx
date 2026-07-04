import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FaqSectionProps {
  faqs: FAQItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#050d0a] py-16 px-4 sm:px-6 lg:px-8 border-t border-dark-border" id="section-faq">
      <div className="mx-auto max-w-4xl">
        
        {/* Title */}
        <div className="text-center">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-full">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            Perguntas Relâmpago
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Ficou com alguma dúvida sobre o grupo? Veja as respostas rápidas abaixo.
          </p>
        </div>

        {/* FAQs List */}
        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/20'
                    : 'border-dark-border bg-dark-card hover:bg-slate-900/50'
                }`}
              >
                {/* Accordion Trigger Button */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left outline-none"
                  aria-expanded={isOpen}
                  id={`btn-faq-${faq.id}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="font-display text-sm font-bold text-slate-200 sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {/* Animated Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-dark-border px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

