'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShoppingBag,
  Package,
  Calendar,
  Settings,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Link2,
  Image as ImageIcon,
  Sparkles,
  X,
  Layers,
  Save,
  Check,
  Database,
  Star,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductItem } from '@/types';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/siteContentDefaults';

interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryDate: string;
  total: number;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'LISTO_PARA_RECOGER' | 'ENTREGADO' | 'CANCELADO';
  itemsSummary: string;
}

const initialOrders: MockOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'DALIA-2026-0042',
    customerName: 'Valeria Montes',
    customerPhone: '833 491 3341',
    deliveryMethod: 'Recoger en Obrador (Calle 0 #205 A, Col. Enrique Cárdenas)',
    deliveryDate: '2026-09-18 (11:00 AM)',
    total: 950,
    status: 'EN_PREPARACION',
    itemsSummary: '1x Pastel de Mariposas al Óleo (Mediano 15p), 1x Vela dorada artesanal',
  },
  {
    id: 'ord-102',
    orderNumber: 'DALIA-2026-0043',
    customerName: 'Rodrigo Gómez',
    customerPhone: '833 192 4402',
    deliveryMethod: 'Entrega a Domicilio (Zona Lomas de Rosales)',
    deliveryDate: '2026-09-18 (02:00 PM)',
    total: 750,
    status: 'CONFIRMADO',
    itemsSummary: '1x Pastel Cósmico Super Mario Galaxy (15 personas)',
  },
  {
    id: 'ord-103',
    orderNumber: 'DALIA-2026-0044',
    customerName: 'Camila Villalobos',
    customerPhone: '833 882 1190',
    deliveryMethod: 'Recoger en Obrador',
    deliveryDate: '2026-09-19 (01:00 PM)',
    total: 1200,
    status: 'PENDIENTE',
    itemsSummary: '1x Pastel Personalizado (25 pers, Bizcocho Vainilla, Betún chantilly, Topper Happy Birthday)',
  },
];

