import type { Brand, FaultGuide, FirmwareRecord, Phone, SparePart } from '../types'
import { faultGuides } from '../data/seed'
import { brands } from '../data/brands'
import { normalize } from './utils'

export const brandOf = (name: string): Brand | undefined =>
  brands.find(b => b.name.toLowerCase() === name.toLowerCase())

export const phoneDisplayName = (p: Phone): string => {
  const brand = p.brand
  const name = p.name.trim()
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name
  if (brand === 'Apple' && name.toLowerCase().startsWith('iphone')) return `Apple ${name}`
  if (brand === 'Google' && name.toLowerCase().startsWith('pixel')) return `Google ${name}`
  return `${brand} ${name}`
}

export const phoneShortName = (p: Phone): string => {
  const brand = p.brand
  let n = p.name
  if (n.toLowerCase().startsWith(brand.toLowerCase())) n = n.slice(brand.length).trim()
  return n
}

export const ramLabel = (p: Phone) => p.ram.length ? `${p.ram.join(' / ')} GB` : '—'
export const storageLabel = (p: Phone) => p.storage.length ? `${p.storage.map(s => s >= 1024 ? `${s / 1024} TB` : `${s} GB`).join(' / ')}` : '—'
export const sizeLabel = (p: Phone) => p.displaySize ? `${p.displaySize}"` : '—'
export const batteryLabel = (p: Phone) => p.battery ? `${p.battery} mAh` : '—'
export const chargingLabel = (p: Phone) => p.charging ? `${p.charging} W` : '—'

export const specRows = (p: Phone): Array<[string, string]> => [
  ['Brand', p.brand],
  ['Series', p.series || '—'],
  ['Model number', p.modelNumber || '—'],
  ['Codename', p.codename || '—'],
  ['Release year', p.year ? String(p.year) : '—'],
  ['Chipset', p.soc || '—'],
  ['CPU', p.cpu || '—'],
  ['GPU', p.gpu || '—'],
  ['Process', p.process ? `${p.process} nm` : '—'],
  ['Display', p.displayType || '—'],
  ['Size', p.displaySize ? `${p.displaySize} inch` : '—'],
  ['Resolution', p.resolution || '—'],
  ['Refresh rate', p.refresh ? `${p.refresh} Hz` : '—'],
  ['Battery', batteryLabel(p)],
  ['Charging', chargingLabel(p)],
  ['RAM', ramLabel(p)],
  ['Storage', storageLabel(p)],
  ['OS', p.os || '—'],
  ['Rear camera', p.cameras[0] || '—'],
  ['IP rating', p.ipRating || '—'],
  ['Weight', p.weight ? `${p.weight} g` : '—'],
  ['Network', p.network || '—'],
  ['SIM', p.sim || '—'],
  ['Wi-Fi', p.wifi || '—'],
  ['Bluetooth', p.bluetooth || '—'],
  ['USB', p.usb || '—'],
]

export function faultsForPhone(phone: Phone): FaultGuide[] {
  const brand = normalize(phone.brand)
  const ranking: Record<string, string[]> = {
    apple: ['fault-battery', 'fault-camera', 'fault-overheat', 'fault-charging'],
    samsung: ['fault-screen', 'fault-battery', 'fault-bootloop', 'fault-charging'],
    xiaomi: ['fault-battery', 'fault-bootloop', 'fault-charging', 'fault-storage'],
    redmi: ['fault-battery', 'fault-charging', 'fault-storage', 'fault-touch'],
    poco: ['fault-battery', 'fault-overheat', 'fault-charging', 'fault-touch'],
    huawei: ['fault-battery', 'fault-bootloop', 'fault-camera', 'fault-charging'],
    oppo: ['fault-charging', 'fault-touch', 'fault-battery', 'fault-camera'],
    vivo: ['fault-charging', 'fault-touch', 'fault-battery', 'fault-camera'],
    realme: ['fault-charging', 'fault-battery', 'fault-touch', 'fault-storage'],
    oneplus: ['fault-battery', 'fault-overheat', 'fault-charging', 'fault-bootloop'],
    google: ['fault-battery', 'fault-overheat', 'fault-camera', 'fault-charging'],
    tecno: ['fault-charging', 'fault-battery', 'fault-touch', 'fault-storage'],
    infinix: ['fault-battery', 'fault-charging', 'fault-overheat', 'fault-storage'],
  }
  let ids = ranking[brand]
  if (!ids) {
    const seedIndex = (phone.name.length + (phone.year || 2020)) % faultGuides.length
    ids = Array.from({ length: 4 }, (_, i) => faultGuides[(seedIndex + i) % faultGuides.length].id)
  }
  // fault-screen is not in seed; replace it with screen-adjacent touch guide
  ids = ids.map(id => id === 'fault-screen' ? 'fault-touch' : id)
  const set = new Set(ids)
  return faultGuides.filter(f => set.has(f.id)).slice(0, 4)
}

export function compatibleParts(parts: SparePart[], phone: Phone): SparePart[] {
  return parts.filter(p => p.publishStatus === 'published' && (p.brands.includes(phone.brand) || p.brands.length === 0)).slice(0, 6)
}

export function firmwareForPhone(firmware: FirmwareRecord[], phone: Phone): FirmwareRecord[] {
  return firmware.filter(f => f.publishStatus === 'published' && (
    normalize(f.brand) === normalize(phone.brand) ||
    normalize(f.modelName).includes(normalize(phoneShortName(phone)))
  )).slice(0, 5)
}

export const phoneSearchFields = (p: Phone) =>
  [p.brand, p.name, p.modelNumber, p.codename, p.series, p.soc, p.year, p.os].filter(Boolean).join(' ')
