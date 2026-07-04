import React from 'react';
import { Settings, Users, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';
import Logo from './Logo';

interface HeaderProps {
  settings: AppSettings;
  onOpenAdmin: () => void;
}

export default function Header({ settings, onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-[#050d0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Logo
            size={44}
            className="animate-float"
            customImageUrl={settings.logoUrl}
            logoZoom={settings.logoZoom}
            logoYOffset={settings.logoYOffset}
          />
          <div className="flex flex-col">
            <span className="font-display text-base font-extrabold tracking-tight text-white sm:text-lg">
              {settings.groupName}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 sm:text-[10px]">
                Grupo de Ofertas Ativo
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Badges and Configuration Link */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-400 md:flex">
            <Users className="h-3.5 w-3.5 text-emerald-500" />
            <span>{settings.memberCountLabel}</span>
          </div>
          
          <div className="hidden items-center gap-1.5 rounded-full bg-amber-950/40 border border-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-400 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>100% Gratuito</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            title="Configurar Link do WhatsApp"
            id="btn-admin-config"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

