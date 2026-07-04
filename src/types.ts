export interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  imageUrl: string;
  storeName: string;
  storeLogo?: string;
  link: string;
  category: string;
  isHot?: boolean;
  couponCode?: string;
  postedAt: string;
  clicks: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AppSettings {
  whatsappUrl: string;
  groupName: string;
  memberCountLabel: string;
  alertBannerText: string;
  logoEmoji: string;
  logoUrl?: string;
  logoZoom?: number;
  logoYOffset?: number;
}
