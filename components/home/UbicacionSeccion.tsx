'use client';

import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from 'lucide-react';

export function UbicacionSeccion() {
  const fullAddress = 'Calle 0 #205 A, Col. Enrique Cárdenas González, 89309 Tampico, Tamps., México';
  const googleMapsUrl = 'https://maps.app.goo.gl/CYCMEUSUKLMjEZDN8';
  const streetViewUrl = 'https://maps.app.goo.gl/nkALU5mLjGfabw53A';
  const embedMapsUrl = 'https://maps.google.com/maps?q=22.3089022,-97.8576454&hl=es&z=17&output=embed';

  return (
    <section
      id="ubicacion"
      aria-label="Ubicación y horarios de Dalia Repostería"
      className="py-20 px-6 md:px-16 bg-white text-dalia-chocolate border-t border-dalia-rose/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Columna de Datos de Contacto */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-dalia-blush rounded-full text-xs font-semibold text-dalia-strawberry uppercase tracking-wider">
              <span>📍</span>
              <span>Nuestro Obrador</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
              Ven a <span className="italic font-normal text-dalia-strawberry">visitarnos</span>
            </h2>

            <p className="text-dalia-cocoa/80 text-sm md:text-base font-light leading-relaxed">
              El aroma a mantequilla y café fresco te recibirá al entrar. Ven por una rebanada o a recoger tus pedidos especiales agendados en nuestro taller de horneado.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-dalia-strawberry flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-dalia-chocolate block">
                    Dirección del Obrador
                  </span>
                  <p className="text-sm font-medium text-dalia-chocolate">
                    Calle 0 #205 A, Col. Enrique Cárdenas González
                  </p>
                  <p className="text-xs text-dalia-cocoa">
                    89309 Tampico, Tamps., México. (Cobertura: Tampico, Cd. Madero y Altamira)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-dalia-strawberry flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-dalia-chocolate block">
                    Horario de Atención
                  </span>
                  <p className="text-xs text-dalia-cocoa">
                    Martes a Sábado: 9:00 AM — 7:30 PM<br />
                    Domingos: 10:00 AM — 5:00 PM (Lunes horneamos a puerta cerrada)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-dalia-strawberry flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-dalia-chocolate block">
                    Teléfono & WhatsApp del Obrador
                  </span>
                  <p className="text-xs text-dalia-cocoa">+52 (833) 318-6010</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-dalia-chocolate hover:bg-dalia-strawberry text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shadow-paper"
              >
                <span>Cómo llegar en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={streetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-dalia-blush hover:bg-dalia-rose/50 text-dalia-chocolate text-xs font-semibold rounded-full uppercase tracking-wider transition-colors border border-dalia-rose/40"
              >
                <span>Vista 360° del Obrador</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/528333186010?text=Hola%20Dalia%20Pasteler%C3%ADa%2C%20quiero%20hacer%20un%20pedido%20especial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Escríbenos al 833 318 60 10</span>
              </a>
            </div>
          </div>

          {/* Columna de Mapa Integrado con Ubicación Exacta en Tampico */}
          <div className="lg:col-span-7 h-[360px] md:h-[420px] rounded-dalia overflow-hidden border-2 border-dalia-rose/30 shadow-paper-lg relative">
            <iframe
              title="Mapa de ubicación Dalia Repostería Tampico - Calle 0 #205 A, Col. Enrique Cárdenas González"
              src={embedMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