export default function SecretAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados de Pestañas
  const [activeTab, setActiveTab] = useState<'productos' | 'frases' | 'database' | 'pedidos' | 'agenda' | 'seguridad'>('productos');
  const [orders, setOrders] = useState<MockOrder[]>(initialOrders);
  const [filterOrder, setFilterOrder] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Estado del Catálogo de Productos
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Estado del Formulario de Producto (con Multi-Imagen y Variantes)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pasteles',
    price: '',
    shortDesc: '',
    description: '',
    tastingNotes: '',
    imageUrl: '',
    images: [] as string[],
    variants: [
      { name: 'Piso Sencillo (15 personas)', priceDelta: 0 },
      { name: 'Doble Piso (25-30 personas)', priceDelta: 450 },
    ],
    available: true,
    isFeatured: false,
  });

  // Estado del Optimizador WebP
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStats, setUploadStats] = useState<{ originalSize: string; optimizedSize: string; savings: string } | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estado de Frases y Ajustes del Sitio
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isSavingContent, setIsSavingContent] = useState<boolean>(false);
  const [contentSaveSuccess, setContentSaveSuccess] = useState<boolean>(false);

  // Estado de Base de Datos MySQL
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dalia_reposteria',
    enabled: false,
    hasPassword: false,
  });
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Verificando...',
  });
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [isTestingDb, setIsTestingDb] = useState<boolean>(false);
  const [isMigratingDb, setIsMigratingDb] = useState<boolean>(false);
  const [isSavingDb, setIsSavingDb] = useState<boolean>(false);
  const [dbActionMessage, setDbActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // 1. Validar sesión y cargar datos al montar
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/admin-auth');
        if (authRes.ok) {
          setIsAuthenticated(true);
          await loadProducts();
          await loadSiteContent();
          await loadDatabaseInfo();
        }
      } catch {
        // No autenticado
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  const loadSiteContent = async () => {
    try {
      const res = await fetch('/api/admin/site-content');
      const data = await res.json();
      if (data.content) {
        setSiteContent(data.content);
      }
    } catch (err) {
      console.error('Error cargando contenidos:', err);
    }
  };

  const loadDatabaseInfo = async () => {
    try {
      const res = await fetch('/api/admin/database');
      const data = await res.json();
      if (data.config) {
        setDbConfig(data.config);
      }
      if (data.status) {
        setDbStatus(data.status);
      }
      if (data.schemaSql) {
        setSchemaSql(data.schemaSql);
      }
    } catch (err) {
      console.error('Error cargando info de base de datos:', err);
    }
  };

  // 2. Login con PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPinInput('');
        await loadProducts();
        await loadSiteContent();
        await loadDatabaseInfo();
      } else {
        setAuthError(data.error || 'Credenciales incorrectas.');
      }
    } catch {
      setAuthError('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // 3. Subida y Optimización WebP Automática
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStats(null);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setFormData((prev) => {
          const updatedImages = prev.images.includes(data.url) ? prev.images : [...prev.images, data.url];
          return {
            ...prev,
            imageUrl: prev.imageUrl ? prev.imageUrl : data.url,
            images: updatedImages,
          };
        });
        setUploadStats({
          originalSize: data.originalSize,
          optimizedSize: data.optimizedSize,
          savings: data.savings,
        });
      } else {
        alert(data.error || 'Error al optimizar imagen');
      }
    } catch (err) {
      alert('Error de conexión al subir imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return;
    setIsUploading(true);
    setUploadStats(null);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setFormData((prev) => {
          const updatedImages = prev.images.includes(data.url) ? prev.images : [...prev.images, data.url];
          return {
            ...prev,
            imageUrl: prev.imageUrl ? prev.imageUrl : data.url,
            images: updatedImages,
          };
        });
        setUploadStats({
          originalSize: data.originalSize,
          optimizedSize: data.optimizedSize,
          savings: data.savings,
        });
        setUrlInput('');
      } else {
        alert(data.error || 'Error al procesar imagen por enlace');
      }
    } catch (err) {
      alert('Error de conexión al procesar enlace de imagen');
    } finally {
      setIsUploading(false);
    }
  };

  // Gestión de Galería Multi-Imagen
  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = formData.images[indexToRemove];
    const nextImages = formData.images.filter((_, idx) => idx !== indexToRemove);
    let nextPrimary = formData.imageUrl;

    if (removedUrl === formData.imageUrl) {
      nextPrimary = nextImages.length > 0 ? nextImages[0] : '';
    }

    setFormData((prev) => ({
      ...prev,
      images: nextImages,
      imageUrl: nextPrimary,
    }));
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: imgUrl,
    }));
  };

  // Gestión de Variantes y Tamaños
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: 'Tamaño Especial (20 personas)', priceDelta: 200 }],
    }));
  };

  const handleRemoveVariant = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleUpdateVariant = (index: number, field: 'name' | 'priceDelta', value: any) => {
    setFormData((prev) => {
      const nextVariants = [...prev.variants];
      nextVariants[index] = { ...nextVariants[index], [field]: value };
      return { ...prev, variants: nextVariants };
    });
  };

  // 4. Abrir Modal de Producto (Nuevo o Editar)
  const openNewProductModal = () => {
    setEditingProduct(null);
    setUploadStats(null);
    setFormData({
      name: '',
      category: 'Pasteles',
      price: '',
      shortDesc: '',
      description: '',
      tastingNotes: '',
      imageUrl: '',
      images: [],
      variants: [
        { name: 'Piso Sencillo (15 personas)', priceDelta: 0 },
        { name: 'Doble Piso (25-30 personas)', priceDelta: 450 },
      ],
      available: true,
      isFeatured: false,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductItem) => {
    setEditingProduct(product);
    setUploadStats(null);
    const existingImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.imageUrl];
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      shortDesc: product.shortDesc || '',
      description: product.description || product.shortDesc || '',
      tastingNotes: product.tastingNotes || '',
      imageUrl: product.imageUrl || existingImages[0] || '',
      images: existingImages,
      variants: product.variants || [
        { name: 'Piso Sencillo (15 personas)', priceDelta: 0 },
        { name: 'Doble Piso (25-30 personas)', priceDelta: 450 },
      ],
      available: product.available !== false,
      isFeatured: Boolean(product.isFeatured),
    });
    setIsProductModalOpen(true);
  };

  // 5. Guardar Producto (Crear o Actualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Por favor complete el nombre y precio del producto.');
      return;
    }

    const finalPrimaryImage = formData.imageUrl || (formData.images.length > 0 ? formData.images[0] : '/assets/productos_reales/mariposas_1.jpg');
    const finalImages = formData.images.length > 0 ? formData.images : [finalPrimaryImage];

    const payload = {
      ...formData,
      id: editingProduct ? editingProduct.id : undefined,
      price: Number(formData.price),
      imageUrl: finalPrimaryImage,
      images: finalImages,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsProductModalOpen(false);
        await loadProducts();
      } else {
        alert(data.error || 'Error al guardar el producto.');
      }
    } catch (err) {
      alert('Error de conexión al guardar el producto.');
    }
  };

  // 6. Eliminar Producto
  const handleDeleteProduct = async (product: ProductItem) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}" del catálogo?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadProducts();
      } else {
        alert(data.error || 'No se pudo eliminar el producto.');
      }
    } catch {
      alert('Error de conexión al eliminar.');
    }
  };

  // 7. Guardar Frases y Ajustes
  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    setContentSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContentSaveSuccess(true);
        setTimeout(() => setContentSaveSuccess(false), 4000);
      } else {
        alert(data.error || 'Error al guardar textos de la web.');
      }
    } catch {
      alert('Error de conexión al guardar textos.');
    } finally {
      setIsSavingContent(false);
    }
  };

  // 8. Control de Base de Datos MySQL
  const handleTestDb = async () => {
    setIsTestingDb(true);
    setDbActionMessage(null);
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          ...dbConfig,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDbStatus({ connected: true, message: data.message });
        setDbActionMessage({ type: 'success', text: `¡Conexión Exitosa! ${data.message}` });
      } else {
        setDbStatus({ connected: false, message: data.message });
        setDbActionMessage({ type: 'error', text: `Fallo de conexión: ${data.message}` });
      }
    } catch (err: any) {
      setDbActionMessage({ type: 'error', text: 'Error al contactar con el servidor.' });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSaveDbConfig = async () => {
    setIsSavingDb(true);
    setDbActionMessage(null);
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_config',
          ...dbConfig,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDbConfig(data.config);
        if (data.connection) {
          setDbStatus({ connected: data.connection.success, message: data.connection.message });
        }
        setDbActionMessage({ type: 'success', text: 'Configuración guardada en el servidor.' });
      } else {
        setDbActionMessage({ type: 'error', text: data.message || 'Error al guardar.' });
      }
    } catch {
      setDbActionMessage({ type: 'error', text: 'Error de red al guardar configuración.' });
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleMigrateDb = async () => {
    if (!confirm('¿Deseas inicializar las tablas de MySQL y migrar todos los productos actuales a la base de datos?')) {
      return;
    }
    setIsMigratingDb(true);
    setDbActionMessage(null);
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate_catalog' }),
      });
      const data = await res.json();
      if (data.success) {
        setDbActionMessage({ type: 'success', text: `¡Migración completada! ${data.message || ''}` });
        await loadDatabaseInfo();
        await loadProducts();
      } else {
        setDbActionMessage({ type: 'error', text: data.message || 'No se pudo migrar a MySQL.' });
      }
    } catch {
      setDbActionMessage({ type: 'error', text: 'Error de conexión durante la migración.' });
    } finally {
      setIsMigratingDb(false);
    }
  };

  const handleCopySql = () => {
    if (schemaSql) {
      navigator.clipboard.writeText(schemaSql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  // Filtrado de Productos
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'TODAS' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.tastingNotes && p.tastingNotes.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Pantalla de Carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181314] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-dalia-rose mb-4" />
        <p className="text-xs font-mono text-white/50 tracking-widest uppercase">
          Verificando credenciales de acceso...
        </p>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 1: ACCESO PROTEGIDO CON PIN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#140F10] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#241C1E] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-dalia-rose/5 rounded-full blur-3xl" />
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-dalia-rose/10 border border-dalia-rose/20 flex items-center justify-center text-dalia-rose mb-1 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-dalia-rose uppercase px-3 py-1 bg-dalia-rose/10 rounded-full border border-dalia-rose/20">
              Terminal del Obrador · Acceso Restringido
            </span>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Dalia Repostería
            </h1>
            <p className="text-xs text-white/60 max-w-xs leading-relaxed">
              Ingresa el PIN de seguridad para gestionar pedidos, catálogo y contenidos de Tampico.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/70 block">
                PIN Maestro de Seguridad
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-[#181314] border border-white/15 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-dalia-rose focus:ring-1 focus:ring-dalia-rose transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !pinInput.trim()}
              className="w-full py-3 bg-dalia-strawberry hover:bg-[#c94b63] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-paper flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entrar al Panel Maestro</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/40">
              Ubicación: Calle 0 #205 A, Col. Enrique Cárdenas González, Tampico
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 2: PANEL MAESTRO COMPLETO (AUTENTICADO)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#181314] text-white flex flex-col">
      {/* Barra de Navegación Superior */}
      <header className="border-b border-white/10 bg-[#241C1E] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-dalia-rose/20 border border-dalia-rose/40 flex items-center justify-center text-dalia-rose font-serif font-bold text-lg">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-white tracking-wide">
                  Panel Maestro del Obrador
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Control Total Activo
                </span>
              </div>
              <p className="text-xs text-white/50">
                {siteContent.contact.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${siteContent.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Obrador ({siteContent.contact.phone})</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-white/70 hover:text-red-400 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Bloquear</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-4 pt-2 border-t border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'productos'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos & Galería ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('frases')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'frases'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Control de Frases & Marca</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'database'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Datos MySQL</span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'pedidos'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos en Obrador ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'agenda'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda del Horno</span>
          </button>

          <button
            onClick={() => setActiveTab('seguridad')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'seguridad'
                ? 'bg-dalia-rose/20 text-dalia-rose border border-dalia-rose/30 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Seguridad & Anti-Tamper</span>
          </button>
        </div>
      </header>

      {/* Contenido Dinámico */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1">
        {/* ========================================================================= */}
        {/* PESTAÑA 1: CONTROL DE PRODUCTOS (CRUD + GALERÍA + OPTIMIZADOR WEBP)       */}
        {/* ========================================================================= */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            {/* Cabecera y Botón de Creación */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#241C1E] border border-white/10 rounded-2xl p-5">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  Catálogo Oficial de Creaciones Artesanales
                </h2>
                <p className="text-xs text-white/50">
                  Agrega, edita precios, administra la galería completa de fotos y modifica textos en vivo.
                </p>
              </div>

              <button
                onClick={openNewProductModal}
                className="px-4 py-2.5 bg-dalia-strawberry hover:bg-[#c94b63] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-paper self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Pastel o Antojo</span>
              </button>
            </div>

            {/* Filtros y Buscador */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {['TODAS', 'Pasteles', 'Personalizados', 'Cupcakes'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-dalia-rose text-dalia-chocolate font-semibold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar creación artesanal..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#241C1E] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-dalia-rose"
                />
              </div>
            </div>

            {/* Listado de Productos en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const imgCount = Array.isArray(prod.images) ? prod.images.length : (prod.imageUrl ? 1 : 0);
                return (
                  <div
                    key={prod.id}
                    className="bg-[#241C1E] border border-white/10 hover:border-dalia-rose/40 rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Imagen Principal con badge de fotos */}
                      <div className="relative w-full h-48 bg-black">
                        <Image
                          src={prod.imageUrl || (prod.images && prod.images[0]) || '/assets/productos_reales/mariposas_1.jpg'}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-black/60 backdrop-blur-sm text-white">
                            {prod.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dalia-rose/90 text-dalia-chocolate shadow flex items-center gap-1">
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>{imgCount} {imgCount === 1 ? 'foto' : 'fotos'}</span>
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              prod.available !== false
                                ? 'bg-emerald-500/80 text-white'
                                : 'bg-red-500/80 text-white'
                            }`}
                          >
                            {prod.available !== false ? 'Activo' : 'Pausado'}
                          </span>
                        </div>
                      </div>

                      {/* Detalles del Producto */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-sm text-white leading-snug">
                            {prod.name}
                          </h3>
                          <span className="text-sm font-bold text-dalia-rose shrink-0 font-mono">
                            {formatCurrency(prod.price)}
                          </span>
                        </div>

                        <p className="text-xs text-white/60 line-clamp-2">
                          {prod.shortDesc || prod.description}
                        </p>

                        {/* Galería de miniaturas */}
                        {Array.isArray(prod.images) && prod.images.length > 1 && (
                          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                            {prod.images.slice(0, 4).map((img, i) => (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-lg overflow-hidden relative border shrink-0 bg-black ${
                                  img === prod.imageUrl ? 'border-dalia-rose ring-1 ring-dalia-rose' : 'border-white/20'
                                }`}
                              >
                                <Image src={img} alt="Toma" fill className="object-cover" />
                              </div>
                            ))}
                            {prod.images.length > 4 && (
                              <span className="text-[10px] text-white/40 pl-1">
                                +{prod.images.length - 4} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const updatedStatus = prod.available === false;
                          fetch('/api/admin/products', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: prod.id, available: updatedStatus }),
                          }).then(() => loadProducts());
                        }}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                          prod.available !== false
                            ? 'border-white/10 text-white/60 hover:text-amber-300 hover:border-amber-300/30'
                            : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        }`}
                      >
                        {prod.available !== false ? 'Pausar' : 'Activar'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-dalia-rose/40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-dalia-rose" />
                          <span>Editar / Fotos</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          className="p-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: CONTROL DE FRASES & MARCA                                      */}
        {/* ========================================================================= */}
        {activeTab === 'frases' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-[#241C1E] border border-white/10 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  Control de Frases, Textos & Datos del Obrador
                </h2>
                <p className="text-xs text-white/50">
                  Modifica las frases principales del sitio, sellos de calidad y datos de contacto de Tampico.
                </p>
              </div>

              <form onSubmit={handleSaveSiteContent} className="space-y-6">
                {/* Hero Principal */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-dalia-rose block">
                    1. Encabezado Principal de la Página de Inicio (Hero)
                  </span>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70 block">Frase Principal (Título Hero)</label>
                    <input
                      type="text"
                      value={siteContent.hero.title}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70 block">Subtítulo Editorial</label>
                    <textarea
                      rows={2}
                      value={siteContent.hero.subtitle}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70 block">Texto del Botón Principal</label>
                    <input
                      type="text"
                      value={siteContent.hero.ctaText}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, ctaText: e.target.value },
                        })
                      }
                      className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    />
                  </div>
                </div>

                {/* Sellos Editoriales */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-dalia-rose block">
                    2. Sellos de Calidad Editorial
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Sello Superior Izquierdo</label>
                      <input
                        type="text"
                        value={siteContent.hero.badge1}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, badge1: e.target.value },
                          })
                        }
                        className="w-full bg-[#181314] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-dalia-rose"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60 block mb-1">Sello Superior Derecho</label>
                      <input
                        type="text"
                        value={siteContent.hero.badge2}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, badge2: e.target.value },
                          })
                        }
                        className="w-full bg-[#181314] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-dalia-rose"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60 block mb-1">Sello Flotante Lateral</label>
                      <input
                        type="text"
                        value={siteContent.hero.badge3}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            hero: { ...siteContent.hero, badge3: e.target.value },
                          })
                        }
                        className="w-full bg-[#181314] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-dalia-rose"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos de Contacto y Obrador */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-dalia-rose block">
                    3. Datos Oficiales del Obrador en Tampico
                  </span>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70 block">Dirección Completa</label>
                    <input
                      type="text"
                      value={siteContent.contact.address}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, address: e.target.value },
                        })
                      }
                      className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/70 block mb-1">Teléfono Visible</label>
                      <input
                        type="text"
                        value={siteContent.contact.phone}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, phone: e.target.value },
                          })
                        }
                        className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/70 block mb-1">WhatsApp Internacional (Sin espacios)</label>
                      <input
                        type="text"
                        value={siteContent.contact.whatsapp}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, whatsapp: e.target.value },
                          })
                        }
                        className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                        placeholder="528333186010"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70 block">Horario de Obrador</label>
                    <input
                      type="text"
                      value={siteContent.contact.hours}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, hours: e.target.value },
                        })
                      }
                      className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    />
                  </div>
                </div>

                {contentSaveSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>¡Frases y datos de marca guardados exitosamente! Ya se muestran en la tienda.</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingContent}
                    className="px-6 py-2.5 bg-dalia-strawberry hover:bg-[#c94b63] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-paper flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingContent ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Textos & Frases</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: BASE DE DATOS MYSQL & SISTEMA                                   */}
        {/* ========================================================================= */}
        {activeTab === 'database' && (
          <div className="max-w-4xl space-y-6">
            {/* Estado de Conexión */}
            <div className="bg-[#241C1E] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    dbStatus.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-white">
                      Base de Datos MySQL
                    </h2>
                    <p className="text-xs text-white/50">
                      {dbStatus.connected
                        ? `Conexión activa a ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
                        : 'Almacenamiento Local Resiliente activo (Fallback local para evitar caídas)'}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase flex items-center gap-1.5 self-start sm:self-auto ${
                  dbStatus.connected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {dbStatus.connected ? 'MySQL Conectado' : 'Almacenamiento Resiliente'}
                </span>
              </div>

              {dbActionMessage && (
                <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                  dbActionMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  {dbActionMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{dbActionMessage.text}</span>
                </div>
              )}
            </div>

            {/* Configuración de Conexión */}
            <div className="bg-[#241C1E] border border-white/10 rounded-2xl p-6 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dalia-rose">
                Parámetros de Conexión a MySQL
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/70 block">Host / Servidor MySQL</label>
                  <input
                    type="text"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    placeholder="localhost o IP del servidor"
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dalia-rose font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/70 block">Puerto</label>
                  <input
                    type="number"
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: Number(e.target.value) })}
                    placeholder="3306"
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dalia-rose font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/70 block">Nombre de la Base de Datos</label>
                  <input
                    type="text"
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                    placeholder="dalia_reposteria"
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dalia-rose font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/70 block">Usuario MySQL</label>
                  <input
                    type="text"
                    value={dbConfig.user}
                    onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                    placeholder="root o usuario de base de datos"
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dalia-rose font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs text-white/70 block">Contraseña</label>
                  <input
                    type="password"
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                    placeholder="Contraseña del usuario MySQL"
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dalia-rose font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dbConfig.enabled}
                    onChange={(e) => setDbConfig({ ...dbConfig, enabled: e.target.checked })}
                    className="rounded border-white/20 bg-[#181314] text-dalia-rose focus:ring-0"
                  />
                  <span>Habilitar motor MySQL como base de datos primaria</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isTestingDb}
                  onClick={handleTestDb}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isTestingDb ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Probar Conexión</span>
                </button>

                <button
                  type="button"
                  disabled={isSavingDb}
                  onClick={handleSaveDbConfig}
                  className="px-4 py-2 bg-dalia-rose/20 hover:bg-dalia-rose/30 border border-dalia-rose/40 text-dalia-rose text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingDb ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Guardar Parámetros</span>
                </button>

                <button
                  type="button"
                  disabled={isMigratingDb}
                  onClick={handleMigrateDb}
                  className="px-5 py-2 bg-dalia-strawberry hover:bg-[#c94b63] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-paper flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  {isMigratingDb ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Migrando Catálogo a MySQL...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>Crear Tablas & Migrar Todo a MySQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Esquema SQL & Script */}
            <div className="bg-[#241C1E] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Esquema SQL Relacional (schema.sql)
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Tablas: products, product_images, product_variants, site_content, orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div className="bg-[#140F10] border border-white/10 rounded-xl p-4 max-h-60 overflow-y-auto font-mono text-[11px] text-white/70 leading-relaxed">
                <pre>{schemaSql || '-- Cargando esquema SQL...'}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: PEDIDOS EN OBRADOR                                             */}
        {/* ========================================================================= */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#241C1E] border border-white/10 rounded-2xl p-5">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  Pedidos y Encargos Recibidos
                </h2>
                <p className="text-xs text-white/50">
                  Control de entregas en obrador y envíos en Tampico.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#241C1E] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-dalia-rose">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {ord.customerName}
                      </span>
                      <span className="text-[10px] text-white/40">
                        ({ord.customerPhone})
                      </span>
                    </div>
                    <p className="text-xs text-white/70">{ord.itemsSummary}</p>
                    <p className="text-[11px] text-white/40">
                      Entrega: {ord.deliveryDate} · {ord.deliveryMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold font-mono text-white">
                      {formatCurrency(ord.total)}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-semibold uppercase">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 5: AGENDA DEL HORNO                                               */}
        {/* ========================================================================= */}
        {activeTab === 'agenda' && (
          <div className="max-w-3xl space-y-4">
            <div className="bg-[#241C1E] border border-white/10 rounded-2xl p-6 space-y-3">
              <h2 className="font-serif font-bold text-lg text-white">
                Disponibilidad de Horneado en Tampico
              </h2>
              <p className="text-xs text-white/50">
                Horario de atención del taller: {siteContent.contact.hours}
              </p>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                Capacidad de pedidos de fin de semana activa. Los clientes pueden solicitar cotización directa por WhatsApp.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 6: SEGURIDAD                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'seguridad' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-[#241C1E] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Defensas Cibernéticas & Motor WebP Activo
                  </h3>
                  <p className="text-xs text-white/50">
                    Next.js Middleware + Conversión Automática WebP con Sharp + MySQL Pooling
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#181314] p-3.5 rounded-lg border border-white/5">
                  <span className="text-xs font-semibold text-white block">Conversión WebP Automática</span>
                  <p className="text-[11px] text-white/40 mt-1">
                    Cualquier foto JPG/PNG subida o descargada se transforma sin pérdida a WebP con calidad 88.
                  </p>
                </div>
                <div className="bg-[#181314] p-3.5 rounded-lg border border-white/5">
                  <span className="text-xs font-semibold text-white block">Anti-Fuerza Bruta</span>
                  <p className="text-[11px] text-white/40 mt-1">
                    Bloqueo temporal automático por IP ante 5 intentos erróneos de PIN.
                  </p>
                </div>
                <div className="bg-[#181314] p-3.5 rounded-lg border border-white/5">
                  <span className="text-xs font-semibold text-white block">Esquema Relacional MySQL</span>
                  <p className="text-[11px] text-white/40 mt-1">
                    Tablas indexadas para productos, imágenes en cascada y contenidos con pool de conexiones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL PARA CREAR O EDITAR PRODUCTO (CON GALERÍA MULTI-IMAGEN COMPLETA)    */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#241C1E] border border-white/15 rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  {editingProduct ? `Editar: ${editingProduct.name}` : 'Nuevo Pastel o Antojo Artesanal'}
                </h2>
                <p className="text-[11px] text-white/50">
                  Controla precios, porciones, textos y la galería completa de fotos multi-ángulo.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* 1. Nombre y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-white/70 block">Nombre de la Creación</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                    placeholder="Ej: Pastel de Rosas & Crema de Almendras"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70 block">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                  >
                    <option value="Pasteles">Pasteles</option>
                    <option value="Personalizados">Personalizados</option>
                    <option value="Cupcakes">Cupcakes</option>
                    <option value="Galletas">Galletas</option>
                    <option value="Brownies">Brownies</option>
                    <option value="Cajas">Cajas</option>
                  </select>
                </div>
              </div>

              {/* 2. Precio Base y Disponibilidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70 block">Precio Base Oficial ($ MXN)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose font-mono"
                    placeholder="650"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70 block">Estado en Tienda</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        className="rounded border-white/20 bg-[#181314] text-dalia-rose focus:ring-0"
                      />
                      <span>Disponible para pedidos</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-white/20 bg-[#181314] text-dalia-rose focus:ring-0"
                      />
                      <span>Destacado en Vitrina Principal</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Descripciones y Notas */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">Descripción Artesanal</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value, shortDesc: e.target.value })}
                  className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                  placeholder="Detalles de la decoración, textura del betún, bizcocho y estilo artesanal..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">Notas de Cata / Rellenos</label>
                <input
                  type="text"
                  value={formData.tastingNotes}
                  onChange={(e) => setFormData({ ...formData, tastingNotes: e.target.value })}
                  className="w-full bg-[#181314] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dalia-rose"
                  placeholder="Ej: Relleno de compota de fresas silvestres y betún de mantequilla gloria"
                />
              </div>

              {/* ========================================================================= */}
              {/* GESTIÓN DE GALERÍA DE FOTOS MULTI-TOMA (VER, ELIMINAR, HACER PORTADA)     */}
              {/* ========================================================================= */}
              <div className="bg-[#181314] border border-white/15 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-dalia-rose" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Galería Completa de Fotos ({formData.images.length} fotos)
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50">
                    ★ Marca cuál es la portada o pulsa el basurero para eliminar cualquier foto
                  </span>
                </div>

                {/* Cuadrícula de Fotos Actuales */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.images.map((imgUrl, idx) => {
                      const isPrimary = imgUrl === formData.imageUrl || (idx === 0 && !formData.imageUrl);
                      return (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className={`relative group rounded-xl overflow-hidden border-2 bg-black aspect-square flex flex-col justify-between p-1.5 transition-all ${
                            isPrimary ? 'border-dalia-rose shadow-lg shadow-dalia-rose/20 ring-1 ring-dalia-rose' : 'border-white/15 hover:border-white/40'
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            fill
                            className="object-cover"
                          />

                          {/* Acciones sobre la foto */}
                          <div className="relative z-10 flex items-center justify-between w-full">
                            {isPrimary ? (
                              <span className="px-2 py-0.5 bg-dalia-rose text-dalia-chocolate font-bold text-[9px] rounded uppercase shadow-sm flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Portada</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(imgUrl)}
                                className="px-2 py-0.5 bg-black/75 hover:bg-dalia-rose hover:text-dalia-chocolate text-white text-[9px] rounded font-medium transition-colors cursor-pointer"
                              >
                                Hacer Portada
                              </button>
                            )}

                            {/* Botón de Eliminar Foto */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              title="Eliminar esta foto de la galería"
                              className="w-6 h-6 rounded bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="relative z-10 self-start mt-auto">
                            <span className="px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white/70 font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-white/20 rounded-xl bg-white/5">
                    <p className="text-xs text-white/50">
                      Este producto no tiene fotos en su galería todavía. Sube una o pega un enlace abajo.
                    </p>
                  </div>
                )}

                {/* Optimizador Automático WebP para Añadir Más Fotos */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/90">
                      + Añadir Otra Foto a la Galería (Conversión WebP Automática):
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      SHARP ENGINE WEBP ACTIVO
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subir desde Laptop / Celular */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-white/60 block">Desde tu laptop o celular:</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/20 hover:border-dalia-rose bg-white/5 hover:bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-xs text-white/80 transition-all cursor-pointer"
                      >
                        {isUploading ? (
                          <RefreshCw className="w-5 h-5 animate-spin text-dalia-rose" />
                        ) : (
                          <Upload className="w-5 h-5 text-dalia-rose" />
                        )}
                        <span className="font-medium">
                          {isUploading ? 'Convirtiendo a WebP...' : 'Seleccionar archivo (JPG, PNG)'}
                        </span>
                        <span className="text-[10px] text-white/40">Se optimiza automáticamente a WebP</span>
                      </button>
                    </div>

                    {/* Subir por Enlace Web */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-white/60 block">O pegar enlace web (URL):</span>
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://ejemplo.com/foto.jpg"
                          className="w-full bg-[#241C1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-dalia-rose"
                        />
                        <button
                          type="button"
                          disabled={isUploading || !urlInput.trim()}
                          onClick={handleUrlUpload}
                          className="w-full py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Descargar & Convertir a WebP</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {uploadStats && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Foto añadida y optimizada a WebP! {uploadStats.originalSize} ➔ <strong>{uploadStats.optimizedSize}</strong></span>
                      </div>
                      <span className="font-bold font-mono">Ahorro: -{uploadStats.savings}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* TAMAÑOS / VARIANTES DE PORCIONES                                          */}
              {/* ========================================================================= */}
              <div className="bg-[#181314] border border-white/15 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-dalia-rose" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Tamaños y Porciones ({formData.variants.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-dalia-rose text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Agregar Tamaño</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((v, vIdx) => (
                    <div key={vIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(vIdx, 'name', e.target.value)}
                        placeholder="Ej: Piso Sencillo (15 personas)"
                        className="flex-1 bg-[#241C1E] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-dalia-rose"
                      />
                      <div className="flex items-center gap-1 bg-[#241C1E] border border-white/15 rounded-lg px-2 py-1.5">
                        <span className="text-xs text-white/50">+$</span>
                        <input
                          type="number"
                          value={v.priceDelta}
                          onChange={(e) => handleUpdateVariant(vIdx, 'priceDelta', Number(e.target.value))}
                          className="w-20 bg-transparent text-xs text-white focus:outline-none font-mono"
                          placeholder="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(vIdx)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar tamaño"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-dalia-strawberry hover:bg-[#c94b63] text-white font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-paper flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Guardar Cambios de Creación' : 'Crear Producto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
