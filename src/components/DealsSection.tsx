import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Flame, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import { Deal } from '../types';

interface DealsSectionProps {
  deals: Deal[];
  onDealClick: (dealId: string) => void;
}

export default function DealsSection({ deals, onDealClick }: DealsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique categories from deals
  const categories = useMemo(() => {
    const cats = new Set<string>();
    deals.forEach((deal) => {
      if (deal.category) {
        cats.add(deal.category);
      }
    });
    return ['Tudo', ...Array.from(cats)];
  }, [deals]);

  // Filter deals based on search and category
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.description && deal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        deal.storeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Tudo' || deal.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [deals, searchTerm, selectedCategory]);

  const handleCopyCoupon = (e: React.MouseEvent, coupon: string, dealId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(coupon);
    setCopiedId(dealId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <section id="section-deals" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050d0a] border-b border-dark-border">
      <div className="mx-auto max-w-7xl">
        
        {/* Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            OFERTAS DO DIA
          </span>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            Últimos Achados Verificados
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            As melhores promoções e cupons da internet, curadas pela nossa equipe. Clique em "Pegar Oferta" para ir à loja oficial.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar oferta, loja ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-dark-border bg-dark-card/60 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {/* Total count badge */}
            <div className="shrink-0 text-xs font-bold text-slate-400">
              Exibindo <span className="text-emerald-400 font-extrabold">{filteredDeals.length}</span> achados
            </div>
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-image-horizontal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/20'
                    : 'bg-dark-card text-slate-400 border border-dark-border hover:bg-emerald-950/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.map((deal, idx) => {
              const isHot = deal.isHot;
              return (
                <motion.div
                  key={deal.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                  className="flex flex-col bg-dark-card rounded-3xl border border-dark-border overflow-hidden shadow-lg hover:border-emerald-800/40 hover:shadow-emerald-950/25 transition-all duration-300 group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-emerald-950/10">
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* HOT Badge */}
                    {isHot && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-md shadow-rose-950/50 animate-pulse">
                        <Flame className="h-3 w-3 fill-white" />
                        Super Quente
                      </span>
                    )}

                    {/* Store Badge */}
                    <span className="absolute right-4 top-4 rounded-xl bg-slate-900/90 border border-dark-border px-3 py-1 text-[10px] font-black tracking-wide text-white uppercase">
                      {deal.storeName}
                    </span>

                    {/* Time elapsed badge */}
                    <span className="absolute left-4 bottom-4 text-[10px] font-bold text-slate-300">
                      {deal.postedAt}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-5.5 flex flex-col justify-between">
                    <div>
                      {/* Category */}
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        {deal.category}
                      </span>
                      {/* Title */}
                      <h3 className="mt-1.5 font-display text-base font-extrabold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                        {deal.title}
                      </h3>
                      {/* Description */}
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {deal.description}
                      </p>
                    </div>

                    <div className="mt-5 space-y-4">
                      {/* Price Section */}
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 line-through">
                            De {formatPrice(deal.originalPrice)}
                          </span>
                          <span className="text-xl font-black text-white leading-none mt-0.5">
                            {formatPrice(deal.discountPrice)}
                          </span>
                        </div>
                        <span className="rounded-xl bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 px-2.5 py-1 text-[11px] font-extrabold">
                          -{deal.discountPercent}%
                        </span>
                      </div>

                      {/* Coupon Code Block */}
                      {deal.couponCode && (
                        <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-800/40 bg-emerald-950/10 p-2.5">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Cupom</span>
                            <span className="text-xs font-mono font-bold text-emerald-300 tracking-wide uppercase select-all">
                              {deal.couponCode}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleCopyCoupon(e, deal.couponCode || '', deal.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-900/30 border border-emerald-800/40 hover:bg-emerald-800/40 px-2.5 py-1.5 text-[10px] font-bold text-emerald-400 transition-all cursor-pointer"
                          >
                            {copiedId === deal.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Action Button */}
                      <a
                        href={deal.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => onDealClick(deal.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-xs font-extrabold text-white tracking-wider uppercase transition-colors shadow-md shadow-emerald-950/40 cursor-pointer"
                      >
                        <span>Pegar Oferta</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      {/* Click indicator */}
                      <div className="text-center text-[9px] font-bold text-slate-500 tracking-wide">
                        🔥 {deal.clicks || 0} CLIQUES NESTE ACHADO
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-dark-border bg-dark-card/30">
            <span className="text-3xl">🔍</span>
            <h3 className="mt-4 font-display text-base font-bold text-white">Nenhum achado localizado</h3>
            <p className="mt-1 text-xs text-slate-500">Tente buscar por outro termo ou selecione uma categoria diferente.</p>
          </div>
        )}
      </div>
    </section>
  );
}
