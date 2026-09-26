-- ==========================================================
-- Dalia Repostería · Esquema de Base de Datos MySQL
-- ==========================================================

CREATE DATABASE IF NOT EXISTS dalia_reposteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dalia_reposteria;

-- 1. Tabla de Productos Principales
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
  INDEX idx_category (category),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Galería de Fotos por Producto (Multi-imagen)
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  INDEX idx_prod_img (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Tamaños / Variantes de Porciones
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  variant_name VARCHAR(150) NOT NULL,
  price_delta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_product_variants FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  INDEX idx_prod_variant (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Contenidos del Sitio (Frases, Dirección, Anuncios)
CREATE TABLE IF NOT EXISTS site_content (
  section_key VARCHAR(100) PRIMARY KEY,
  content_json JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Pedidos y Cotizaciones
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_status (status),
  INDEX idx_delivery_date (delivery_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
