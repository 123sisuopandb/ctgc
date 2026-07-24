// ============================================
// SUPABASE CONFIGURATION
// REAL Authentication & Database Setup
// ============================================
//
// ⚠️ INSTRUCTIONS TO ENABLE REAL AUTH:
//
// 1. Go to https://supabase.com (FREE)
// 2. Create account / Sign in
// 3. Click "New Project"
// 4. Choose organization, name your project (e.g., "crypto-forum")
// 5. Wait for project to be ready (1-2 minutes)
// 6. Go to Settings (gear icon) → API
// 7. Copy:
//    - Project URL (looks like: https://xxxxx.supabase.co)
//    - anon public key (long string starting with eyJ...)
// 8. Paste them below
//
// 📌 OPTIONAL - Enable Google/GitHub OAuth:
// - Go to Authentication → Providers
// - Enable Google → Add your Google OAuth credentials
// - Enable GitHub → Add your GitHub OAuth credentials
//
// 🔒 SECURITY NOTE:
// The anon key is SAFE to expose in client-side code.
// It's designed for public use with Row Level Security.
// ============================================

const SUPABASE_CONFIG = {
    // ====== PASTE YOUR CREDENTIALS HERE ======
    
    // Your Supabase Project URL
    URL: 'YOUR_SUPABASE_URL_HERE',  // e.g., 'https://abcdefghijk.supabase.co'
    
    // Your Supabase Anon Public Key
    ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',  // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    
    // ==========================================
};

// ============================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================

// Check if configuration is set
function isSupabaseConfigured() {
    return SUPABASE_CONFIG.URL !== 'YOUR_SUPABASE_URL_HERE' && 
           SUPABASE_CONFIG.ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE';
}

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured. Using demo mode.');
        return null;
    }
    
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
        console.log('✅ Supabase client initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// Export for use in main app
window.SupabaseConfig = {
    isConfigured: isSupabaseConfigured,
    init: initSupabase,
    getClient: () => supabaseClient,
    config: SUPABASE_CONFIG
};
