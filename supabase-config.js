// supabase-config.js
// Configuration for connecting "Pediatric Dental World" to your Supabase backend.
// Replace the placeholders below with your actual Supabase Project URL and Publishable API Key (anon public).
// You can find these in your Supabase dashboard under: Settings -> API.

const SUPABASE_URL = "https://your-project-id.supabase.co"; 
const SUPABASE_ANON_KEY = "your-anon-public-api-key-here";

// Initialize the Supabase Client
let supabaseClient = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && 
      !SUPABASE_URL.includes("your-project-id") && 
      !SUPABASE_ANON_KEY.includes("your-anon-public")) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized successfully!");
  } else {
    console.warn("Supabase is running in DEMO MODE (placeholder credentials). Submissions will be simulated locally.");
  }
} catch (error) {
  console.error("Failed to initialize Supabase client. Make sure the Supabase CDN is loaded:", error);
}

// Make variables globally available for our pages
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.supabaseClient = supabaseClient;
