import type { Brand } from '../types'

export const brands: Brand[] = [
  { id: 'Samsung', name: 'Samsung', nameAr: 'سامسونج', website: 'https://www.samsung.com/ae/', accent: '#1428a0', series: ['Galaxy S', 'Galaxy Z', 'Galaxy A', 'Galaxy M'] },
  { id: 'Redmi', name: 'Redmi', nameAr: 'ريدمي', website: 'https://www.mi.com/global/', accent: '#ff6900', series: ['Redmi Note', 'Redmi Number'] },
  { id: 'Xiaomi', name: 'Xiaomi', nameAr: 'شاومي', website: 'https://www.mi.com/global/', accent: '#ff6900', series: ['Xiaomi Series'] },
  { id: 'POCO', name: 'POCO', nameAr: 'بوكو', website: 'https://www.poco.net/global/', accent: '#f7c600', series: ['POCO X', 'POCO F', 'POCO M/C'] },
  { id: 'Huawei', name: 'Huawei', nameAr: 'هواوي', website: 'https://consumer.huawei.com/en/', accent: '#cf0a2c', series: ['P Series', 'Mate Series', 'Nova/Y'] },
  { id: 'Honor', name: 'Honor', nameAr: 'هونر', website: 'https://www.honor.com/global/', accent: '#0aa8e8', series: ['Magic', 'Honor Number', 'Honor X'] },
  { id: 'OPPO', name: 'OPPO', nameAr: 'أوبو', website: 'https://www.oppo.com/en/', accent: '#1a9e57', series: ['Find', 'Reno', 'A Series'] },
  { id: 'vivo', name: 'vivo', nameAr: 'فيفو', website: 'https://www.vivo.com/en/', accent: '#415fff', series: ['X Series', 'V Series', 'Y Series'] },
  { id: 'realme', name: 'realme', nameAr: 'ريلمي', website: 'https://www.realme.com/global/', accent: '#ffc915', series: ['GT', 'Number Series', 'C Series'] },
  { id: 'OnePlus', name: 'OnePlus', nameAr: 'ون بلس', website: 'https://www.oneplus.com/', accent: '#eb0028', series: ['Flagship', 'Nord'] },
  { id: 'Apple', name: 'Apple', nameAr: 'آبل', website: 'https://www.apple.com/iphone/', accent: '#9aa0a6', series: ['iPhone'] },
  { id: 'TECNO', name: 'TECNO', nameAr: 'تكنو', website: 'https://www.tecno-mobile.com/', accent: '#0057b8', series: ['Camon', 'Spark/Pova'] },
  { id: 'Infinix', name: 'Infinix', nameAr: 'إنفينكس', website: 'https://www.infinixmobility.com/', accent: '#00a651', series: ['Note', 'Hot/Zero'] },
  { id: 'itel', name: 'itel', nameAr: 'آيتل', website: 'https://www.itel-mobile.com/', accent: '#f37021', series: ['itel Series'] },
  { id: 'ZTE', name: 'ZTE', nameAr: 'زد تي إي', website: 'https://www.ztedevices.com/', accent: '#0072bc', series: ['Axon', 'Blade'] },
  { id: 'Nubia', name: 'Nubia', nameAr: 'نوبيا', website: 'https://www.nubia.com/', accent: '#e60012', series: ['Z Series', 'Red Magic'] },
  { id: 'Motorola', name: 'Motorola', nameAr: 'موتورولا', website: 'https://www.motorola.com/', accent: '#5c92fa', series: ['Edge', 'Moto G'] },
  { id: 'Nokia', name: 'Nokia', nameAr: 'نوكيا', website: 'https://www.nokia.com/phones/', accent: '#124191', series: ['X Series', 'G/C Series'] },
  { id: 'LG', name: 'LG', nameAr: 'إل جي', website: 'https://www.lg.com/global/', accent: '#a50034', series: ['LG Series'] },
  { id: 'Google', name: 'Google', nameAr: 'جوجل', website: 'https://store.google.com/category/phones', accent: '#4285f4', series: ['Pixel'] },
]

export const brandById = (name: string) => brands.find(b => b.name.toLowerCase() === name.toLowerCase())
