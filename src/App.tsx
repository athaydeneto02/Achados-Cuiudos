import React, { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS, DEFAULT_FAQS, DEFAULT_DEALS } from './data';
import { AppSettings, Deal } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import DealsSection from './components/DealsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { Flame } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase';

const getInitialSettings = (): AppSettings => {
  const saved = localStorage.getItem('achados_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return DEFAULT_SETTINGS;
};

export default function App() {
  // Global States
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  const [faqs] = useState(DEFAULT_FAQS);
  const [deals, setDeals] = useState<Deal[]>(DEFAULT_DEALS);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // UI Modal States
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load from Supabase (or localStorage on fallback) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdminButton(true);
    }

    async function loadData() {
      setIsLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          // Load settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'default')
            .single();

          if (settingsError) {
            console.warn('Error loading settings from Supabase, trying localStorage', settingsError);
            loadSettingsFromLocalStorage();
          } else if (settingsData) {
            setSettings({
              whatsappUrl: settingsData.whatsapp_url,
              groupName: settingsData.group_name,
              memberCountLabel: settingsData.member_count_label,
              alertBannerText: settingsData.alert_banner_text,
              logoEmoji: settingsData.logo_emoji,
              logoUrl: settingsData.logo_url || '',
              logoZoom: settingsData.logo_zoom || 100,
              logoYOffset: settingsData.logo_y_offset || 0,
            });
          }

          // Load deals
          const { data: dealsData, error: dealsError } = await supabase
            .from('deals')
            .select('*')
            .order('created_at', { ascending: false });

          if (dealsError) {
            console.warn('Error loading deals from Supabase, using defaults', dealsError);
          } else if (dealsData && dealsData.length > 0) {
            const mappedDeals: Deal[] = dealsData.map((d: any) => ({
              id: d.id,
              title: d.title,
              description: d.description || '',
              originalPrice: Number(d.original_price),
              discountPrice: Number(d.discount_price),
              discountPercent: Number(d.discount_percent),
              imageUrl: d.image_url,
              storeName: d.store_name,
              storeLogo: d.store_logo || '',
              link: d.link,
              category: d.category,
              isHot: d.is_hot,
              couponCode: d.coupon_code || '',
              clicks: Number(d.clicks || 0),
              postedAt: d.posted_at
            }));
            setDeals(mappedDeals);
          }
        } catch (err) {
          console.error('Failed to load data from Supabase', err);
          loadSettingsFromLocalStorage();
        } finally {
          setIsLoading(false);
        }
      } else {
        loadSettingsFromLocalStorage();
        setIsLoading(false);
      }
    }

    function loadSettingsFromLocalStorage() {
      const savedSettings = localStorage.getItem('achados_settings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error('Error parsing settings from localStorage', e);
        }
      }
    }

    loadData();
  }, []);

  // Persist Settings
  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('settings')
          .upsert({
            id: 'default',
            whatsapp_url: newSettings.whatsappUrl,
            group_name: newSettings.groupName,
            member_count_label: newSettings.memberCountLabel,
            alert_banner_text: newSettings.alertBannerText,
            logo_emoji: newSettings.logoEmoji,
            logo_url: newSettings.logoUrl || '',
            logo_zoom: newSettings.logoZoom || 100,
            logo_y_offset: newSettings.logoYOffset || 0,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Failed to upsert settings to Supabase, saving to localStorage as fallback', error);
          localStorage.setItem('achados_settings', JSON.stringify(newSettings));
        }
      } catch (err) {
        console.error('Error saving settings to Supabase', err);
        localStorage.setItem('achados_settings', JSON.stringify(newSettings));
      }
    } else {
      localStorage.setItem('achados_settings', JSON.stringify(newSettings));
    }
  };

  // Reset all to default data
  const handleResetAll = async () => {
    if (confirm('Tem certeza que deseja restaurar as configurações originais de fábrica?')) {
      setSettings(DEFAULT_SETTINGS);
      setDeals(DEFAULT_DEALS);
      
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('settings')
            .upsert({
              id: 'default',
              whatsapp_url: DEFAULT_SETTINGS.whatsappUrl,
              group_name: DEFAULT_SETTINGS.groupName,
              member_count_label: DEFAULT_SETTINGS.memberCountLabel,
              alert_banner_text: DEFAULT_SETTINGS.alertBannerText,
              logo_emoji: DEFAULT_SETTINGS.logoEmoji,
              logo_url: DEFAULT_SETTINGS.logoUrl || '',
              logo_zoom: DEFAULT_SETTINGS.logoZoom || 100,
              logo_y_offset: DEFAULT_SETTINGS.logoYOffset || 0,
              updated_at: new Date().toISOString()
            });

          const { data: currentDeals } = await supabase.from('deals').select('id');
          if (currentDeals && currentDeals.length > 0) {
            const ids = currentDeals.map(d => d.id);
            await supabase.from('deals').delete().in('id', ids);
          }

          for (const deal of DEFAULT_DEALS) {
            await supabase.from('deals').insert({
              title: deal.title,
              description: deal.description,
              original_price: deal.originalPrice,
              discount_price: deal.discountPrice,
              discount_percent: deal.discountPercent,
              image_url: deal.imageUrl,
              store_name: deal.storeName,
              store_logo: deal.storeLogo || '',
              link: deal.link,
              category: deal.category,
              is_hot: deal.isHot,
              coupon_code: deal.couponCode || '',
              clicks: deal.clicks,
              posted_at: deal.postedAt
            });
          }
        } catch (err) {
          console.error('Error resetting database to default settings', err);
        }
      }
      
      localStorage.removeItem('achados_settings');
      setIsAdminOpen(false);
    }
  };

  // Track simulated conversions when user clicks a CTA
  const handleJoinClick = () => {
    console.log('User converted: Joined WhatsApp Group!');
  };

  // Handle Deal Clicks to increment click counters
  const handleDealClick = async (dealId: string) => {
    // Increment clicks locally
    setDeals(prevDeals =>
      prevDeals.map(d => (d.id === dealId ? { ...d, clicks: (d.clicks || 0) + 1 } : d))
    );

    // Save to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const targetDeal = deals.find(d => d.id === dealId);
        if (targetDeal) {
          const newClicks = (targetDeal.clicks || 0) + 1;
          await supabase
            .from('deals')
            .update({ clicks: newClicks })
            .eq('id', dealId);
        }
      } catch (err) {
        console.error('Error updating click counter in Supabase', err);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-[#050d0a] text-slate-200 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Top Banner: Catchy Scrolling Alert Bar */}
      <div className="w-full bg-[#030705] py-2.5 overflow-hidden border-b border-dark-border">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-black text-white tracking-wide animate-pulse">
            <Flame className="h-4.5 w-4.5 text-emerald-400 fill-emerald-500/20" />
            <span>{settings.alertBannerText}</span>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <Header
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        showAdminButton={showAdminButton}
      />

      {/* Main Content Layout */}
      <main className="flex-1">
        
        {/* Hero Area */}
        <Hero
          settings={settings}
          onJoinClick={handleJoinClick}
        />

        {/* Informative How it works cards */}
        <HowItWorks />

        {/* Highlight Banner / Second Call To Action (Catchy & Centralized) */}
        <section className="relative bg-gradient-to-b from-[#050d0a] to-[#030705] py-20 text-white overflow-hidden border-t border-b border-[#0e1a14]">
          {/* Circular lights */}
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />
          
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-900/50 text-white shadow-lg shadow-emerald-500/5 text-xl animate-float">
              📢
            </div>
            <h2 className="mt-6 font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Pronto Para Começar a <span className="text-emerald-400">Economizar</span> Bruto?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Junte-se a mais de 15 mil brasileiros que recebem diariamente ofertas com até 80% de desconto. Você não precisa instalar nada, não precisa pagar nada. É só clicar e economizar!
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleJoinClick}
                className="animate-pulse-glow group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#25d366] to-[#128c7e] px-8 py-5 text-base font-extrabold tracking-wide text-white shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-98"
                id="btn-join-whatsapp-mid"
              >
                {/* SVG WhatsApp */}
                <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.968C16.528 1.917 14.053.89 11.432.89 5.995.89 1.572 5.311 1.568 10.745c-.001 1.638.452 3.235 1.312 4.645l-.1 1.62c-.225 1.594.52 1.45 1.4 1l1.558.94zm11.23-7.552c-.31-.155-1.838-.907-2.122-1.01-.284-.103-.49-.155-.697.155-.207.31-.802 1.01-.983 1.215-.18.207-.36.233-.67.078-.31-.155-1.309-.48-2.493-1.537-.922-.821-1.544-1.837-1.725-2.147-.18-.31-.02-.477.136-.631.14-.139.31-.362.465-.544.155-.18.207-.31.31-.517.103-.207.05-.388-.026-.543-.078-.155-.697-1.679-.955-2.303-.25-.61-.51-.525-.697-.535-.18-.01-.387-.01-.594-.01-.207 0-.543.078-.827.388-.284.31-1.086 1.062-1.086 2.587 0 1.526 1.11 2.998 1.265 3.205.155.207 2.185 3.337 5.294 4.678.74.32 1.317.51 1.768.653.743.236 1.42.203 1.954.123.595-.088 1.838-.75 2.096-1.474.258-.724.258-1.344.18-1.474-.076-.13-.283-.207-.593-.362z" />
                </svg>
                QUERO ENTRAR NO GRUPO GRATUITAMENTE
              </a>
              <span className="text-xs text-slate-500">
                🔒 Sem vírus, sem custos e sem enrolação.
              </span>
            </div>
          </div>
        </section>

        {/* Collapsible FAQ accordions */}
        <FaqSection faqs={faqs} />

      </main>

      {/* Footer disclaimer and legal guidelines */}
      <Footer settings={settings} />

      {/* Sliding dashboard settings panel for the administrator */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetAll={handleResetAll}
        deals={deals}
        onDealsChange={setDeals}
      />

    </div>
  );
}
