import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Named export 'supabase' expected by your dashboard components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper export in case createClient is imported directly elsewhere
export { createClient };

// Default export fallback
export default supabase;