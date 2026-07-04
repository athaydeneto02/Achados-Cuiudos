import React from 'react';
import { MessageSquareCode, BellRing, Coins } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Entre no Grupo Oficial',
      description: 'Clique no botão verde central e acesse o grupo oficial do WhatsApp. É 100% livre, seguro e grátis.',
      icon: <MessageSquareCode className="h-6 w-6 text-emerald-400" />
    },
    {
      num: '2',
      title: 'Ative as Notificações',
      description: 'As melhores promoções (como erros de preço e cupons raros) duram poucos minutos. Deixe o grupo com som ligado!',
      icon: <BellRing className="h-6 w-6 text-amber-400 animate-bounce" />
    },
    {
      num: '3',
      title: 'Compre com Desconto',
      description: 'Apenas clique nos links verificados das lojas enviadas e garanta sua compra pelo menor preço antes que o estoque acabe.',
      icon: <Coins className="h-6 w-6 text-emerald-400" />
    }
  ];

  return (
    <section id="section-benefits" className="bg-[#050d0a]/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-dark-border scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-full">
            PASSO A PASSO DE VANTAGENS
          </span>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            Como Funciona o Achados do Cuiudo?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Sem segredos, sem cadastros demorados e sem taxas. Economia bruta de forma inteligente e rápida!
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center p-8 bg-dark-card rounded-3xl border border-dark-border shadow-md hover:border-emerald-800/40 transition-all duration-300 group"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-display text-xs font-black text-white shadow-md shadow-emerald-950/50">
                {step.num}
              </div>

              {/* Icon Container */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/30 border border-emerald-900/30 mb-5 group-hover:bg-emerald-950/50 transition-colors">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-bold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Guarantee Footer inside Steps */}
        <div className="mt-12 flex flex-col items-center justify-center p-6 bg-emerald-950/20 rounded-2xl border border-emerald-900/30 max-w-3xl mx-auto text-center sm:flex-row sm:gap-4 sm:text-left">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-sm mb-3 sm:mb-0 shrink-0 shadow-lg shadow-emerald-950/50">
            ✓
          </div>
          <div>
            <h4 className="font-display text-sm font-extrabold text-emerald-400">Compromisso com sua Segurança</h4>
            <p className="text-xs text-slate-400">Nunca solicitamos dados pessoais, senhas ou cobramos nenhum valor de nossos membros.</p>
          </div>
        </div>

      </div>
    </section>
  );
}

