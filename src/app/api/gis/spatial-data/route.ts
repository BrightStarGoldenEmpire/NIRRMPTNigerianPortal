import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized access to GIS engine' }, { status: 401 });
  }

  const role = user.user_metadata?.role;
  if (!['STAFF_FIELD_DESK', 'DIRECTORATE_OPS', 'SUPER_ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Gated GIS spatial layer requires cleared credentials' }, { status: 403 });
  }

  const prisma = new PrismaClient();

  try {
    const resources = await prisma.regenerativeResource.findMany();

    const geoJson = {
      type: 'FeatureCollection',
      features: resources.map((res: any) => ({
        type: 'Feature',
        geometry: res.coordinates || { type: 'Point', coordinates: [0, 0] },
        properties: {
          id: res.id,
          name: res.name,
          category: res.category,
        },
      })),
    };

    return NextResponse.json({ success: true, layerData: geoJson });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}