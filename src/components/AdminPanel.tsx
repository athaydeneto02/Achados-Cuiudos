import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Save, Sparkles, AlertTriangle, CheckCircle, Plus, Trash2, Edit3, Settings, Tag, ArrowLeft } from 'lucide-react';
import { AppSettings, Deal } from '../types';
import Logo from './Logo';
import { supabase, isSupabaseConfigured } from '../supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetAll: () => void;
  deals: Deal[];
  onDealsChange: (deals: Deal[]) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAll,
  deals,
  onDealsChange
}: AdminPanelProps) {
  // Navigation: 'settings' or 'deals'
  const [activeTab, setActiveTab] = useState<'settings' | 'deals'>('settings');

  // Feedback banners
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Settings Form State
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl);
  const [groupName, setGroupName] = useState(settings.groupName);
  const [memberCountLabel, setMemberCountLabel] = useState(settings.memberCountLabel);
  const [logoEmoji, setLogoEmoji] = useState(settings.logoEmoji);
  const [alertBannerText, setAlertBannerText] = useState(settings.alertBannerText);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [logoZoom, setLogoZoom] = useState(settings.logoZoom || 100);
  const [logoYOffset, setLogoYOffset] = useState(settings.logoYOffset || 0);

  // Deals management state
  const [editingDeal, setEditingDeal] = useState<Partial<Deal> | null>(null);

  // Sync state with settings when settings changes or panel opens
  useEffect(() => {
    if (isOpen) {
      setWhatsappUrl(settings.whatsappUrl);
      setGroupName(settings.groupName);
      setMemberCountLabel(settings.memberCountLabel);
      setLogoEmoji(settings.logoEmoji);
      setAlertBannerText(settings.alertBannerText);
      setLogoUrl(settings.logoUrl || '');
      setLogoZoom(settings.logoZoom || 100);
      setLogoYOffset(settings.logoYOffset || 0);
      setEditingDeal(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => {
      setErrorMsg('');
    }, 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      whatsappUrl,
      groupName,
      memberCountLabel,
      logoEmoji,
      alertBannerText,
      logoUrl,
      logoZoom,
      logoYOffset
    });
    triggerSuccess('Configurações salvas com sucesso!');
  };

  // DEAL CRUD ACTIONS
  const handleStartAddDeal = () => {
    setEditingDeal({
      title: '',
      description: '',
      originalPrice: 0,
      discountPrice: 0,
      discountPercent: 0,
      imageUrl: '',
      storeName: 'Amazon',
      link: '',
      category: 'Eletrônicos',
      isHot: false,
      couponCode: '',
      postedAt: 'Recém postado',
      clicks: 0
    });
  };

  const handleStartEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Deseja realmente excluir esta oferta?')) return;

    // Update locally
    const updated = deals.filter(d => d.id !== dealId);
    onDealsChange(updated);

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('deals')
          .delete()
          .eq('id', dealId);

        if (error) {
          console.error('Error deleting from Supabase', error);
          triggerError('Erro ao deletar do Supabase.');
        } else {
          triggerSuccess('Oferta excluída com sucesso!');
        }
      } catch (err) {
        console.error('Error deleting deal', err);
        triggerError('Falha ao conectar com o Supabase.');
      }
    } else {
      triggerSuccess('Oferta excluída localmente!');
    }
  };

  const handleSaveDealForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    // Calc discount percent
    const orig = Number(editingDeal.originalPrice || 0);
    const disc = Number(editingDeal.discountPrice || 0);
    const percent = orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

    const dealData: Omit<Deal, 'id'> & { id?: string } = {
      title: editingDeal.title || 'Sem título',
      description: editingDeal.description || '',
      originalPrice: orig,
      discountPrice: disc,
      discountPercent: percent,
      imageUrl: editingDeal.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500',
      storeName: editingDeal.storeName || 'Outra',
      storeLogo: editingDeal.storeLogo || '',
      link: editingDeal.link || '#',
      category: editingDeal.category || 'Outros',
      isHot: editingDeal.isHot || false,
      couponCode: editingDeal.couponCode || '',
      clicks: editingDeal.clicks || 0,
      postedAt: editingDeal.postedAt || 'Recém postado'
    };

    if (editingDeal.id) {
      // Edit existing
      dealData.id = editingDeal.id;

      // Update locally
      const updated = deals.map(d => d.id === editingDeal.id ? (dealData as Deal) : d);
      onDealsChange(updated);

      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from('deals')
            .update({
              title: dealData.title,
              description: dealData.description,
              original_price: dealData.originalPrice,
              discount_price: dealData.discountPrice,
              discount_percent: dealData.discountPercent,
              image_url: dealData.imageUrl,
              store_name: dealData.storeName,
              store_logo: dealData.storeLogo,
              link: dealData.link,
              category: dealData.category,
              is_hot: dealData.isHot,
              coupon_code: dealData.couponCode,
              posted_at: dealData.postedAt
            })
            .eq('id', editingDeal.id);

          if (error) {
            console.error('Error updating in Supabase', error);
            triggerError('Erro ao atualizar no Supabase.');
          } else {
            triggerSuccess('Oferta atualizada com sucesso!');
          }
        } catch (err) {
          console.error('Error updating deal', err);
        }
      } else {
        triggerSuccess('Oferta atualizada localmente!');
      }
    } else {
      // Create new
      const tempId = 'local-' + Date.now();
      const newDeal = { ...dealData, id: tempId } as Deal;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('deals')
            .insert({
              title: dealData.title,
              description: dealData.description,
              original_price: dealData.originalPrice,
              discount_price: dealData.discountPrice,
              discount_percent: dealData.discountPercent,
              image_url: dealData.imageUrl,
              store_name: dealData.storeName,
              store_logo: dealData.storeLogo,
              link: dealData.link,
              category: dealData.category,
              is_hot: dealData.isHot,
              coupon_code: dealData.couponCode,
              clicks: 0,
              posted_at: dealData.postedAt
            })
            .select();

          if (error) {
            console.error('Error inserting in Supabase', error);
            triggerError('Erro ao salvar no Supabase.');
            // Add local fallback
            onDealsChange([newDeal, ...deals]);
          } else if (data && data[0]) {
            const inserted = {
              id: data[0].id,
              title: data[0].title,
              description: data[0].description || '',
              originalPrice: Number(data[0].original_price),
              discountPrice: Number(data[0].discount_price),
              discountPercent: Number(data[0].discount_percent),
              imageUrl: data[0].image_url,
              storeName: data[0].store_name,
              storeLogo: data[0].store_logo || '',
              link: data[0].link,
              category: data[0].category,
              isHot: data[0].is_hot,
              couponCode: data[0].coupon_code || '',
              clicks: Number(data[0].clicks || 0),
              postedAt: data[0].posted_at
            };
            onDealsChange([inserted, ...deals]);
            triggerSuccess('Oferta criada com sucesso!');
          }
        } catch (err) {
          console.error('Error inserting deal', err);
          onDealsChange([newDeal, ...deals]);
        }
      } else {
        onDealsChange([newDeal, ...deals]);
        triggerSuccess('Oferta criada localmente!');
      }
    }

    setEditingDeal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4">
      
      {/* Sliding Sheet Panel */}
      <div className="relative flex h-full w-full max-w-lg flex-col rounded-3xl bg-[#0a140f] border border-dark-border shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border bg-dark-card px-6 py-4.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="font-display text-lg font-black text-white">
              Painel do Proprietário
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#12281c] hover:text-white transition-colors"
            id="btn-close-admin"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-dark-border bg-dark-card px-6">
          <button
            onClick={() => { setActiveTab('settings'); setEditingDeal(null); }}
            className={`flex items-center gap-2 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </button>
          <button
            onClick={() => { setActiveTab('deals'); setEditingDeal(null); }}
            className={`ml-6 flex items-center gap-2 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'deals'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="h-4 w-4" />
            Ofertas ({deals.length})
          </button>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="bg-emerald-900/80 border-b border-emerald-800 text-emerald-100 px-6 py-3 text-xs font-bold flex items-center gap-2 animate-pulse shrink-0">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-950/80 border-b border-rose-900 text-rose-100 px-6 py-3 text-xs font-bold flex items-center gap-2 animate-pulse shrink-0">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form/List Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Quick Notice */}
              <div className="rounded-2xl bg-amber-950/20 p-4 border border-amber-900/30 text-xs text-amber-400 flex gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">
                    {isSupabaseConfigured ? 'Conectado ao Supabase 🌐' : 'Modo de Configuração Local 💻'}
                  </p>
                  <p className="mt-0.5 text-slate-300">
                    {isSupabaseConfigured
                      ? 'As alterações feitas abaixo serão salvas globalmente e aplicadas instantaneamente para todos os visitantes do site.'
                      : 'As alterações feitas aqui ficam salvas apenas no seu navegador atual (localStorage). Excelente para testar e personalizar!'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-black uppercase tracking-wider text-emerald-400 border-b border-dark-border pb-2">
                  Configurações Gerais do Aplicativo
                </h4>
                <form onSubmit={handleSaveSettings} className="mt-4 space-y-5">
                  
                  {/* WhatsApp Link */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                      Link de Convite do WhatsApp (Real)
                    </label>
                    <input
                      type="url"
                      required
                      value={whatsappUrl}
                      onChange={(e) => setWhatsappUrl(e.target.value)}
                      placeholder="https://chat.whatsapp.com/invite/..."
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Grid 2 Columns */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Group Name */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                        Nome do Grupo
                      </label>
                      <input
                        type="text"
                        required
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Emoji Logo */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                        Logo Emoji
                      </label>
                      <input
                        type="text"
                        required
                        value={logoEmoji}
                        onChange={(e) => setLogoEmoji(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-center text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Logo Custom Image */}
                  <div className="rounded-2xl border border-dark-border bg-dark-card/50 p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 rounded-full overflow-hidden bg-[#0a140f]">
                        <Logo size={60} customImageUrl={logoUrl} logoZoom={logoZoom} logoYOffset={logoYOffset} />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wide">
                          Foto do Logo do Site
                        </label>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Troque a foto central do site. Faça upload ou cole um link.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1.5">
                          Upload de Foto (.png, .jpg, .webp)
                        </span>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-800/30 bg-emerald-950/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-950/20 hover:text-emerald-300 transition-all">
                          <span>Selecionar foto do computador...</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setLogoUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-dark-border"></div>
                        <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-600 uppercase">ou</span>
                        <div className="flex-grow border-t border-dark-border"></div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1.5">
                          Link da Imagem (URL)
                        </span>
                        <input
                          type="url"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="https://exemplo.com/foto.png"
                          className="w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                        />
                      </div>

                      {logoUrl && (
                        <div className="space-y-4 pt-3 border-t border-dark-border/40">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                Zoom da Imagem ({logoZoom}%)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="100"
                              max="300"
                              value={logoZoom}
                              onChange={(e) => setLogoZoom(Number(e.target.value))}
                              className="w-full accent-emerald-500 bg-[#070e0a] h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                Ajuste Vertical (Y): {logoYOffset}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-50"
                              max="50"
                              value={logoYOffset}
                              onChange={(e) => setLogoYOffset(Number(e.target.value))}
                              className="w-full accent-emerald-500 bg-[#070e0a] h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="pt-1 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setLogoUrl('');
                                setLogoZoom(100);
                                setLogoYOffset(0);
                              }}
                              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              Remover foto personalizada
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Members Label */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                      Rótulo de Membros (Badge do Topo)
                    </label>
                    <input
                      type="text"
                      required
                      value={memberCountLabel}
                      onChange={(e) => setMemberCountLabel(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Alert Banner Text */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                      Texto da Barra de Alerta (Topo)
                    </label>
                    <input
                      type="text"
                      required
                      value={alertBannerText}
                      onChange={(e) => setAlertBannerText(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Save Settings CTA */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-xs font-black tracking-wider text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
                    id="btn-save-basic-settings"
                  >
                    <Save className="h-4 w-4" />
                    SALVAR CONFIGURAÇÕES DO GRUPO
                  </button>

                </form>
              </div>

              {/* Reset section */}
              <div className="pt-4 border-t border-dark-border">
                <button
                  onClick={onResetAll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-rose-900/30 bg-rose-950/10 py-3 text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer"
                  id="btn-reset-defaults"
                >
                  <RotateCcw className="h-4 w-4" />
                  RESTAURAR TODOS OS DADOS DE FÁBRICA
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DEALS */}
          {activeTab === 'deals' && (
            <div className="space-y-6">
              
              {/* If NOT editing, show list of deals */}
              {!editingDeal ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-xs font-black uppercase tracking-wider text-emerald-400">
                      Lista de Achados Cadastrados
                    </h4>
                    <button
                      onClick={handleStartAddDeal}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-950 border border-emerald-900/40 hover:bg-emerald-900/40 px-3.5 py-2 text-xs font-black text-emerald-400 cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      CRIAR OFERTA
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-3.5 bg-dark-card rounded-2xl border border-dark-border hover:border-emerald-900/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden pr-2">
                            <img
                              src={deal.imageUrl}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover bg-emerald-950/20 shrink-0"
                            />
                            <div className="overflow-hidden">
                              <h5 className="text-xs font-bold text-white truncate leading-snug">
                                {deal.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {deal.storeName} • {deal.category} • {deal.clicks || 0} clicks
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleStartEditDeal(deal)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 border border-transparent hover:border-emerald-900/20 transition-all cursor-pointer"
                              title="Editar Oferta"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/20 transition-all cursor-pointer"
                              title="Excluir Oferta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 rounded-2xl border border-dashed border-dark-border text-xs text-slate-500">
                        Nenhuma oferta cadastrada. Clique em "CRIAR OFERTA" para começar.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Deal Edit/Create Form */
                <form onSubmit={handleSaveDealForm} className="space-y-5 animate-fade-in">
                  
                  <div className="flex items-center gap-2 border-b border-dark-border pb-3">
                    <button
                      type="button"
                      onClick={() => setEditingDeal(null)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h4 className="font-display text-xs font-black uppercase tracking-wider text-emerald-400">
                      {editingDeal.id ? 'Editar Oferta' : 'Criar Nova Oferta'}
                    </h4>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                      Título da Oferta *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingDeal.title || ''}
                      onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                      placeholder="Ex: Smart TV 50' Crystal UHD 4K Samsung"
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                      Descrição/Resumo
                    </label>
                    <textarea
                      value={editingDeal.description || ''}
                      onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                      placeholder="Ex: Com comando de voz, assistente virtual integrada e o design de tela mais fino..."
                      rows={2}
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Grid: Prices */}
                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Preço Original (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingDeal.originalPrice || ''}
                        onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: Number(e.target.value) })}
                        placeholder="Ex: 2899"
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Preço com Desconto (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingDeal.discountPrice || ''}
                        onChange={(e) => setEditingDeal({ ...editingDeal, discountPrice: Number(e.target.value) })}
                        placeholder="Ex: 1989"
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Grid: Store & Category */}
                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Nome da Loja *
                      </label>
                      <select
                        value={editingDeal.storeName || 'Amazon'}
                        onChange={(e) => setEditingDeal({ ...editingDeal, storeName: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      >
                        <option value="Amazon">Amazon</option>
                        <option value="Mercado Livre">Mercado Livre</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Magalu">Magalu</option>
                        <option value="Casas Bahia">Casas Bahia</option>
                        <option value="AliExpress">AliExpress</option>
                        <option value="Outra">Outra Loja</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Categoria *
                      </label>
                      <select
                        value={editingDeal.category || 'Eletrônicos'}
                        onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      >
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Casa & Cozinha">Casa & Cozinha</option>
                        <option value="Celulares">Celulares</option>
                        <option value="Áudio">Áudio</option>
                        <option value="Moda & Calçados">Moda & Calçados</option>
                        <option value="Games">Games</option>
                        <option value="Informática">Informática</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Deal Link */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                      Link da Oferta (URL de Afiliado ou Oficial) *
                    </label>
                    <input
                      type="url"
                      required
                      value={editingDeal.link || ''}
                      onChange={(e) => setEditingDeal({ ...editingDeal, link: e.target.value })}
                      placeholder="https://amzn.to/..."
                      className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Image Selector Option (Upload to local base64 or link) */}
                  <div className="rounded-2xl border border-dark-border bg-dark-card/50 p-4 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                        Imagem do Produto *
                      </span>
                    </div>

                    {editingDeal.imageUrl && (
                      <img
                        src={editingDeal.imageUrl}
                        alt=""
                        className="h-24 w-full object-cover rounded-xl bg-emerald-950/20"
                      />
                    )}

                    <div className="grid gap-2">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-800/30 bg-emerald-950/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-950/20 transition-all">
                        <span>Selecionar foto do produto...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setEditingDeal({ ...editingDeal, imageUrl: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <div className="text-center text-[9px] font-bold text-slate-600 uppercase">ou cole o link da imagem</div>

                      <input
                        type="url"
                        value={editingDeal.imageUrl || ''}
                        onChange={(e) => setEditingDeal({ ...editingDeal, imageUrl: e.target.value })}
                        placeholder="https://exemplo.com/produto-foto.jpg"
                        className="w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Grid: Coupon Code, Posted At & Is Hot */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Cupom de Desconto (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editingDeal.couponCode || ''}
                        onChange={(e) => setEditingDeal({ ...editingDeal, couponCode: e.target.value })}
                        placeholder="Ex: TV100"
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                        Tempo Postado Label
                      </label>
                      <input
                        type="text"
                        value={editingDeal.postedAt || ''}
                        onChange={(e) => setEditingDeal({ ...editingDeal, postedAt: e.target.value })}
                        placeholder="Ex: Há 10 min, Há 2 horas"
                        className="mt-1.5 w-full rounded-xl border border-dark-border bg-dark-card px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 py-1">
                    <input
                      type="checkbox"
                      id="isHotCheckbox"
                      checked={editingDeal.isHot || false}
                      onChange={(e) => setEditingDeal({ ...editingDeal, isHot: e.target.checked })}
                      className="h-4.5 w-4.5 accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="isHotCheckbox" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                      Marcar como oferta SUPER QUENTE (Badge especial)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingDeal(null)}
                      className="flex-1 rounded-xl border border-dark-border bg-dark-card/50 hover:bg-dark-card hover:text-white py-3 text-xs font-extrabold text-slate-400 tracking-wider transition-all cursor-pointer text-center"
                    >
                      CANCELAR
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-xs font-black text-white tracking-wider cursor-pointer transition-colors shadow-lg shadow-emerald-950/40"
                    >
                      <Save className="h-4 w-4" />
                      SALVAR OFERTA
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
