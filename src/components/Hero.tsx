import React from 'react';
import { motion } from 'motion/react';
import { Flame, ArrowDown } from 'lucide-react';
import { AppSettings } from '../types';
import Logo from './Logo';

interface HeroProps {
  settings: AppSettings;
  onJoinClick: () => void;
}

export default function Hero({ settings, onJoinClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-dark-mesh py-16 md:py-24 text-center">
      {/* Background glowing blobs */}
      <div className="absolute top-1/3 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[100px]" />
      <div className="absolute top-1/2 left-1/4 -z-10 h-48 w-48 rounded-full bg-amber-500/10 blur-[80px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Sirens Headline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-xl font-black uppercase tracking-tight text-white md:text-3xl font-display"
        >
          <span>🚨</span>
          <h1 className="leading-tight">
            RASTREIO DE OFERTAS{' '}
            <span className="text-[#25d366] drop-shadow-[0_0_12px_rgba(37,211,102,0.4)]">
              100% GRATUITO
            </span>
          </h1>
          <span>🚨</span>
        </motion.div>

        {/* Central Round Avatar with our beautiful custom cowboy logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
          className="relative mt-8 mb-6 h-48 w-48 md:h-56 md:w-56 overflow-hidden rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
        >
          <Logo
            className="w-full h-full"
            customImageUrl={settings.logoUrl}
            logoZoom={settings.logoZoom}
            logoYOffset={settings.logoYOffset}
          />
        </motion.div>

        {/* Caption below avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg font-bold text-slate-200 md:text-xl flex items-center gap-1.5 justify-center"
        >
          <span>Produtos pela</span>
          <span className="font-extrabold text-white underline decoration-amber-500 decoration-2">
            METADE DO PREÇO
          </span>
          <span className="text-amber-400 font-black animate-pulse">⚡</span>
        </motion.div>

        {/* Central High-Conversion Call To Action Button (Matches Screen 1) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 w-full max-w-md px-2"
        >
          <a
            href={settings.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onJoinClick}
            className="animate-pulse-glow group flex w-full items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-r from-[#25d366] to-[#128c7e] py-5 text-lg font-black tracking-wider text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_25px_rgba(37,211,102,0.6)] active:scale-95"
            id="btn-join-whatsapp-hero"
          >
            {/* WhatsApp Icon SVG */}
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.968C16.528 1.917 14.053.89 11.432.89 5.995.89 1.572 5.311 1.568 10.745c-.001 1.638.452 3.235 1.312 4.645l-.1 1.62c-.225 1.594.52 1.45 1.4 1l1.558.94zm11.23-7.552c-.31-.155-1.838-.907-2.122-1.01-.284-.103-.49-.155-.697.155-.207.31-.802 1.01-.983 1.215-.18.207-.36.233-.67.078-.31-.155-1.309-.48-2.493-1.537-.922-.821-1.544-1.837-1.725-2.147-.18-.31-.02-.477.136-.631.14-.139.31-.362.465-.544.155-.18.207-.31.31-.517.103-.207.05-.388-.026-.543-.078-.155-.697-1.679-.955-2.303-.25-.61-.51-.525-.697-.535-.18-.01-.387-.01-.594-.01-.207 0-.543.078-.827.388-.284.31-1.086 1.062-1.086 2.587 0 1.526 1.11 2.998 1.265 3.205.155.207 2.185 3.337 5.294 4.678.74.32 1.317.51 1.768.653.743.236 1.42.203 1.954.123.595-.088 1.838-.75 2.096-1.474.258-.724.258-1.344.18-1.474-.076-.13-.283-.207-.593-.362z" />
            </svg>
            <span className="font-display">ENTRAR NO GRUPO</span>
          </a>

          {/* Member badge below button */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
            <span>✓</span>
            <span className="uppercase tracking-widest text-[10px] sm:text-xs">
              JÁ SOMOS {settings.memberCountLabel.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Scroll indicator pointing to benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-16 flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer"
          onClick={() => {
            document.getElementById('section-benefits')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>veja o que você recebe</span>
          <ArrowDown className="h-4.5 w-4.5 text-emerald-400 animate-bounce" />
        </motion.div>

      </div>
    </section>
  );
}

