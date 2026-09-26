# 🍰 Dulce Aura • Pastelería Casera de Autor

Sitio web boutique de alta gama diseñado para una pastelería artesanal y casera bajo pedido. Inspirado en los más altos estándares visuales de **Awwwards**, con paleta pastel romántica, micro-interacciones fluidas, tipografía cute y elegante, catálogo dinámico y cotizador interactivo con enlace directo a WhatsApp.

---

## ✨ Características Principales

1. **Estética Visual Awwwards & Paleta Pastel**:
   - Tonalidades rosa empolvado (`#FCEEF0`, `#F39EA8`), crema mantequilla (`#FFFDF9`, `#FAF5EE`) y acentos frambuesa y dorados.
   - Tipografía editorial y cute: Google Fonts (*Playfair Display*, *Ephesis* cursiva artesanal y *Plus Jakarta Sans*).
   - Efectos de *glassmorphism*, sombras suaves, tarjetas flotantes y transiciones fluidas.

2. **Hero Section con Carrusel Showcase**:
   - Titular envolvente y emocional con enfoque 100% casero y artesanal.
   - Selector interactivo de diapositivas en tiempo real mostrando pasteles de autor, tartas rústicas, cupcakes gourmet y bento cakes.
   - Badges de confianza flotantes (*4.9/5 estrellas*, *Horneado hoy mismo*, *100% Mantequilla pura*).

3. **Catálogo Rápido con Filtros Instantáneos**:
   - Filtros por categoría: *Todos los Postres*, *Pasteles de Autor*, *Tartas Rústicas*, *Cupcakes Gourmet*, *Bento Cakes (Minis)*.
   - Fichas de producto con selector de porciones y tags de autor.
   - **Modal de Vista Rápida**: Muestra detalles del producto, notas de sabor y botón para pedir directo a WhatsApp con mensaje personalizado.

4. **Configurador Interactivo "Arma tu Pastel Ideal"**:
   - Paso 1: Tamaño y Ocasión (Bento 1-2 pax, Íntimo 6-8 pax, Familiar 12-16 pax, Gran Fiesta 25+ pax).
   - Paso 2: Bizcocho Base (Vainilla Bourbon, Chocolate Belga, Red Velvet, Zanahoria especiada).
   - Paso 3: Relleno Estrella (Frutos Rojos, Ganache Belga, Dulce de Leche con Nuez, Maracuyá Cream).
   - Paso 4: Topping y Decoración (Flores Comestibles & Oro, Fruta Fresca, Macarons, Vintage Piping).
   - **Resumen en Vivo**: Calcula el presupuesto estimado al instante y genera un enlace preconfigurado para enviar la orden desglosada a WhatsApp con un solo clic.

5. **El Taller Casero**:
   - Historia y pilares de calidad: por qué la repostería casera bajo pedido supera a los pasteles industriales de mostrador.
   - Fotografía gastronómica de alta definición de la chef pastelera en su taller.

6. **Reseñas y Experiencias de Clientes**:
   - Muro de testimonios con valoraciones de 5 estrellas, badges de verificación y promedio de satisfacción (4.9 / 5 en +480 pasteles horneados).

7. **Ubicación & Zonas de Entrega**:
   - Explicación del modelo de taller privado con cita previa.
   - Radar de cobertura de envíos con cadena de frío y protocolos de entrega segura.

8. **Preguntas Frecuentes (FAQ)**:
   - Acordeón interactivo con respuestas sobre tiempos de anticipación, métodos de pago, transporte y opciones sin gluten.

9. **Canales de Contacto Directo**:
   - Botón flotante de WhatsApp con indicador de estado *"¡Estamos en línea!"*.
   - Mensajes pre-rellenados inteligentes que facilitan la conversión rápida de clientes.

---

## 🚀 Cómo Visualizar o Ejecutar Localmente

No requiere instalación de frameworks pesados (Vanilla HTML, CSS y JS puro optimizado):

```bash
# Opción 1: Con Python (incorporado en Mac/Linux)
cd /Users/oscaralfredoperezlara/Pasteleria_Web
python3 -m http.server 8080

# Abrir en el navegador:
# http://localhost:8080
```

```bash
# Opción 2: Con Node / npx serve
npx serve .
```

---

## 📱 Configuración del Número de WhatsApp

Para conectar tu propio número de WhatsApp:
1. Abre el archivo [scripts/app.js](file:///Users/oscaralfredoperezlara/Pasteleria_Web/scripts/app.js).
2. Modifica la variable al inicio:
   ```javascript
   const WHATSAPP_PHONE = "5215512345678"; // Coloca tu código de país y número (sin espacios ni guiones)
   ```
3. En [index.html](file:///Users/oscaralfredoperezlara/Pasteleria_Web/index.html), puedes actualizar los enlaces `wa.me/5215512345678` con tu número.
