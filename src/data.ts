import { Deal, FAQItem, AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappUrl: 'https://chat.whatsapp.com/invite/CuiudoAchadosOficial',
  groupName: 'Achados do Cuiudo',
  memberCountLabel: '+15.400 membros economizando',
  alertBannerText: '🔥 ATENÇÃO: Os estoques das promoções acabam muito rápido! Entre no grupo para receber primeiro.',
  logoEmoji: '🐗',
  logoUrl: '',
  logoZoom: 100,
  logoYOffset: 0
};

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Quanto custa para participar do grupo?',
    answer: 'Nada! O grupo "Achados do Cuiudo" é 100% gratuito. Você nunca vai pagar mensalidade ou taxa para ver as promoções e usar os cupons.'
  },
  {
    id: 'faq-2',
    question: 'Como os links são enviados?',
    answer: 'Nós pesquisamos as ofertas 24 horas por dia nas maiores plataformas (Amazon, Shopee, Mercado Livre, Magalu) e enviamos o link direto da loja direto no WhatsApp para você apenas clicar e comprar.'
  },
  {
    id: 'faq-3',
    question: 'Os links de promoção são seguros?',
    answer: 'Sim, absolutamente! Todos os links de ofertas que enviamos passam por uma curadoria humana rigorosa. Nós só divulgamos links oficiais de lojas conhecidas e seguras, evitando qualquer site falso ou golpe.'
  },
  {
    id: 'faq-4',
    question: 'Por que algumas promoções expiram tão rápido?',
    answer: 'As lojas mudam os preços de acordo com a demanda e o estoque disponível. Promoções de "bug de sistema" ou "cupons relâmpago" duram apenas poucos minutos. Por isso é crucial ficar de olho nas notificações do grupo!'
  },
  {
    id: 'faq-5',
    question: 'Como faço para não perder nenhuma oferta?',
    answer: 'Após entrar no grupo pelo nosso botão centralizado, mude as configurações do grupo no WhatsApp para "Ativar notificações" e, se possível, fixe o grupo no topo de suas conversas para ver os alertas imediatamente.'
  }
];

export const DEFAULT_DEALS: Deal[] = [
  {
    id: 'deal-1',
    title: 'Smart TV 50" Crystal UHD 4K Samsung CU8000',
    description: 'Com comando de voz, assistente virtual integrada e o design de tela infinita mais fino da categoria.',
    originalPrice: 2899.00,
    discountPrice: 1989.00,
    discountPercent: 31,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60',
    storeName: 'Mercado Livre',
    link: '#',
    category: 'Eletrônicos',
    isHot: true,
    couponCode: 'TV100ML',
    postedAt: 'Há 5 min',
    clicks: 342
  },
  {
    id: 'deal-2',
    title: 'Fritadeira Elétrica Airfryer Mondial Family 4L',
    description: 'Cesto antiaderente, controle de temperatura até 200°C e timer de 60 minutos. A mais vendida do Brasil!',
    originalPrice: 459.90,
    discountPrice: 269.10,
    discountPercent: 41,
    imageUrl: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=60',
    storeName: 'Amazon',
    link: '#',
    category: 'Casa & Cozinha',
    isHot: false,
    postedAt: 'Há 18 min',
    clicks: 189
  },
  {
    id: 'deal-3',
    title: 'Fone de Ouvido Bluetooth JBL Tune 520BT Bass',
    description: 'Até 57 horas de bateria pura, som JBL Pure Bass lendário e carregamento rápido de 5 minutos.',
    originalPrice: 329.00,
    discountPrice: 199.00,
    discountPercent: 39,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    storeName: 'Magalu',
    link: '#',
    category: 'Áudio',
    isHot: true,
    couponCode: 'JBL40',
    postedAt: 'Há 32 min',
    clicks: 512
  },
  {
    id: 'deal-4',
    title: 'Smartphone Motorola Moto G54 5G 256GB / 8GB RAM',
    description: 'Câmera de 50MP com OIS, tela de 120Hz super fluida e bateria gigante de 5000 mAh.',
    originalPrice: 1699.00,
    discountPrice: 999.00,
    discountPercent: 41,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    storeName: 'Shopee',
    link: '#',
    category: 'Celulares',
    isHot: true,
    couponCode: 'G54BLACK',
    postedAt: 'Há 1 hora',
    clicks: 673
  },
  {
    id: 'deal-5',
    title: 'Cafeteira Expresso Nescafé Dolce Gusto Genio S Basic',
    description: 'Cafeteira multibebidas automática com controle de volume touch, prepare cappuccinos e chás gelados.',
    originalPrice: 620.00,
    discountPrice: 429.00,
    discountPercent: 30,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&auto=format&fit=crop&q=60',
    storeName: 'Amazon',
    link: '#',
    category: 'Casa & Cozinha',
    isHot: false,
    postedAt: 'Há 2 horas',
    clicks: 124
  },
  {
    id: 'deal-6',
    title: 'Tênis Running Masculino Nike Downshifter 12',
    description: 'Leve, resistente, com amortecimento macio perfeito para corridas diárias, caminhadas e academia.',
    originalPrice: 399.90,
    discountPrice: 249.90,
    discountPercent: 37,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    storeName: 'Mercado Livre',
    link: '#',
    category: 'Moda & Calçados',
    isHot: false,
    postedAt: 'Há 3 horas',
    clicks: 295
  }
];
