export type Lang = 'ar' | 'en'
export type Theme = 'dark' | 'light'
export type Currency = 'YER' | 'SAR' | 'USD'
export type Availability = 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-order'
export type PriceQuality =
  | 'original'
  | 'service-pack'
  | 'oled-compatible'
  | 'incell'
  | 'tft'
  | 'refurbished'
  | 'used'
export type Verification = 'verified' | 'reference' | 'pending' | 'unverified'
export type PublishStatus = 'published' | 'draft' | 'review'

export interface Source {
  label: string
  url: string
}

export interface Fault {
  title: string
  symptom?: string
  fix?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface RomFile {
  name: string
  version?: string
  region?: string
  size?: string
  date?: string
  tool?: string
  sourceUrl?: string
  sourceType?: 'official' | 'community'
}

export interface PartRef {
  name: string
  category?: string
  note?: string
}

export interface Phone {
  id: string
  slug: string
  name: string
  brand: string
  series: string
  modelNumbers: string[]
  codename: string
  releaseYear: number | null
  status?: string
  chipset: string
  cpu: string
  gpu: string
  displayType: string
  displaySize: string
  displayResolution: string
  displayProtection: string
  battery: string
  charging: string
  memory: string
  storage: string
  os: string
  dimensions: string
  weight: string
  sim: string
  usb: string
  sensors: string
  image: string
  colors: string
  launchPrice: string
  network5g?: boolean
  sourceUrl: string
  specSource: string
  sourceSnapshot: string
  dataQuality: string
  faults: Fault[]
  roms: RomFile[]
  parts: PartRef[]
  searchText?: string
}

export interface BrandMeta {
  id: string
  name: string
  nameAr: string
  series: string[]
  accent: string
  faults: Fault[]
  firmwarePortal: Source
  supportPortal: Source
  flashTools: string[]
  notes?: string
}

export interface Supplier {
  id: string
  name: string
  city: string
  phone?: string
  verified: boolean
  notes?: string
  createdAt: string
}

export interface ScreenPrice {
  id: string
  phoneId?: string
  phoneName: string
  modelNumber?: string
  brand: string
  quality: PriceQuality
  price: number
  currency: Currency
  city: string
  supplierId?: string
  supplierName?: string
  updatedAt: string
  availability: Availability
  installationFee: number
  installationCurrency: Currency
  sourceUrl?: string
  verification: Verification
  notes?: string
  status: PublishStatus
  createdAt: string
}

export interface Part {
  id: string
  name: string
  category: string
  brand: string
  compatibleModels: string
  quality: string
  price: number
  currency: Currency
  city: string
  supplierName?: string
  availability: Availability
  updatedAt: string
  notes?: string
  sourceUrl?: string
  status: PublishStatus
  createdAt: string
}

export interface Firmware {
  id: string
  brand: string
  model: string
  modelNumber?: string
  version: string
  region: string
  androidVersion?: string
  size?: string
  tool: string
  sourceUrl: string
  sourceType: 'official' | 'community'
  updatedAt: string
  notes?: string
  status: PublishStatus
  createdAt: string
}

export interface Tool {
  id: string
  name: string
  category: string
  platform: string
  purpose: string
  officialUrl: string
  sourceType: 'official' | 'community'
  risk: 'low' | 'medium' | 'high'
  notes?: string
  createdAt?: string
}

export interface ArticleSection {
  heading?: string
  paragraphs?: string[]
  bullets?: string[]
  note?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  titleEn?: string
  category: 'security' | 'tutorial' | 'fault' | 'firmware'
  excerpt: string
  excerptEn?: string
  content: ArticleSection[]
  tags: string[]
  readingMinutes: number
  publishedAt: string
  updatedAt: string
  status: PublishStatus
  featured?: boolean
  author?: string
}

export interface RepairRequest {
  id: string
  ticket: string
  name: string
  phone: string
  deviceBrand?: string
  deviceModel?: string
  issue: string
  city: string
  contact: string
  urgency: 'normal' | 'urgent' | 'emergency'
  notes?: string
  status: 'new' | 'contacted' | 'in-progress' | 'done' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  name: string
  contact: string
  subject: string
  body: string
  read: boolean
  createdAt: string
}

export interface PriceRequest {
  id: string
  phoneName: string
  modelNumber?: string
  quality?: string
  city: string
  name: string
  contact: string
  notes?: string
  status: 'new' | 'quoted' | 'closed'
  createdAt: string
}

export interface Upload {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
  createdAt: string
}

export interface AuditEntry {
  id: string
  action: string
  entity: string
  detail: string
  at: string
}

export interface Settings {
  adminPasswordHash: string
  rates: Record<Currency, number>
  ratesUpdatedAt: string
  defaultCity: string
  whatsapp: string
  phone: string
  siteName: string
  adminName: string
  brandName: string
  location: string
  showReferencePrices: boolean
}

export interface Database {
  version: number
  settings: Settings
  customPhones: Phone[]
  phoneOverrides: Record<string, Partial<Phone>>
  hiddenPhoneIds: string[]
  screenPrices: ScreenPrice[]
  parts: Part[]
  suppliers: Supplier[]
  firmware: Firmware[]
  tools: Tool[]
  articles: Article[]
  repairRequests: RepairRequest[]
  messages: Message[]
  priceRequests: PriceRequest[]
  uploads: Upload[]
  auditLog: AuditEntry[]
}

export type CollectionKey =
  | 'customPhones'
  | 'screenPrices'
  | 'parts'
  | 'suppliers'
  | 'firmware'
  | 'articles'
  | 'repairRequests'
  | 'messages'
  | 'priceRequests'
  | 'uploads'
  | 'auditLog'
