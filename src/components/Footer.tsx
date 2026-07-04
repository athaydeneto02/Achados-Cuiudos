import React from 'react';
import { AppSettings } from '../types';
import Logo from './Logo';

interface FooterProps {
  settings: AppSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#030705] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid gap-8 md:grid-cols-2 items-center justify-between border-b border-dark-border pb-8">
          
          {/* Logo Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <Logo
                size={32}
                customImageUrl={settings.logoUrl}
                logoZoom={settings.logoZoom}
                logoYOffset={settings.logoYOffset}
              />
              <span className="font-display text-lg font-black text-white">
                {settings.groupName}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 max-w-md">
              O maior grupo de curadoria de ofertas, cupons e garimpos inteligentes do Brasil. Economia bruta de verdade, todos os dias direto no seu celular.
            </p>
          </div>

          {/* Quick links / stats */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 sm:self-center md:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-slate-500">Membros Ativos</p>
              <p className="font-display text-sm font-black text-emerald-400">{settings.memberCountLabel}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-slate-500">Serviço Oficial</p>
              <p className="font-display text-sm font-black text-amber-400">100% Gratuito</p>
            </div>
          </div>

        </div>

        {/* Legal Disclaimers (Crucial for high conversion and professional vibe) */}
        <div className="mt-8 text-[10px] text-slate-600 leading-relaxed space-y-2 max-w-5xl">
          <p>
            <strong>Isenção de Responsabilidade:</strong> O site <strong>{settings.groupName}</strong> é um canal de divulgação independente de promoções, cupons de desconto e ofertas de parceiros. Não vendemos nenhum produto ou serviço diretamente. Não nos responsabilizamos pela entrega, garantia, faturamento ou pós-venda dos produtos anunciados.
          </p>
          <p>
            Todos os preços, estoques e cupons divulgados estão sujeitos a alterações repentinas pelas próprias plataformas varejistas (Amazon, Shopee, Mercado Livre, Magalu, etc.) e podem expirar a qualquer momento sem aviso prévio. O valor oficial sempre será o exibido no carrinho final de compras da respectiva loja.
          </p>
          <p>
            Todas as marcas comerciais, logos e nomes de lojas exibidos são de propriedade de seus respectivos donos e marcas detentoras, sendo aqui usados puramente para fins de identificação da oferta.
          </p>
        </div>

        {/* Copyright and signature */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6 border-t border-dark-border">
          <p>© {new Date().getFullYear()} {settings.groupName} • Todos os direitos reservados.</p>
          <p className="text-[10px] text-slate-600">
            Desenvolvido com carinho para o maior conforto dos novos membros.
          </p>
        </div>

      </div>
    </footer>
  );
}

