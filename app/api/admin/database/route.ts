import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  getDbConfig,
  saveDbConfig,
  testMySqlConnection,
  initMySqlSchema,
  syncAllProductsToMySql,
} from '@/lib/db/mysql';
import { getProductsData } from '@/lib/cmsData';

const SCHEMA_FILE = path.join(process.cwd(), 'scripts', 'schema.sql');

export async function GET() {
  const config = getDbConfig();
  const testResult = await testMySqlConnection();
  let schemaSql = '';
  try {
    if (fs.existsSync(SCHEMA_FILE)) {
      schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    }
  } catch {}

  // Ocultar contraseña al enviar al cliente
  const safeConfig = {
    ...config,
    password: config.password ? '••••••••' : '',
    hasPassword: Boolean(config.password),
  };

  return NextResponse.json({
    success: true,
    config: safeConfig,
    status: {
      connected: testResult.success,
      message: testResult.message,
    },
    schemaSql,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'test_connection') {
      const { host, port, user, password, database } = body;
      const testResult = await testMySqlConnection({
        host,
        port: Number(port) || 3306,
        user,
        password,
        database,
      });
      return NextResponse.json(testResult);
    }

    if (action === 'save_config') {
      const { host, port, user, password, database, enabled } = body;
      const updateData: any = {
        host: host || 'localhost',
        port: Number(port) || 3306,
        user: user || 'root',
        database: database || 'dalia_reposteria',
        enabled: Boolean(enabled),
      };
      // Solo actualizar password si no es la máscara
      if (password !== undefined && password !== '••••••••') {
        updateData.password = password;
      }
      const newConfig = saveDbConfig(updateData);
      const testResult = await testMySqlConnection();

      return NextResponse.json({
        success: true,
        message: 'Configuración de MySQL guardada.',
        config: {
          ...newConfig,
          password: newConfig.password ? '••••••••' : '',
          hasPassword: Boolean(newConfig.password),
        },
        connection: testResult,
      });
    }

    if (action === 'init_schema') {
      const initResult = await initMySqlSchema();
      return NextResponse.json(initResult);
    }

    if (action === 'migrate_catalog') {
      // 1. Asegurar esquema
      const schemaInit = await initMySqlSchema();
      if (!schemaInit.success) {
        return NextResponse.json(schemaInit, { status: 400 });
      }

      // 2. Obtener productos actuales
      const products = getProductsData();
      const syncResult = await syncAllProductsToMySql(products);

      return NextResponse.json(syncResult);
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
  } catch (err: any) {
    console.error('Error en /api/admin/database:', err);
    return NextResponse.json({ success: false, message: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
