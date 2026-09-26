import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { ProductItem } from '@/types';
import { SiteContent } from '@/lib/siteContentDefaults';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  enabled: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_CONFIG_FILE = path.join(DATA_DIR, 'dbConfig.json');

export const DEFAULT_DB_CONFIG: DbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dalia_reposteria',
  enabled: process.env.MYSQL_ENABLED === 'true',
};

let pool: Pool | null = null;
let lastConnectionCheck: { success: boolean; message: string; timestamp: number } = {
  success: false,
  message: 'No inicializado',
  timestamp: 0,
};

export function getDbConfig(): DbConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_CONFIG_FILE)) {
      const data = fs.readFileSync(DB_CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_DB_CONFIG, ...JSON.parse(data) };
    }
    fs.writeFileSync(DB_CONFIG_FILE, JSON.stringify(DEFAULT_DB_CONFIG, null, 2), 'utf-8');
    return DEFAULT_DB_CONFIG;
  } catch {
    return DEFAULT_DB_CONFIG;
  }
}

export function saveDbConfig(config: Partial<DbConfig>): DbConfig {
  try {
    const current = getDbConfig();
    const updated: DbConfig = { ...current, ...config };
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    // Reiniciar pool
    if (pool) {
      pool.end().catch(() => {});
      pool = null;
    }
    return updated;
  } catch (err) {
    console.error('Error guardando configuración de MySQL:', err);
    return getDbConfig();
  }
}

export function getMySqlPool(): Pool | null {
  const config = getDbConfig();
  if (!config.enabled && !process.env.MYSQL_HOST) {
    return null;
  }

  if (!pool) {
    try {
      const poolOptions: PoolOptions = {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 4000,
      };
      pool = mysql.createPool(poolOptions);
    } catch (err) {
      console.error('Error creando pool MySQL:', err);
      pool = null;
    }
  }
  return pool;
}

// Probar conexión a MySQL
export async function testMySqlConnection(overrideConfig?: Partial<DbConfig>): Promise<{ success: boolean; message: string; details?: any }> {
  const config = { ...getDbConfig(), ...(overrideConfig || {}) };
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: 4000,
    });
    await connection.ping();
    await connection.end();

    lastConnectionCheck = {
      success: true,
      message: `Conexión exitosa a MySQL (${config.host}:${config.port}/${config.database})`,
      timestamp: Date.now(),
    };
    return { success: true, message: lastConnectionCheck.message };
  } catch (err: any) {
    lastConnectionCheck = {
      success: false,
      message: err.message || 'Error de conexión a MySQL',
      timestamp: Date.now(),
    };
    return { success: false, message: lastConnectionCheck.message, details: err.code };
  }
}

// Inicializar y crear tablas en MySQL
export async function initMySqlSchema(): Promise<{ success: boolean; message: string }> {
  const config = getDbConfig();
  try {
    // 1. Conectar al servidor (sin especificar base de datos primero para crearla si no existe)
    const rootConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      connectTimeout: 5000,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // 2. Conectar a la base de datos y crear tablas
    const dbConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: 5000,
    });

    // Crear tabla products
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(120) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Pasteles',
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        short_desc TEXT,
        description TEXT,
        tasting_notes TEXT,
        image_url TEXT NOT NULL,
        secondary_img TEXT,
        is_available BOOLEAN NOT NULL DEFAULT TRUE,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Crear tabla product_images
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        is_primary BOOLEAN NOT NULL DEFAULT FALSE,
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_prod_img (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Crear tabla product_variants
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        variant_name VARCHAR(150) NOT NULL,
        price_delta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        INDEX idx_prod_variant (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Crear tabla site_content
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        section_key VARCHAR(100) PRIMARY KEY,
        content_json JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Crear tabla orders
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        customer_name VARCHAR(200) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        delivery_date VARCHAR(50) NOT NULL,
        delivery_method VARCHAR(50) NOT NULL DEFAULT 'pickup',
        status VARCHAR(50) NOT NULL DEFAULT 'received',
        total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        items_json JSON NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await dbConn.end();
    return { success: true, message: 'Tablas de MySQL verificadas y listas para operar.' };
  } catch (err: any) {
    console.error('Error inicializando esquema MySQL:', err);
    return { success: false, message: `Error al crear esquema MySQL: ${err.message}` };
  }
}

