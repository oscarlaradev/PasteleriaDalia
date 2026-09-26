'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Calendar, Heart, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import { CakeSizeOption, SpongeFlavor, FillingFlavor, FrostingType, CakeDecoration, CustomCakeState } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SizePrice {
  size: CakeSizeOption;
  persons: number;
  basePrice: number;
}

const sizes: SizePrice[] = [
  { size: '6 personas', persons: 6, basePrice: 420 },
  { size: '10 personas', persons: 10, basePrice: 620 },
  { size: '15 personas', persons: 15, basePrice: 850 },
  { size: '20 personas', persons: 20, basePrice: 1100 },
  { size: '30 personas', persons: 30, basePrice: 1550 },
];

const spongeFlavors: { name: SpongeFlavor; note: string; extra: number }[] = [
  { name: 'Vainilla natural', note: 'Esponjoso tradicional de la casa', extra: 0 },
  { name: 'Chocolate belga', note: 'Bizcocho húmedo de cacao intenso', extra: 40 },
  { name: 'Red velvet', note: 'Color rubí suave con toque de cacao', extra: 50 },
];

const fillings: { name: FillingFlavor; note: string; extra: number }[] = [
  { name: 'Chocolate Chantilly', note: 'Crema suave de chocolate', extra: 0 },
  { name: 'Mermelada Fresa - Piña', note: 'Fruta cocinada en almíbar casero', extra: 0 },
  { name: 'Cajeta artesanal', note: 'Dulce de leche tradicional suave', extra: 30 },
  { name: 'Crema Pastelera', note: 'Vainilla suave con consistencia sedosa', extra: 25 },
  { name: 'Especial Plátano con Canela', note: 'Queso crema, mantequilla, plátano y canela', extra: 50 },
  { name: 'Especial Zanahoria con Nuez & Piña', note: 'Queso crema, nuez picada, piña y coco', extra: 55 },
];

const frostings: { name: FrostingType; note: string; extra: number }[] = [
  { name: 'Buttercream suizo', note: 'Sedoso, poco dulce y muy estable', extra: 0 },
  { name: 'Chocolate fudge', note: 'Denso, brillante y achocolatado', extra: 45 },
  { name: 'Crema montada ligera', note: 'Estilo chantilly fresco y aireado', extra: 0 },
];

const decorations: { name: CakeDecoration; note: string; extra: number }[] = [
  { name: 'Minimalista', note: 'Espatulado limpio y toques dorados', extra: 0 },
  { name: 'Flores comestibles', note: 'Ramillete fresco de dalias orgánicas', extra: 90 },
  { name: 'Frutas frescas', note: 'Fresas, frambuesas y zarzamoras', extra: 85 },
  { name: 'Cumpleaños festivo', note: 'Velas artesanales, confeti y lazo', extra: 60 },
  { name: 'Temática personalizada', note: 'Diseño exclusivo según tu referencia', extra: 160 },
];

interface CustomCakeBuilderProps {
  onAddToCart?: (cake: CustomCakeState) => void;
}

