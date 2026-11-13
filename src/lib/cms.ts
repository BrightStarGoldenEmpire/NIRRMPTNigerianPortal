import { prisma } from "@/lib/prisma";

/**
 * Retrieves dynamic content from Supabase.
 * Returns default fallback string if record is missing or database is warming up.
 */
export async function getSiteContent(key: string, fallback: string): Promise<string> {
  try {
    const item = await prisma.siteContent.findUnique({
      where: { key },
      select: { value: true },
    });
    return item?.value?.trim() || fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Returns all CMS content items mapped by key.
 */
export async function getAllSiteContent(): Promise<Record<string, string>> {
  try {
    const items = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    for (const item of items) {
      map[item.key] = item.value;
    }
    return map;
  } catch (error) {
    return {};
  }
}