// Sincronizar catálogo a MySQL
export async function syncAllProductsToMySql(products: ProductItem[]): Promise<{ success: boolean; count: number; message: string }> {
  const p = getMySqlPool();
  if (!p) {
    return { success: false, count: 0, message: 'MySQL no está habilitado o configurado.' };
  }

  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();

    for (const prod of products) {
      await conn.query(
        `INSERT INTO products (id, slug, name, category, price, short_desc, description, tasting_notes, image_url, secondary_img, is_available, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           category = VALUES(category),
           price = VALUES(price),
           short_desc = VALUES(short_desc),
           description = VALUES(description),
           tasting_notes = VALUES(tasting_notes),
           image_url = VALUES(image_url),
           secondary_img = VALUES(secondary_img),
           is_available = VALUES(is_available),
           is_featured = VALUES(is_featured);`,
        [
          prod.id,
          prod.slug || prod.id,
          prod.name,
          prod.category,
          prod.price,
          prod.shortDesc || prod.description,
          prod.description,
          prod.tastingNotes || '',
          prod.imageUrl,
          prod.secondaryImg || prod.imageUrl,
          prod.available !== false,
          Boolean(prod.isFeatured),
        ]
      );

      // Sincronizar imágenes
      await conn.query('DELETE FROM product_images WHERE product_id = ?', [prod.id]);
      const imgs = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.imageUrl];
      for (let i = 0; i < imgs.length; i++) {
        await conn.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [prod.id, imgs[i], imgs[i] === prod.imageUrl, i]
        );
      }

      // Sincronizar variantes
      await conn.query('DELETE FROM product_variants WHERE product_id = ?', [prod.id]);
      if (Array.isArray(prod.variants)) {
        for (const v of prod.variants) {
          await conn.query(
            'INSERT INTO product_variants (product_id, variant_name, price_delta) VALUES (?, ?, ?)',
            [prod.id, v.name, v.priceDelta || 0]
          );
        }
      }
    }

    await conn.commit();
    return { success: true, count: products.length, message: `${products.length} productos sincronizados exitosamente a MySQL.` };
  } catch (err: any) {
    await conn.rollback();
    console.error('Error sincronizando a MySQL:', err);
    return { success: false, count: 0, message: err.message };
  } finally {
    conn.release();
  }
}

// Cargar catálogo desde MySQL
export async function loadProductsFromMySql(): Promise<ProductItem[] | null> {
  const p = getMySqlPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<any[]>('SELECT * FROM products ORDER BY created_at DESC');
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const products: ProductItem[] = [];

    for (const r of rows) {
      // Cargar imágenes
      const [imgRows] = await p.query<any[]>('SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [r.id]);
      const images = Array.isArray(imgRows) && imgRows.length > 0 ? imgRows.map((img) => img.image_url) : [r.image_url];

      // Cargar variantes
      const [varRows] = await p.query<any[]>('SELECT variant_name, price_delta FROM product_variants WHERE product_id = ?', [r.id]);
      const variants = Array.isArray(varRows) && varRows.length > 0
        ? varRows.map((v) => ({ name: v.variant_name, priceDelta: Number(v.price_delta) }))
        : [
            { name: 'Piso Sencillo (15 personas)', priceDelta: 0 },
            { name: 'Doble Piso (25-30 personas)', priceDelta: 450 },
          ];

      products.push({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category as any,
        price: Number(r.price),
        shortDesc: r.short_desc || r.description,
        description: r.description,
        tastingNotes: r.tasting_notes || '',
        imageUrl: r.image_url,
        secondaryImg: r.secondary_img || r.image_url,
        images,
        variants,
        available: Boolean(r.is_available),
        isFeatured: Boolean(r.is_featured),
      });
    }

    return products;
  } catch (err) {
    console.warn('No se pudo cargar desde MySQL, usando fallback local:', err);
    return null;
  }
}
