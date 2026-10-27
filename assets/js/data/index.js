export { brands, brandById } from "./brands.js";
export { phones, phoneById, phonesByBrand } from "./phones.js";
export { faults, faultById } from "./faults.js";
export { tools, toolById, toolCategories } from "./tools.js";
export { firmware, firmwareSources, firmwareSourceById } from "./firmware.js";
export { articles, articleById, articleCategories } from "./articles.js";
export { prices, priceById, pricesByPhone, priceRange } from "./prices.js";
export { parts, partById, partTypes } from "./parts.js";
export { suppliers, supplierById } from "./suppliers.js";
export { requests, requestById, requestCounts } from "./requests.js";
export {
  siteConfig, currencies, exchangeDefaults, cities, qualities, requestStatuses,
  services, repairServices, securityTopics, securityLabs, programmingServices,
  faqs, stats
} from "./content.js";

import { brands } from "./brands.js";
import { phones } from "./phones.js";
import { faults } from "./faults.js";
import { tools } from "./tools.js";
import { firmware, firmwareSources } from "./firmware.js";
import { articles } from "./articles.js";
import { prices } from "./prices.js";
import { parts } from "./parts.js";
import { suppliers } from "./suppliers.js";
import { requests } from "./requests.js";
import { siteConfig, currencies, exchangeDefaults, cities, qualities, requestStatuses } from "./content.js";

export const seedMeta = {
  version: "2026.10.27",
  reviewedAt: "2026-10-27",
  counts: {
    brands: brands.length,
    phones: phones.length,
    faults: faults.length,
    tools: tools.length,
    firmware: firmware.length,
    firmwareSources: firmwareSources.length,
    articles: articles.length,
    prices: prices.length,
    parts: parts.length,
    suppliers: suppliers.length,
    requests: requests.length
  }
};

export const seed = {
  meta: seedMeta,
  siteConfig,
  currencies,
  exchange: exchangeDefaults,
  cities,
  qualities,
  requestStatuses,
  brands,
  phones,
  faults,
  tools,
  firmware,
  firmwareSources,
  articles,
  prices,
  parts,
  suppliers,
  requests
};

export default seed;
