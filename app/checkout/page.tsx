'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartContext } from '@/components/layout/ClientLayout';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Truck, Store, Calendar, Clock, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { DeliveryZoneInfo } from '@/types';

const zonasDisponibles: DeliveryZoneInfo[] = [
  { id: 'z1', name: 'Zona Tampico Norte (Col. Enrique Cárdenas, Tancol, Infonavit)', cost: 45, estimatedTime: '30-45 min', minOrder: 200 },
  { id: 'z2', name: 'Zona Tampico Centro / Lomas de Rosales / Petrolera', cost: 60, estimatedTime: '35-50 min', minOrder: 250 },
  { id: 'z3', name: 'Zona Ciudad Madero (Unidad Nacional, Ampliación, Centro)', cost: 70, estimatedTime: '40-60 min', minOrder: 250 },
  { id: 'z4', name: 'Zona Altamira / Monte Alto / Corredor', cost: 95, estimatedTime: '50-70 min', minOrder: 350 },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartContext();

  const [deliveryMethod, setDeliveryMethod] = useState<'RECOGER_EN_TIENDA' | 'DOMICILIO'>('DOMICILIO');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('z1');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Datos del Cliente
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    colony: '',
    postalCode: '',
    deliveryDate: '',
    deliveryTimeSlot: '11:00 AM - 01:00 PM',
    notes: '',
  });

  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeZone = zonasDisponibles.find((z) => z.id === selectedZoneId);
  const deliveryFee = deliveryMethod === 'RECOGER_EN_TIENDA' ? 0 : (activeZone?.cost || 65);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'DULCEDALIA') {
      setDiscountPercent(10);
      setCouponMessage('¡Cupón DULCEDALIA aplicado! 10% de descuento ♡');
    } else {
      setCouponMessage('Cupón no válido para esta fecha.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Tu canasta está vacía.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryDate) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    // Generar número de pedido real
    const generatedOrderNum = `DALIA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(generatedOrderNum);
    setIsOrderSubmitted(true);
    clearCart();
  };

  if (isOrderSubmitted) {
    return (
      <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-dalia-blush flex items-center justify-center mx-auto text-dalia-strawberry">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-dalia-chocolate">
          ¡Muchas gracias por tu pedido!
        </h1>

        <p className="font-serif text-xl text-dalia-strawberry font-bold">
          Pedido Nº {orderNumber}
        </p>

        <div className="p-6 bg-white rounded-dalia-lg border border-dalia-rose/30 shadow-paper text-left text-xs text-dalia-cocoa space-y-2">
          <p><strong>Cliente:</strong> {formData.name}</p>
          <p><strong>Correo:</strong> {formData.email}</p>
          <p><strong>Teléfono:</strong> {formData.phone}</p>
          <p><strong>Método de Entrega:</strong> {deliveryMethod === 'DOMICILIO' ? `A domicilio (${activeZone?.name})` : 'Recoger en obrador (Calle 0 #205 A, Col. Enrique Cárdenas González, Tampico)'}</p>
          <p><strong>Fecha Programada:</strong> {formData.deliveryDate} ({formData.deliveryTimeSlot})</p>
          <p><strong>Total:</strong> {formatCurrency(total)}</p>
        </div>

        {/* Tarjeta Oficial de Datos Bancarios / Transferencia */}
        <div className="p-4 bg-white rounded-2xl border border-dalia-rose/40 shadow-sm max-w-md mx-auto space-y-3">
          <span className="text-[11px] font-bold text-dalia-chocolate uppercase tracking-wider block">
            Datos de Pago Oficiales Dalia Repostería:
          </span>
          <div className="relative w-full h-56 rounded-xl overflow-hidden border border-dalia-rose/30 shadow-inner bg-dalia-vanilla">
            <img
              src="/assets/logos/info_pago.jpg"
              alt="Datos de pago y transferencia Dalia Repostería"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-dalia-cocoa/80 font-light">
            Puedes realizar tu transferencia o depósito y enviar tu comprobante a nuestro WhatsApp para iniciar el horneado de inmediato.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/528333186010?text=Hola%20Dalia%20Reposter%C3%ADa!%20Acabo%20de%20hacer%20el%20pedido%20${orderNumber}%20por%20un%20total%20de%20$${total}%20a%20nombre%20de%20${encodeURIComponent(formData.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Enviar Comprobante por WhatsApp</span>
          </a>
          <Link
            href="/tienda"
            className="w-full sm:w-auto px-6 py-3 bg-dalia-chocolate hover:bg-dalia-strawberry text-white rounded-full text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Ver más creaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 px-6 md:px-16 max-w-6xl mx-auto">
      <Link
        href="/tienda"
        className="inline-flex items-center gap-2 text-xs font-semibold text-dalia-strawberry hover:text-dalia-chocolate uppercase tracking-wider mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Seguir eligiendo antojos</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Columna Izquierda: Formulario de Checkout y Entregas */}
        <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-dalia-lg border border-dalia-rose/30 shadow-paper">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dalia-chocolate mb-2">
            Finalizar tu Pedido
          </h1>
          <p className="text-xs text-dalia-cocoa/70 mb-8">
            Ingresa tus datos para agendar la preparación artesanal de tus postres.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Método de Entrega */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                1. Método de Entrega *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('DOMICILIO')}
                  className={`p-4 rounded-dalia-sm border text-left flex items-center gap-3 transition-all ${
                    deliveryMethod === 'DOMICILIO'
                      ? 'bg-dalia-blush/80 border-dalia-strawberry shadow-sm'
                      : 'bg-dalia-vanilla/40 border-dalia-rose/30'
                  }`}
                >
                  <Truck className="w-5 h-5 text-dalia-strawberry" />
                  <div>
                    <span className="block text-xs font-bold text-dalia-chocolate">A Domicilio</span>
                    <span className="block text-[10px] text-dalia-cocoa/70">Zonas seleccionadas</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('RECOGER_EN_TIENDA')}
                  className={`p-4 rounded-dalia-sm border text-left flex items-center gap-3 transition-all ${
                    deliveryMethod === 'RECOGER_EN_TIENDA'
                      ? 'bg-dalia-blush/80 border-dalia-strawberry shadow-sm'
                      : 'bg-dalia-vanilla/40 border-dalia-rose/30'
                  }`}
                >
                  <Store className="w-5 h-5 text-dalia-strawberry" />
                  <div>
                    <span className="block text-xs font-bold text-dalia-chocolate">Recoger en Obrador</span>
                    <span className="block text-[10px] text-dalia-cocoa/70">Calle 0 #205 A, Tampico</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Zonas de Entrega si es a domicilio */}
            {deliveryMethod === 'DOMICILIO' && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-2">
                  Selecciona tu Zona de Entrega
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/40 text-xs font-medium focus:border-dalia-strawberry focus:outline-none"
                >
                  {zonasDisponibles.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — Envío: {formatCurrency(z.cost)} ({z.estimatedTime})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Datos Personales */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                2. Datos de Contacto *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Correo Electrónico *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono / WhatsApp (10 dígitos) *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de Entrega si aplica */}
            {deliveryMethod === 'DOMICILIO' && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                  3. Dirección de Entrega *
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Calle *"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="col-span-2 p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Núm. Ext/Int *"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Colonia *"
                      value={formData.colony}
                      onChange={(e) => setFormData({ ...formData, colony: e.target.value })}
                      className="p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Código Postal *"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fecha y Horario de Entrega */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                {deliveryMethod === 'DOMICILIO' ? '4.' : '3.'} Fecha y Horario Deseado *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
                />

                <select
                  value={formData.deliveryTimeSlot}
                  onChange={(e) => setFormData({ ...formData, deliveryTimeSlot: e.target.value })}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs font-medium focus:border-dalia-strawberry focus:outline-none"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM — 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM — 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM — 04:00 PM</option>
                  <option value="04:00 PM - 06:30 PM">04:00 PM — 06:30 PM</option>
                </select>
              </div>
            </div>

            {/* Notas Especiales */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-1.5">
                Notas especiales o alergias
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Tocar timbre 201, o si es para sorpresa sin ticket..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/30 text-xs focus:border-dalia-strawberry focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-dalia-chocolate hover:bg-dalia-strawberry text-white font-semibold text-xs uppercase tracking-widest rounded-full transition-colors shadow-paper"
            >
              Confirmar y Registrar Pedido ({formatCurrency(total)})
            </button>
          </form>
        </div>

        {/* Columna Derecha: Resumen del Pedido */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-dalia-lg border border-dalia-rose/30 shadow-paper sticky top-28 space-y-6">
          <h2 className="font-serif text-xl font-bold text-dalia-chocolate border-b border-dalia-rose/20 pb-3">
            Resumen de tu Antojo
          </h2>

          <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-dalia-rose/20">
            {items.map((item) => (
              <div key={item.cartId} className="pt-3 flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-dalia-chocolate block">
                    {item.quantity}x {item.name}
                  </span>
                  {item.selectedVariant && (
                    <span className="text-[10px] text-dalia-strawberry block">
                      {item.selectedVariant}
                    </span>
                  )}
                  {item.isCustomCake && item.customCakeDetails && (
                    <span className="text-[10px] text-dalia-cocoa/70 block">
                      {item.customCakeDetails.spongeFlavor} · {item.customCakeDetails.filling}
                    </span>
                  )}
                </div>
                <span className="font-serif font-bold text-dalia-chocolate">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Cupón de Descuento */}
          <div className="pt-2 border-t border-dalia-rose/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-dalia-cocoa/70 block mb-1.5">
              ¿Tienes un cupón dulce?
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: DULCEDALIA"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 p-2.5 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/40 text-xs focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="px-4 py-2 bg-dalia-blush hover:bg-dalia-strawberry hover:text-white text-dalia-chocolate rounded-dalia-sm text-xs font-semibold uppercase transition-colors"
              >
                Aplicar
              </button>
            </div>
            {couponMessage && (
              <p className="text-[11px] text-dalia-strawberry mt-1 font-medium">{couponMessage}</p>
            )}
          </div>

          {/* Totales */}
          <div className="space-y-2.5 pt-4 border-t border-dalia-rose/30 text-xs">
            <div className="flex justify-between text-dalia-cocoa">
              <span>Subtotal</span>
              <span className="font-semibold text-dalia-chocolate">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-dalia-strawberry font-semibold">
                <span>Descuento (10%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-dalia-cocoa">
              <span>Envío ({deliveryMethod === 'DOMICILIO' ? activeZone?.name : 'Recoger en tienda'})</span>
              <span className="font-semibold text-dalia-chocolate">
                {deliveryFee === 0 ? 'Gratis' : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-dalia-chocolate border-t border-dalia-rose/20 pt-3">
              <span>Total a Pagar</span>
              <span className="font-serif text-2xl text-dalia-chocolate">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
