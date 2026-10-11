import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

export async function runDailyBackup() {
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupsDir, `nirrmpt_backup_${timestamp}.json`);

  console.log(`[BACKUP ENGINE] Initiating Prisma database snapshot to: ${backupPath}`);

  try {
    const modelNames = Object.keys(prisma).filter(
      (key) => !key.startsWith('_') && typeof (prisma as any)[key]?.findMany === 'function'
    );

    const dbDump: Record<string, any> = {
      timestamp: new Date().toISOString(),
      data: {}
    };

    for (const model of modelNames) {
      console.log(`[BACKUP ENGINE] Exporting table: ${model}...`);
      dbDump.data[model] = await (prisma as any)[model].findMany();
    }

    fs.writeFileSync(backupPath, JSON.stringify(dbDump, null, 2), 'utf-8');
    console.log('[BACKUP ENGINE SUCCESS] Database JSON snapshot created successfully!');
  } catch (error: any) {
    console.error('[BACKUP ENGINE ERROR] Backup failed:', error?.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

runDailyBackup();