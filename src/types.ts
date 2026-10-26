export type Lang = 'ar' | 'en'
export type Theme = 'dark' | 'light'
export type Currency = 'YER' | 'SAR' | 'USD'
export type PublishStatus = 'published' | 'pending' | 'draft' | 'archived'

export interface Brand {
  id: string
  name: string
  nameAr: string
  website: string
  accent: string
  series: string[]
}

export interface Phone {
  id: string
  slug: string
  name: string
  nameAr?: string
  brand: string
  series: string
  collection?: string
  modelNumber: string
  codename: string
  year: number | null
  soc: string
  cpu?: string
  gpu?: string
  process?: number | string
  displayType: string
  displaySize: number | string
  resolution: string
  refresh: number | string
  ppi?: number | string
  battery: number | string
  charging: number | string
  ram: number[]
  storage: number[]
  os: string
  network: string
  sim: string
  wifi: string
  bluetooth: string
  usb: string
  ipRating: string
  weight: number | string
  cameras: string[]
  image: string
  sources: string[]
  sourceBrand: string
  verified: boolean
  verification?: 'dataset' | 'auto' | 'manual'
  releaseDate: string
  updatedAt: string
  publishStatus: PublishStatus
  softwareNotes?: string
  commonFaults?: string[]
  repairNotes?: string
}

export type ScreenQuality = 'original' | 'service-pack' | 'commercial' | 'refurbished' | 'used'
export type Availability = 'in-stock' | 'limited' | 'on-request' | 'out-of-stock'

export interface ScreenPrice {
  id: string
  phoneId: string
  phoneName: string
  brand: string
  modelNumber: string
  displayType: string
  quality: ScreenQuality
  price: number | null
  currency: Currency
  city: string
  supplier: string
  updatedAt: string
  availability: Availability
  installPrice: number | null
  status: 'verified' | 'review' | 'on-request'
  publishStatus: PublishStatus
  notes?: string
}

export interface SparePart {
  id: string
  name: string
  nameEn: string
  category: string
  brands: string[]
  quality: string
  price: number | null
  currency: Currency
  city: string
  supplier: string
  availability: Availability
  updatedAt: string
  status: 'verified' | 'review' | 'on-request'
  publishStatus: PublishStatus
  notes?: string
}

export interface Supplier {
  id: string
  name: string
  city: string
  phone: string
  whatsapp: string
  specialties: string[]
  verified: boolean
  notes?: string
}

export type FirmwareStatus = 'verified' | 'review' | 'portal'

export interface FirmwareRecord {
  id: string
  brand: string
  modelName: string
  modelNumber: string
  region: string
  version: string
  androidVersion: string
  fileType: string
  size: string
  downloadUrl: string
  sourceName: string
  sourceUrl: string
  updatedAt: string
  verified: boolean
  status: FirmwareStatus
  publishStatus: PublishStatus
  notes?: string
  fileId?: string
}

export type ArticleCategory = 'tutorial' | 'fault' | 'security' | 'news'

export interface ArticleSection {
  heading: string
  headingEn?: string
  paragraphs: string[]
  paragraphsEn?: string[]
  list?: string[]
}

export interface Article {
  id: string
  slug: string
  category: ArticleCategory
  titleAr: string
  titleEn: string
  excerptAr: string
  excerptEn: string
  body: ArticleSection[]
  tags: string[]
  readMinutes: number
  date: string
  featured: boolean
  publishStatus: PublishStatus
  cover?: string
  sources?: string[]
}

export interface FaultGuide {
  id: string
  titleAr: string
  titleEn: string
  deviceType: string
  symptoms: string[]
  causes: string[]
  steps: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  risk: 'low' | 'medium' | 'high'
  tools: string[]
}

export interface ServiceItem {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: string
  duration: string
  featuresAr: string[]
  featuresEn: string[]
}

export interface ToolItem {
  id: string
  name: string
  category: 'software' | 'hardware' | 'diagnostic' | 'security'
  descAr: string
  descEn: string
  platform: string
  risk: 'low' | 'medium' | 'high'
  url: string
  sourceName: string
}

export type RequestStatus = 'new' | 'review' | 'in-progress' | 'waiting-parts' | 'done' | 'cancelled'

export interface MaintenanceRequest {
  id: string
  ticket: string
  name: string
  phone: string
  city: string
  brand: string
  model: string
  serviceType: string
  description: string
  contactMethod: string
  status: RequestStatus
  priority: 'normal' | 'urgent'
  createdAt: string
  updatedAt: string
  notes?: string
  consent: boolean
}

export interface Settings {
  id: 'app'
  whatsapp: string
  displayName: string
  rates: Record<Currency, number>
  ratesUpdatedAt: string
  adminPinHash?: string
  adminSalt?: string
  seedVersion: number
  maintenanceMode: boolean
}

export interface AuditEntry {
  id: string
  action: string
  entity: string
  entityId: string
  at: string
  note?: string
}

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  blob: Blob
  createdAt: string
}

export interface AppData {
  phones: Phone[]
  screenPrices: ScreenPrice[]
  spareParts: SparePart[]
  suppliers: Supplier[]
  firmware: FirmwareRecord[]
  articles: Article[]
  requests: MaintenanceRequest[]
  settings: Settings
  audit: AuditEntry[]
}

export interface SearchHit {
  id: string
  type: 'phone' | 'price' | 'part' | 'firmware' | 'article' | 'fault'
  title: string
  subtitle: string
  path: string
  badge?: string
  score: number
}
