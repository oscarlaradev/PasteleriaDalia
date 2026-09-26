import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Formatear bytes a formato legible (KB / MB)
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let inputBuffer: Buffer | null = null;
    let originalName = 'imagen';
    let originalBytes = 0;

    // Caso 1: Carga por Archivo (FormData desde laptop o celular)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const urlParam = formData.get('url') as string | null;

      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const arrayBuffer = await file.arrayBuffer();
        inputBuffer = Buffer.from(arrayBuffer);
        originalBytes = file.size;
        originalName = file.name.replace(/\.[^/.]+$/, '');
      } else if (urlParam) {
        // Enlace Web enviado por FormData
        const response = await fetch(urlParam);
        if (!response.ok) {
          return NextResponse.json({ error: 'No se pudo descargar la imagen desde el enlace web.' }, { status: 400 });
        }
        const arrayBuffer = await response.arrayBuffer();
        inputBuffer = Buffer.from(arrayBuffer);
        originalBytes = inputBuffer.length;
        originalName = path.basename(new URL(urlParam).pathname).replace(/\.[^/.]+$/, '') || 'web-image';
      }
    } 
    // Caso 2: Carga por JSON con URL web
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      if (!body.url) {
        return NextResponse.json({ error: 'Debe proporcionar una URL de imagen válida.' }, { status: 400 });
      }
      const response = await fetch(body.url);
      if (!response.ok) {
        return NextResponse.json({ error: 'No se pudo descargar la imagen desde la URL proporcionada.' }, { status: 400 });
      }
      const arrayBuffer = await response.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuffer);
      originalBytes = inputBuffer.length;
      originalName = path.basename(new URL(body.url).pathname).replace(/\.[^/.]+$/, '') || 'web-image';
    }

    if (!inputBuffer) {
      return NextResponse.json({ error: 'No se recibió ningún archivo o URL de imagen.' }, { status: 400 });
    }

    // Procesamiento con sharp: Auto-orientación, tamaño óptimo y compresión WebP sin pérdida de calidad
    const cleanSlug = originalName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'dalia';
    const filename = `dalia-${Date.now()}-${cleanSlug}.webp`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const outputFilePath = path.join(uploadsDir, filename);

    // Optimización WebP de alta fidelidad para repostería artesanal
    const imagePipeline = sharp(inputBuffer)
      .rotate() // Respeta la orientación EXIF de fotos tomadas con celular
      .resize({
        width: 1800,
        height: 1800,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 88, // Fidelidad visual cristalina sin artefactos
        effort: 6,   // Máximo análisis de compresión inteligente
      });

    const metadata = await imagePipeline.metadata();
    const finalBuffer = await imagePipeline.toBuffer();
    fs.writeFileSync(outputFilePath, finalBuffer);

    const finalBytes = finalBuffer.length;
    const savingsPercent = originalBytes > 0 
      ? Math.max(0, Math.round(((originalBytes - finalBytes) / originalBytes) * 100))
      : 0;

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      originalSize: formatBytes(originalBytes),
      optimizedSize: formatBytes(finalBytes),
      savings: `${savingsPercent}%`,
      width: metadata.width,
      height: metadata.height,
      message: 'Imagen convertida a WebP y optimizada automáticamente.',
    });
  } catch (error: any) {
    console.error('Error en optimización WebP:', error);
    return NextResponse.json(
      { error: `Error procesando la imagen: ${error?.message || 'Formato de imagen no compatible'}` },
      { status: 500 }
    );
  }
}
