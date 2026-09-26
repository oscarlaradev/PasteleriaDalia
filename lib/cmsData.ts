import fs from 'fs';
import path from 'path';
import { ProductItem } from '@/types';
import { CATALOGO_DALIA_PRODUCTOS } from './catalogoProductos';

const DATA_DIR = path.join(process.cwd(), 'data');
const CATALOGO_FILE = path.join(DATA_DIR, 'catalogo.json');
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'siteContent.json');

import { SiteContent, DEFAULT_SITE_CONTENT } from './siteContentDefaults';
export type { SiteContent };
export { DEFAULT_SITE_CONTENT };

// Asegurar que existe el directorio data
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

import { syncAllProductsToMySql, loadProductsFromMySql } from '@/lib/db/mysql';

// 1. Obtener Catálogo Completo (con fallback a CATALOGO_DALIA_PRODUCTOS)
export function getProductsData(): ProductItem[] {
  try {
    ensureDataDir();
    if (fs.existsSync(CATALOGO_FILE)) {
      const content = fs.readFileSync(CATALOGO_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Inicializar con el catálogo base si no existe
    saveProductsData(CATALOGO_DALIA_PRODUCTOS);
    return CATALOGO_DALIA_PRODUCTOS;
  } catch (err) {
    console.error('Error leyendo catalogo.json, usando fallback:', err);
    return CATALOGO_DALIA_PRODUCTOS;
  }
}

// 1b. Obtener Catálogo de forma asíncrona priorizando MySQL si está activo
export async function getProductsDataAsync(): Promise<ProductItem[]> {
  try {
    const fromMySql = await loadProductsFromMySql();
    if (fromMySql && fromMySql.length > 0) {
      return fromMySql;
    }
  } catch {}
  return getProductsData();
}

// 2. Guardar Catálogo Completo (en archivo local y en MySQL simultáneamente)
export function saveProductsData(products: ProductItem[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(CATALOGO_FILE, JSON.stringify(products, null, 2), 'utf-8');
    // Sincronizar en segundo plano a MySQL si el pool está activo
    syncAllProductsToMySql(products).catch(() => {});
    return true;
  } catch (err) {
    console.error('Error guardando catalogo.json:', err);
    return false;
  }
}

// 3. Obtener Contenido del Sitio (Frases, Dirección, etc.)
export function getSiteContentData(): SiteContent {
  try {
    ensureDataDir();
    if (fs.existsSync(SITE_CONTENT_FILE)) {
      const content = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      };
    }
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), 'utf-8');
    return DEFAULT_SITE_CONTENT;
  } catch (err) {
    console.error('Error leyendo siteContent.json, usando fallback:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

// 4. Guardar Contenido del Sitio
export function saveSiteContentData(content: Partial<SiteContent>): boolean {
  try {
    ensureDataDir();
    let current = DEFAULT_SITE_CONTENT;
    if (fs.existsSync(SITE_CONTENT_FILE)) {
      try {
        const raw = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8');
        current = { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
      } catch {
        current = DEFAULT_SITE_CONTENT;
      }
    }
    const merged: SiteContent = {
      ...current,
      ...content,
      hero: { ...current.hero, ...(content.hero || {}) },
      contact: { ...current.contact, ...(content.contact || {}) },
      announcement: { ...(current.announcement || { enabled: false, text: '' }), ...(content.announcement || {}) },
    };
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error guardando siteContent.json:', err);
    return false;
  }
}
