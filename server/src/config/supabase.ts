import { createClient } from "@supabase/supabase-js";
import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() });

if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not defined");
}
if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not defined");
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
