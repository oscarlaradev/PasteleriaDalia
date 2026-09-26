import { NextRequest, NextResponse } from 'next/server';
import { getSiteContentData, saveSiteContentData } from '@/lib/cmsData';

export async function GET() {
  const content = getSiteContentData();
  return NextResponse.json({ success: true, content });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ok = saveSiteContentData(body);
    if (!ok) {
      return NextResponse.json({ error: 'No se pudieron guardar las frases o ajustes del sitio.' }, { status: 500 });
    }

    const updated = getSiteContentData();
    return NextResponse.json({
      success: true,
      content: updated,
      message: 'Frases y configuración del sitio actualizadas correctamente.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error al actualizar el contenido del sitio.' },
      { status: 500 }
    );
  }
}
