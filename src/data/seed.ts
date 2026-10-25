import type { Database, Part, ScreenPrice, Settings, Supplier } from '../types'
import { ARTICLES } from './articles'
import { FIRMWARE } from './firmware'
import { TOOLS } from './tools'

export const SEED_DATE = '2026-10-01'

export const DEFAULT_SETTINGS: Settings = {
  adminPasswordHash: '',
  rates: { YER: 530, SAR: 3.75, USD: 1 },
  ratesUpdatedAt: '2026-10-01',
  defaultCity: 'صنعاء',
  whatsapp: '+967777066424',
  phone: '+967777066424',
  siteName: 'Brxvih',
  adminName: 'يوسف الهدار',
  brandName: 'WHITE BLACK',
  location: 'اليمن',
  showReferencePrices: true,
}

const supplierApple: Supplier = {
  id: 'sup-apple-official',
  name: 'Apple Official Repair',
  city: 'الولايات المتحدة (مرجع رسمي)',
  verified: true,
  notes: 'أسعار خدمة الإصلاح الرسمية من Apple US. السعر النهائي يعتمد على الفرع والضرائب.',
  createdAt: '2026-09-01',
}

const applePrice = (
  id: string,
  phoneName: string,
  modelNumber: string,
  price: number,
): ScreenPrice => ({
  id,
  phoneId: phoneName.toLowerCase().replace(/^iphone /, 'iphone-'),
  phoneName,
  modelNumber,
  brand: 'Apple',
  quality: 'original',
  price,
  currency: 'USD',
  city: 'الولايات المتحدة (مرجع رسمي)',
  supplierId: supplierApple.id,
  supplierName: supplierApple.name,
  updatedAt: '2026-09-15',
  availability: 'on-order',
  installationFee: 0,
  installationCurrency: 'USD',
  sourceUrl: 'https://support.apple.com/iphone/repair/screen-damage',
  verification: 'reference',
  notes: 'سعر رسمي مرجعي لاستبدال الشاشة عبر Apple US، شامل التركيب. قد يتغير السعر بحسب الدولة والضرائب. لا يمثل سعر السوق اليمني.',
  status: 'published',
  createdAt: '2026-09-15',
})

export const SEED_SUPPLIERS: Supplier[] = [supplierApple]

export const SEED_SCREEN_PRICES: ScreenPrice[] = [
  applePrice('price-ip16pm', 'iPhone 16 Pro Max', 'A3293', 379),
  applePrice('price-ip16p', 'iPhone 16 Pro', 'A3293', 329),
  applePrice('price-ip16plus', 'iPhone 16 Plus', 'A3286', 329),
  applePrice('price-ip16', 'iPhone 16', 'A3286', 279),
  applePrice('price-ip15pm', 'iPhone 15 Pro Max', 'A2849', 379),
  applePrice('price-ip15p', 'iPhone 15 Pro', 'A2848', 329),
  applePrice('price-ip15', 'iPhone 15', 'A3089', 279),
  applePrice('price-ip14', 'iPhone 14', 'A2882', 279),
]

const part = (
  id: string,
  name: string,
  category: string,
  brand: string,
  compatibleModels: string,
  quality: string,
  city: string,
): Part => ({
  id,
  name,
  category,
  brand,
  compatibleModels,
  quality,
  price: 0,
  currency: 'YER',
  city,
  supplierName: '',
  availability: 'on-order',
  updatedAt: '2026-10-01',
  notes: 'السعر عند الطلب. أضف السعر من لوحة التحكم بعد تأكيد المورد والتوفر.',
  status: 'published',
  createdAt: '2026-10-01',
})

export const SEED_PARTS: Part[] = [
  part('part-screen-a54', 'شاشة AMOLED مع إطار', 'شاشة', 'Samsung', 'Galaxy A54 5G — SM-A546B', 'Service Pack / متوافقة', 'صنعاء'),
  part('part-battery-rn13', 'بطارية أصلية', 'بطارية', 'Redmi', 'Redmi Note 13 4G', 'أصلية', 'صنعاء'),
  part('part-port-ip13', 'فليكس منفذ شحن', 'منفذ شحن', 'Apple', 'iPhone 13 — حسب المنطقة', 'جودة عالية', 'عدن'),
  part('part-back-glassy', 'غطاء خلفي زجاجي', 'غطاء خلفي', 'Xiaomi', 'Xiaomi 13 / 13 Pro', 'متوافقة', 'صنعاء'),
  part('part-camera-glass-s23', 'زجاج كاميرا خلفية', 'زجاج كاميرا', 'Samsung', 'Galaxy S23 / S23+', 'متوافقة', 'تعز'),
  part('part-charge-flex-a15', 'فليكس شحن + ميكروفون', 'منفذ شحن', 'Samsung', 'Galaxy A15 / A05', 'متوافقة', 'صنعاء'),
  part('part-battery-camon20', 'بطارية 5000mAh', 'بطارية', 'TECNO', 'Camon 20 / Spark 10', 'جودة عالية', 'الحديدة'),
  part('part-screen-redmagic', 'شاشة AMOLED 165Hz', 'شاشة', 'Nubia', 'RedMagic 9 Pro', 'أصلية', 'عبر الطلب'),
]

export function createSeedDatabase(): Database {
  return {
    version: 1,
    settings: DEFAULT_SETTINGS,
    customPhones: [],
    phoneOverrides: {},
    hiddenPhoneIds: [],
    screenPrices: SEED_SCREEN_PRICES,
    parts: SEED_PARTS,
    suppliers: SEED_SUPPLIERS,
    firmware: FIRMWARE,
    tools: TOOLS,
    articles: ARTICLES,
    repairRequests: [],
    messages: [],
    priceRequests: [],
    uploads: [],
    auditLog: [],
  }
}

export const SEED_REPAIR_REQUESTS = [
  {
    id: 'demo-request',
    ticket: 'BRX-DEMO',
    name: 'طلب تجريبي',
    phone: '+967777066424',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy A54',
    issue: 'الشاشة تعمل لكن اللمس لا يستجيب في المنطقة السفلية.',
    city: 'صنعاء',
    contact: '+967777066424',
    urgency: 'normal' as const,
    notes: 'هذا طلب توضيحي يمكنك حذفه من لوحة التحكم.',
    status: 'new' as const,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
]