export function CustomCakeBuilder({ onAddToCart }: CustomCakeBuilderProps) {
  const [selectedSize, setSelectedSize] = useState<CakeSizeOption>('10 personas');
  const [selectedSponge, setSelectedSponge] = useState<SpongeFlavor>('Vainilla natural');
  const [selectedFilling, setSelectedFilling] = useState<FillingFlavor>('Compota de fresa');
  const [selectedFrosting, setSelectedFrosting] = useState<FrostingType>('Buttercream suizo');
  const [selectedDecoration, setSelectedDecoration] = useState<CakeDecoration>('Flores comestibles');
  const [customText, setCustomText] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  // Cálculo Dinámico en Vivo
  const sizeObj = sizes.find((s) => s.size === selectedSize) || sizes[1];
  const spongeObj = spongeFlavors.find((s) => s.name === selectedSponge) || spongeFlavors[0];
  const fillingObj = fillings.find((f) => f.name === selectedFilling) || fillings[0];
  const frostingObj = frostings.find((f) => f.name === selectedFrosting) || frostings[0];
  const decoObj = decorations.find((d) => d.name === selectedDecoration) || decorations[1];

  const calculatedPrice =
    sizeObj.basePrice + spongeObj.extra + fillingObj.extra + frostingObj.extra + decoObj.extra;

  const handleAdd = () => {
    if (!eventDate) {
      alert('Por favor selecciona la fecha deseada para tu evento.');
      return;
    }

    const cakeState: CustomCakeState = {
      size: selectedSize,
      spongeFlavor: selectedSponge,
      filling: selectedFilling,
      frosting: selectedFrosting,
      decoration: selectedDecoration,
      customText,
      eventDate,
      quantity: 1,
      specialNotes,
      calculatedPrice,
    };

    if (onAddToCart) {
      onAddToCart(cakeState);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola Dalia Repostería! 🌸\n` +
      `He personalizado mi pastel en su página web y quiero hacer el pedido:\n\n` +
      `🎂 *PASTEL PERSONALIZADO*\n` +
      `• Tamaño: ${selectedSize}\n` +
      `• Bizcocho: ${selectedSponge}\n` +
      `• Relleno: ${selectedFilling}\n` +
      `• Cobertura: ${selectedFrosting}\n` +
      `• Decoración: ${selectedDecoration}\n` +
      `• Dedicatoria / Texto: "${customText || 'Sin texto'}"\n` +
      `• Fecha del evento: ${eventDate || 'Por acordar'}\n` +
      (specialNotes ? `• Notas adicionales: ${specialNotes}\n` : '') +
      `\n💰 Inversión estimada: $${calculatedPrice} MXN\n` +
      `📍 Entrega/Retiro: Tampico (Calle 0 #205 A, Col. Enrique Cárdenas González)\n\n` +
      `¿Tienen disponibilidad en agenda para esta fecha? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/528333186010?text=${text}`, '_blank');
  };

  return (
    <section
      id="personalizador"
      aria-label="Configurador de pastel personalizado"
      className="py-16 md:py-24 px-6 md:px-16 bg-[#FFFDF9] text-dalia-chocolate border-t border-dalia-rose/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-dalia-blush rounded-full text-xs font-semibold text-dalia-strawberry uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diseño a tu Medida</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Tu pastel, a tu <span className="italic font-normal text-dalia-strawberry">manera</span>
          </h2>
          <p className="text-dalia-cocoa/80 text-sm md:text-base font-light leading-relaxed">
            Elige cada textura, sabor y detalle floral. Horneamos cada pedido bajo demanda para asegurar máxima frescura.
          </p>
        </div>

        {/* Layout en 2 Columnas: Selectores + Resumen Visual Dinámico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Controles de Selección */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 md:p-10 rounded-dalia-lg border border-dalia-rose/30 shadow-paper">
            {/* 1. Tamaño */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                1. Tamaño y Porciones
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`p-3 text-left rounded-dalia-sm border transition-all ${
                      selectedSize === s.size
                        ? 'bg-dalia-blush/80 border-dalia-strawberry shadow-sm font-semibold'
                        : 'bg-dalia-vanilla/40 border-dalia-rose/25 hover:border-dalia-rose'
                    }`}
                  >
                    <span className="block text-xs font-bold text-dalia-chocolate">{s.size}</span>
                    <span className="block text-[11px] text-dalia-cocoa/70">{s.persons} porciones</span>
                    <span className="block text-xs font-serif font-bold text-dalia-strawberry mt-1">
                      {formatCurrency(s.basePrice)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Bizcocho */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                2. Sabor del Bizcocho
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {spongeFlavors.map((sp) => (
                  <button
                    key={sp.name}
                    type="button"
                    onClick={() => setSelectedSponge(sp.name)}
                    className={`p-3 text-left rounded-dalia-sm border transition-all ${
                      selectedSponge === sp.name
                        ? 'bg-dalia-blush/80 border-dalia-strawberry shadow-sm'
                        : 'bg-dalia-vanilla/40 border-dalia-rose/25 hover:border-dalia-rose'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-dalia-chocolate">{sp.name}</span>
                      {sp.extra > 0 && (
                        <span className="text-[10px] text-dalia-strawberry font-semibold">
                          +{formatCurrency(sp.extra)}
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] text-dalia-cocoa/70">{sp.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Relleno */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-3">
                3. Relleno Artesanal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fillings.map((fil) => (
                  <button
                    key={fil.name}
                    type="button"
                    onClick={() => setSelectedFilling(fil.name)}
                    className={`p-3 text-left rounded-dalia-sm border transition-all ${
                      selectedFilling === fil.name
                        ? 'bg-dalia-blush/80 border-dalia-strawberry shadow-sm'
                        : 'bg-dalia-vanilla/40 border-dalia-rose/25 hover:border-dalia-rose'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-dalia-chocolate">{fil.name}</span>
                      {fil.extra > 0 && (
                        <span className="text-[10px] text-dalia-strawberry font-semibold">
                          +{formatCurrency(fil.extra)}
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] text-dalia-cocoa/70">{fil.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Cobertura & Decoración */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-2">
                  4. Cobertura
                </label>
                <select
                  value={selectedFrosting}
                  onChange={(e) => setSelectedFrosting(e.target.value as FrostingType)}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/50 text-xs font-medium focus:border-dalia-strawberry focus:outline-none"
                >
                  {frostings.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} {f.extra > 0 ? `(+${formatCurrency(f.extra)})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-2">
                  5. Estilo de Decoración
                </label>
                <select
                  value={selectedDecoration}
                  onChange={(e) => setSelectedDecoration(e.target.value as CakeDecoration)}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/50 text-xs font-medium focus:border-dalia-strawberry focus:outline-none"
                >
                  {decorations.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} {d.extra > 0 ? `(+${formatCurrency(d.extra)})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Texto y Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-1.5">
                  Mensaje escrito sobre el pastel
                </label>
                <input
                  type="text"
                  placeholder="Ej: ¡Feliz cumple Sofi! ♡"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/40 text-xs placeholder:text-dalia-cocoa/40 focus:border-dalia-strawberry focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-dalia-chocolate mb-1.5">
                  Fecha de tu Evento *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-3 rounded-dalia-sm border border-dalia-rose/30 bg-dalia-vanilla/40 text-xs focus:border-dalia-strawberry focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta de Resumen Visual Dinámico */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white p-7 rounded-dalia-lg border border-dalia-rose/40 shadow-paper-lg relative overflow-hidden">
              <div className="relative h-48 w-full rounded-dalia-sm overflow-hidden mb-5 border border-dalia-rose/20">
                <Image
                  src={
                    selectedDecoration === 'Minimalista'
                      ? '/assets/productos_reales/blanco-cumpleanos_1.jpg'
                      : selectedDecoration === 'Flores comestibles'
                      ? '/assets/productos_reales/flores-cute_1.jpg'
                      : selectedDecoration === 'Frutas frescas'
                      ? '/assets/productos_reales/mariposas_1.jpg'
                      : selectedDecoration === 'Cumpleaños festivo'
                      ? '/assets/productos_reales/cumpleanos-chispas_1.jpg'
                      : '/assets/productos_reales/dragon-ball_1.jpg'
                  }
                  alt="Previsualización de pastel artesanal Dalia"
                  fill
                  className="object-cover transition-all duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-dalia-chocolate border border-dalia-rose/30 shadow-sm">
                  {selectedDecoration}
                </div>
              </div>

              <div className="space-y-3 pb-5 border-b border-dalia-rose/30">
                <span className="text-[10px] font-bold tracking-widest text-dalia-strawberry uppercase block">
                  Resumen de tu Creación:
                </span>
                <div className="flex justify-between text-xs">
                  <span className="text-dalia-cocoa/70">Tamaño:</span>
                  <span className="font-bold text-dalia-chocolate">{selectedSize}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dalia-cocoa/70">Bizcocho:</span>
                  <span className="font-bold text-dalia-chocolate">{selectedSponge}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dalia-cocoa/70">Relleno:</span>
                  <span className="font-bold text-dalia-chocolate">{selectedFilling}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dalia-cocoa/70">Cobertura:</span>
                  <span className="font-bold text-dalia-chocolate">{selectedFrosting}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dalia-cocoa/70">Decoración:</span>
                  <span className="font-bold text-dalia-chocolate">{selectedDecoration}</span>
                </div>
                {customText && (
                  <div className="p-2.5 bg-dalia-blush/60 rounded-lg">
                    <span className="text-[10px] font-semibold text-dalia-strawberry block">Dedicatoria:</span>
                    <p className="font-handwritten text-lg text-dalia-chocolate">&ldquo;{customText}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Precio Dinámico Total */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-dalia-cocoa/60 block">
                    Inversión Total Estimada:
                  </span>
                  <span className="font-serif text-3xl font-bold text-dalia-chocolate">
                    {formatCurrency(calculatedPrice)}
                  </span>
                </div>
              </div>

              {/* Botón de Acción Principal a WhatsApp */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-4 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all shadow-paper hover:shadow-paper-lg active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Pedir este Pastel por WhatsApp</span>
                </button>
                <p className="text-[11px] text-center text-dalia-cocoa/70 font-light pt-1">
                  Te responderemos de inmediato para confirmar fecha, horario y método de entrega en Tampico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
