# CryptographyTube Community Forum

## 🚀 REAL Authentication with Supabase (or Demo Mode)

This forum supports **TWO modes**:

### 1️⃣ **REAL Authentication Mode** (Recommended)
Uses **Supabase** - Free, secure, real database & auth

### 2️⃣ **Demo Mode** (Works out of the box)
Uses **localStorage** - No setup needed, data in browser only

---

## 📋 SETUP INSTRUCTIONS FOR REAL AUTH

### Step 1: Create Free Supabase Account
1. Go to **https://supabase.com**
2. Click "Start your project" or "Sign Up"
3. Use GitHub/Google account for quick signup

### Step 2: Create New Project
1. Click **"New Project"**
2. Name: `crypto-forum` (or any name)
3. Database password: Generate a strong one
4. Region: Choose nearest to you
5. Click **"Create new project"** (wait 1-2 minutes)

### Step 3: Get API Credentials
1. Go to **Settings** ⚙️ (gear icon)
2. Click **"API"** in sidebar
3. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

### Step 4: Configure Forum
1. Open `js/supabase-config.js` file
2. Paste your credentials:
```javascript
const SUPABASE_CONFIG = {
    URL: 'YOUR_COPIED_URL_HERE',
    ANON_KEY: 'YOUR_COPIED_ANON_KEY_HERE'
};
```

### Step 5: Enable Email Auth (Already enabled by default!)
- Email/password auth works automatically!
- Users can register and login with real emails

### Step 6: (Optional) Enable Google/GitHub OAuth
1. In Supabase Dashboard → **Authentication** → **Providers**
2. **For Google:**
   - Enable "Google"
   - Get credentials from https://console.cloud.google.com
   - Add Client ID and Secret
3. **For GitHub:**
   - Enable "GitHub"
   - Get credentials from https://github.com/settings/developers
   - Add Client ID and Secret
4. Set redirect URL: `https://your-domain.com/community-forum/index.html`

### Step 7: Create Database Tables
Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email',
    bio TEXT DEFAULT 'New member of CryptographyTube Community',
    post_count INTEGER DEFAULT 0,
    likes_received INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT DEFAULT 'discussion',
    tags TEXT[],
    author_id UUID REFERENCES profiles(id),
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id),
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    likes INTEGER DEFAULT 0
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow read/write for authenticated users)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Replies are viewable by everyone" ON replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON replies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Chat is viewable by everyone" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can chat" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 📁 FILE STRUCTURE

```
community-forum/
├── index.html              # Main forum page
├── css/
│   └── style.css           # All styles (responsive)
├── js/
│   ├── supabase-config.js  # 🔑 YOUR CONFIGURATION HERE
│   └── forum-app.js        # Main application logic
└── README.md               # This file
```

---

## ✨ FEATURES

### Real Auth Mode (Supabase)
- ✅ **Real Email/Password Registration**
- ✅ **Real Email/Password Login**
- ✅ **Real Google OAuth Login**
- ✅ **Real GitHub OAuth Login**
- ✅ **Real PostgreSQL Database**
- ✅ **Data persists across devices**
- ✅ **Secure with Row Level Security**

### Demo Mode (localStorage)
- ✅ Works without any setup
- ✅ Pre-loaded sample data
- ✅ Full functionality offline
- ✅ Data stays in browser only

---

## 🔧 DEMO ACCOUNTS (For Testing Demo Mode)

| Username | Password | Role |
|----------|----------|------|
| Sisujhon | admin123 | Admin |
| CryptoMaster99 | demo123 | Expert |
| EthDev_Pro | demo123 | Developer |
| BlockchainNinja | demo123 | Member |
| SecurityGuru | demo123 | Expert |

---

## 🌐 DEPLOYMENT

### GitHub Pages
1. Upload entire `community-forum/` folder to your repo
2. Access at: `https://username.github.io/repo/community-forum/index.html`

### cPanel / Any Hosting
1. Upload via File Manager or FTP
2. Works on ANY static hosting!

---

## ❓ TROUBLESHOOTING

### "Supabase not configured" message
→ Edit `js/supabase-config.js` with your credentials

### Registration not working
→ Check Supabase project is active
→ Check email auth is enabled in dashboard

### Google/GitHub login not working
→ Need to set up OAuth credentials first
→ See Step 6 above

### Data not saving
→ In demo mode: Data is browser-only
→ For persistent storage: Configure Supabase

---

## 📞 SUPPORT

Created by **Sisujhon** for CryptographyTube Community

🔗 Main Site: [Your CryptographyTube Link]
💬 Forum: This forum!

---

## 📄 LICENSE

Free to use for personal and commercial projects.
