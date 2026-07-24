// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// REAL Authentication with Supabase
// + LocalStorage Fallback (Demo Mode)
// Author: Sisujhon
// ============================================

// ==================== GLOBAL STATE ====================
const ForumApp = {
    currentUser: null,
    supabase: null,
    useRealAuth: false,
    currentFilter: 'all',
    currentCategory: 'all',
    searchQuery: '',
    
    // Database tables (for Supabase)
    TABLES: {
        PROFILES: 'profiles',
        POSTS: 'posts',
        REPLIES: 'replies',
        LIKES: 'likes',
        CHAT: 'chat_messages'
    }
};

// ==================== TOAST NOTIFICATIONS ====================
const Toast = {
    show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing CryptographyTube Forum...');
    
    // Try to initialize Supabase
    ForumApp.supabase = window.SupabaseConfig?.init();
    ForumApp.useRealAuth = window.SupabaseConfig?.isConfigured() && ForumApp.supabase !== null;
    
    if (ForumApp.useRealAuth) {
        console.log('✅ Using REAL Supabase Authentication & Database');
        document.getElementById('authMode').textContent = '✓ Real Auth • Cloud Database';
        document.getElementById('dbStatusLabel').textContent = 'Supabase DB';
        document.getElementById('chatStorageInfo').textContent = 'Data stored in cloud database';
        
        // Check for existing session
        await checkSupabaseSession();
    } else {
        console.log('⚠️ Using Demo Mode (Local Storage)');
        document.getElementById('authMode').textContent = 'Demo Mode • Local Storage';
        document.getElementById('dbStatusLabel').textContent = 'Local Storage';
        document.getElementById('chatStorageInfo').textContent = 'Data stored in browser only';
        
        // Show config notice
        // document.getElementById('configNotice').classList.remove('hidden');
        
        // Initialize local storage demo
        initLocalStorage();
        checkLocalSession();
    }
    
    setupEventListeners();
    simulateOnlineUsers();
});

// ==================== SUPABASE AUTH FUNCTIONS (REAL) ====================

async function checkSupabaseSession() {
    try {
        const { data: { session }, error } = await ForumApp.supabase.auth.getSession();
        
        if (session && session.user) {
            // Get or create user profile
            const profile = await getOrCreateProfile(session.user);
            if (profile) {
                ForumApp.currentUser = profile;
                showForum(profile);
            }
        } else {
            showAuthSection();
        }
    } catch (error) {
        console.error('Session check error:', error);
        showAuthSection();
    }
}

async function getOrCreateProfile(supabaseUser) {
    try {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await ForumApp.supabase
            .from(ForumApp.TABLES.PROFILES)
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
            
        if (existingProfile) {
            return existingProfile;
        }
        
        // Create new profile
        const newProfile = {
            id: supabaseUser.id,
            username: supabaseUser.user_metadata?.username || 
                       supabaseUser.email?.split('@')[0] || 
                       'User' + Date.now(),
            email: supabaseUser.email,
            avatar_url: supabaseUser.user_metadata?.avatar_url || null,
            provider: supabaseUser.app_metadata?.provider || 'email',
            bio: 'New member of CryptographyTube Community',
            post_count: 0,
            likes_received: 0,
            reputation: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const { data: createdProfile, error: insertError } = await ForumApp.supabase
            .from(ForumApp.TABLES.PROFILES)
            .insert(newProfile)
            .select()
            .single();
            
        if (insertError) throw insertError;
        return createdProfile;
        
    } catch (error) {
        console.error('Profile error:', error);
        return null;
    }
}

// REAL Email/Password Registration
async function emailRegister(event) {
    event.preventDefault();
    
    if (!ForumApp.useRealAuth) {
        demoEmailRegister(event);
        return;
    }
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!validateRegistration(username, email, password, confirmPassword, agreeTerms)) {
        return;
    }

    showAuthLoading(true, 'Creating your account...');

    try {
        // Step 1: Sign up with Supabase Auth
        const { data, error } = await ForumApp.supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) throw error;

        if (data.user) {
            // Check if user needs email confirmation
            if (data.user.identities?.length === 0) {
                showAuthLoading(false);
                Toast.success('✉️ Check your email to confirm your account!');
                return;
            }

            // Auto-login after registration
            const profile = await getOrCreateProfile(data.user);
            if (profile) {
                ForumApp.currentUser = profile;
                showAuthLoading(false);
                Toast.success(`Welcome to the community, ${profile.username}!`);
                showForum(profile);
            }
        }
    } catch (error) {
        showAuthLoading(false);
        handleAuthError(error, 'registration');
    }
}

// REAL Email/Password Login
async function emailLogin(event) {
    event.preventDefault();
    
    if (!ForumApp.useRealAuth) {
        demoEmailLogin(event);
        return;
    }
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        Toast.error('Please fill in all fields');
        return;
    }

    showAuthLoading(true, 'Signing you in...');

    try {
        const { data, error } = await ForumApp.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        if (data.user) {
            const profile = await getOrCreateProfile(data.user);
            if (profile) {
                ForumApp.currentUser = profile;
                
                // Update last login
                await ForumApp.supabase
                    .from(ForumApp.TABLES.PROFILES)
                    .update({ updated_at: new Date().toISOString() })
                    .eq('id', profile.id);
                
                showAuthLoading(false);
                Toast.success(`Welcome back, ${profile.username}!`);
                showForum(profile);
            }
        }
    } catch (error) {
        showAuthLoading(false);
        handleAuthError(error, 'login');
    }
}

// REAL Google OAuth Login
async function googleLogin() {
    if (!ForumApp.useRealAuth) {
        Toast.warning('Configure Supabase to enable Google OAuth');
        return;
    }
    
    showAuthLoading(true, 'Connecting to Google...');

    try {
        const { data, error } = await ForumApp.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href
            }
        });

        if (error) throw error;
        
        // OAuth will redirect - session will be checked on return
        
    } catch (error) {
        showAuthLoading(false);
        handleAuthError(error, 'Google sign-in');
    }
}

// REAL GitHub OAuth Login
async function githubLogin() {
    if (!ForumApp.useRealAuth) {
        Toast.warning('Configure Supabase to enable GitHub OAuth');
        return;
    }
    
    showAuthLoading(true, 'Connecting to GitHub...');

    try {
        const { data, error } = await ForumApp.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.href
            }
        });

        if (error) throw error;
        
        // OAuth will redirect - session will be checked on return
        
    } catch (error) {
        showAuthLoading(false);
        handleAuthError(error, 'GitHub sign-in');
    }
}

// REAL Logout
async function logout() {
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        await ForumApp.supabase.auth.signOut();
    }
    
    ForumApp.currentUser = null;
    
    document.getElementById('forumSection').classList.add('hidden');
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    
    // Clear form inputs
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    Toast.info('You have been logged out');
}

// Handle auth errors
function handleAuthError(error, context) {
    console.error(`${context} error:`, error);
    
    const message = error.message || 'An unexpected error occurred';
    
    if (message.includes('Invalid login credentials')) {
        Toast.error('Invalid email or password');
    } else if (message.includes('already registered')) {
        Toast.error('This email is already registered. Please login.');
    } else if (message.includes('password')) {
        Toast.error('Password must be at least 6 characters');
    } else if (message.includes('email')) {
        Toast.error('Please enter a valid email address');
    } else {
        Toast.error(message);
    }
}

// Validation helper
function validateRegistration(username, email, password, confirmPassword, agreeTerms) {
    if (!username || !email || !password || !confirmPassword) {
        Toast.error('Please fill in all required fields');
        return false;
    }

    if (username.length < 3 || username.length > 30) {
        Toast.error('Username must be 3-30 characters');
        return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        Toast.error('Username can only contain letters, numbers, and underscores');
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Toast.error('Please enter a valid email address');
        return false;
    }

    if (password.length < 6) {
        Toast.error('Password must be at least 6 characters');
        return false;
    }

    if (password !== confirmPassword) {
        Toast.error('Passwords do not match');
        return false;
    }

    if (!agreeTerms) {
        Toast.warning('Please agree to the Community Guidelines');
        return false;
    }

    return true;
}

// ==================== LOCAL STORAGE DEMO MODE ====================
// This runs when Supabase is NOT configured

const LOCAL_DB = {
    KEYS: {
        USERS: 'ct_forum_users_v2',
        POSTS: 'ct_forum_posts_v2',
        CHAT: 'ct_forum_chat_v2',
        CURRENT_USER: 'ct_forum_current_user_v2',
        LIKES: 'ct_forum_likes_v2',
        INITIALIZED: 'ct_forum_initialized_v2'
    },

    init() {
        if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
            this.createDefaultData();
            localStorage.setItem(this.KEYS.INITIALIZED, 'true');
        }
    },

    createDefaultData() {
        const defaultUsers = [
            { id: 'demo_1', username: 'CryptoMaster99', email: 'crypto@example.com', password: 'demo123', bio: 'Forum Admin & Bitcoin Expert', postCount: 5, likesReceived: 150, reputation: 500, createdAt: new Date(Date.now() - 2592000000).toISOString(), provider: 'email' },
            { id: 'demo_2', username: 'EthDev_Pro', email: 'ethdev@example.com', password: 'demo123', bio: 'Ethereum Developer | DeFi Enthusiast', postCount: 12, likesReceived: 89, reputation: 320, createdAt: new Date(Date.now() - 1728000000).toISOString(), provider: 'email' },
            { id: 'demo_3', username: 'BlockchainNinja', email: 'ninja@example.com', password: 'demo123', bio: 'Blockchain Enthusiast', postCount: 8, likesReceived: 45, reputation: 180, createdAt: new Date(Date.now() - 864000000).toISOString(), provider: 'email' },
            { id: 'demo_4', username: 'SecurityGuru', email: 'security@example.com', password: 'demo123', bio: 'Security Researcher | Smart Contract Auditor', postCount: 15, likesReceived: 200, reputation: 450, createdAt: new Date(Date.now() - 432000000).toISOString(), provider: 'email' },
            { id: 'demo_admin', username: 'Sisujhon', email: 'sisujhon@cryptotube.com', password: 'admin123', bio: 'Creator of CryptographyTube | Crypto Tools Developer', postCount: 25, likesReceived: 500, reputation: 1000, createdAt: new Date(Date.now() - 31536000000).toISOString(), provider: 'email', isAdmin: true }
        ];
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(defaultUsers));

        const defaultPosts = [
            {
                id: 'post_1', title: 'Welcome to CryptographyTube Community! 🎉',
                content: 'Hey everyone! Welcome to our brand new community forum!\n\nThis is a place where crypto enthusiasts can:\n- Share knowledge about Bitcoin, Ethereum, and other cryptocurrencies\n- Discuss security best practices\n- Talk about wallets and development\n- Ask questions and get help from experts\n\nFeel free to introduce yourself below!',
                category: 'general', type: 'announcement', tags: ['welcome', 'community'],
                author: 'Sisujhon', authorId: 'demo_admin', createdAt: new Date(Date.now() - 3600000).toISOString(),
                likes: 25, views: 150, pinned: true,
                replies: [
                    { id: 'r1', author: 'CryptoMaster99', content: 'Excited to be here! 🎊', createdAt: new Date(Date.now() - 3000000).toISOString(), likes: 5 },
                    { id: 'r2', author: 'EthDev_Pro', content: 'Thanks for creating this space!', createdAt: new Date(Date.now() - 2400000).toISOString(), likes: 3 }
                ]
            },
            {
                id: 'post_2', title: 'Bitcoin Price Analysis - Next Target $100K? 📈',
                content: 'Looking at the current Bitcoin chart patterns:\n\n**Bullish Signals:**\n- Breaking above key resistance at $65K\n- Increasing institutional adoption\n- ETF inflows remain strong\n\nWhat are your thoughts on BTC price action?',
                category: 'bitcoin', type: 'discussion', tags: ['bitcoin', 'trading'],
                author: 'CryptoMaster99', authorId: 'demo_1', createdAt: new Date(Date.now() - 7200000).toISOString(),
                likes: 42, views: 320, pinned: false,
                replies: [
                    { id: 'r3', author: 'EthDev_Pro', content: 'I think we\'ll see $80K before end of year!', createdAt: new Date(Date.now() - 6000000).toISOString(), likes: 12 }
                ]
            },
            {
                id: 'post_3', title: 'How to Secure Your Crypto Wallet? 🔒',
                content: 'Security is paramount in crypto! Here\'s my comprehensive guide:\n\n## Hardware Wallets\n- Use Ledger or Trezor for large holdings\n- Never share your seed phrase\n\n## Software Security\n- Enable 2FA everywhere\n- Be wary of phishing attempts\n\n**Question:** What security measures do you use?',
                category: 'security', type: 'tutorial', tags: ['security', 'wallet', 'guide'],
                author: 'SecurityGuru', authorId: 'demo_4', createdAt: new Date(Date.now() - 14400000).toISOString(),
                likes: 67, views: 450, pinned: true,
                replies: []
            },
            {
                id: 'post_4', title: 'Ethereum 2.0 Staking Guide for Beginners',
                content: 'Interested in staking ETH? Here\'s what you need to know:\n\n## What is Staking?\nStaking is locking up your ETH to help secure the network.\n\n## Options:\n1. **Solo Staking** - Requires 32 ETH\n2. **Staking Pools** - Lower minimum (Lido, Rocket Pool)\n\nCurrent APY: ~4-6%',
                category: 'ethereum', type: 'tutorial', tags: ['ethereum', 'staking', 'defi'],
                author: 'EthDev_Pro', authorId: 'demo_2', createdAt: new Date(Date.now() - 21600000).toISOString(),
                likes: 38, views: 280, pinned: false,
                replies: []
            },
            {
                id: 'post_5', title: 'Best Crypto Wallets in 2024? 💼',
                content: 'I\'m looking for recommendations on the best crypto wallets available right now.\n\nMy requirements:\n- Support multiple chains (BTC, ETH, SOL)\n- Good mobile app\n- User-friendly interface\n\nWhat are you guys using?',
                category: 'wallets', type: 'question', tags: ['wallets', 'recommendation'],
                author: 'BlockchainNinja', authorId: 'demo_3', createdAt: new Date(Date.now() - 28800000).toISOString(),
                likes: 19, views: 195, pinned: false,
                replies: []
            },
            {
                id: 'post_6', title: 'Smart Contract Development Resources 📚',
                content: 'Compiling a list of resources for aspiring smart contract developers:\n\n## Free Courses:\n1. **Cyfrin Updraft** by Patrick Collins\n2. **Alchemy University**\n\n## Practice Platforms:\n- CryptoZombies\n- Ethernaut\n\nWhat resources helped you learn?',
                category: 'development', type: 'tutorial', tags: ['development', 'solidity', 'resources'],
                author: 'EthDev_Pro', authorId: 'demo_2', createdAt: new Date(Date.now() - 43200000).toISOString(),
                likes: 55, views: 380, pinned: false,
                replies: []
            }
        ];
        localStorage.setItem(this.KEYS.POSTS, JSON.stringify(defaultPosts));

        const defaultChat = [
            { id: 'chat_1', user: 'CryptoMaster99', message: 'Hey everyone! Welcome to the chat! 🎉', timestamp: new Date(Date.now() - 600000).toISOString() },
            { id: 'chat_2', user: 'EthDev_Pro', message: 'Thanks! Excited to be here!', timestamp: new Date(Date.now() - 500000).toISOString() },
            { id: 'chat_3', user: 'SecurityGuru', message: 'Remember: Never share your private keys! 🔒', timestamp: new Date(Date.now() - 450000).toISOString() },
            { id: 'chat_4', user: 'Sisujhon', message: 'Welcome to CryptographyTube Community!', timestamp: new Date(Date.now() - 400000).toISOString() }
        ];
        localStorage.setItem(this.KEYS.CHAT, JSON.stringify(defaultChat));

        localStorage.setItem(this.KEYS.LIKES, JSON.stringify({}));
    },

    getUsers() { return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]'); },
    saveUsers(u) { localStorage.setItem(this.KEYS.USERS, JSON.stringify(u)); },
    getUserByUsername(un) { return this.getUsers().find(u => u.username.toLowerCase() === un.toLowerCase()); },
    getUserByEmail(em) { return this.getUsers().find(u => u.email?.toLowerCase() === em.toLowerCase()); },
    
    getPosts() { return JSON.parse(localStorage.getItem(this.KEYS.POSTS) || '[]'); },
    savePosts(p) { localStorage.setItem(this.KEYS.POSTS, JSON.stringify(p)); },
    getPostById(id) { return this.getPosts().find(p => p.id === id); },
    
    getChat() { return JSON.parse(localStorage.getItem(this.KEYS.CHAT) || '[]'); },
    saveChat(c) { localStorage.setItem(this.KEYS.CHAT, JSON.stringify(c)); },
    
    getCurrentUser() { 
        const u = localStorage.getItem(this.KEYS.CURRENT_USER);
        return u ? JSON.parse(u) : null; 
    },
    setCurrentUser(u) { localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(u)); },
    clearCurrentUser() { localStorage.removeItem(this.KEYS.CURRENT_USER); },
    
    getLikes() { return JSON.parse(localStorage.getItem(this.KEYS.LIKES) || '{}'); },
    saveLikes(l) { localStorage.setItem(this.KEYS.LIKES, JSON.stringify(l)); },
    
    generateId() { return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9); },
    
    addUser(data) {
        const users = this.getUsers();
        const newUser = { id: this.generateId(), ...data, createdAt: new Date().toISOString(), postCount: 0, likesReceived: 0, reputation: 10 };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    },
    
    addPost(data) {
        const posts = this.getPosts();
        const newPost = { id: this.generateId(), ...data, createdAt: new Date().toISOString(), likes: 0, views: 0, pinned: false, replies: [] };
        posts.unshift(newPost);
        this.savePosts(posts);
        return newPost;
    },
    
    toggleLike(postId, userId) {
        const likes = this.getLikes();
        const key = `${postId}_${userId}`;
        const posts = this.getPosts();
        const postIdx = posts.findIndex(p => p.id === postId);
        
        if (likes[key]) {
            delete likes[key];
            if (postIdx !== -1) posts[postIdx].likes = Math.max(0, posts[postIdx].likes - 1);
            this.saveLikes(likes);
            this.savePosts(posts);
            return false;
        } else {
            likes[key] = true;
            if (postIdx !== -1) posts[postIdx].likes++;
            this.saveLikes(likes);
            this.savePosts(posts);
            return true;
        }
    }
};

function initLocalStorage() {
    LOCAL_DB.init();
}

function checkLocalSession() {
    const user = LOCAL_DB.getCurrentUser();
    if (user) {
        ForumApp.currentUser = user;
        showForum(user);
    } else {
        showAuthSection();
    }
}

// Demo mode auth functions
function demoEmailRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!validateRegistration(username, email, password, confirmPassword, agreeTerms)) return;

    showAuthLoading(true, 'Creating account...');

    setTimeout(() => {
        if (LOCAL_DB.getUserByUsername(username)) {
            showAuthLoading(false);
            Toast.error('Username already taken');
            return;
        }
        if (LOCAL_DB.getUserByEmail(email)) {
            showAuthLoading(false);
            Toast.error('Email already registered');
            return;
        }

        const newUser = LOCAL_DB.addUser({ username, email, password, provider: 'email', bio: 'New member' });
        LOCAL_DB.setCurrentUser(newUser);
        
        showAuthLoading(false);
        Toast.success(`Account created! Welcome, ${username}!`);
        showForum(newUser);
    }, 800);
}

function demoEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        Toast.error('Please fill in all fields');
        return;
    }

    showAuthLoading(true, 'Signing in...');

    setTimeout(() => {
        let user = LOCAL_DB.getUserByEmail(email);
        if (!user) user = LOCAL_DB.getUserByUsername(email);
        
        if (!user) {
            showAuthLoading(false);
            Toast.error('User not found. Please register first.');
            return;
        }
        
        if (user.password !== password) {
            showAuthLoading(false);
            Toast.error('Incorrect password');
            return;
        }

        LOCAL_DB.setCurrentUser(user);
        showAuthLoading(false);
        Toast.success(`Welcome back, ${user.username}!`);
        showForum(user);
    }, 800);
}

function useDemoMode() {
    document.getElementById('configNotice').classList.add('hidden');
    initLocalStorage();
    checkLocalSession();
}

// ==================== UI FUNCTIONS ====================

function showAuthSection() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('forumSection').classList.add('hidden');
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function showAuthLoading(show, text = 'Processing...') {
    const loading = document.getElementById('authLoading');
    const textEl = document.getElementById('loadingText');
    
    if (show) {
        if (textEl) textEl.textContent = text;
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showForum(user) {
    ForumApp.currentUser = user;
    
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('forumSection').classList.remove('hidden');
    
    // Update header
    document.getElementById('userAvatarSmall').textContent = user.username.charAt(0).toUpperCase();
    document.getElementById('userNameSmall').textContent = user.username;
    
    // Load data
    loadPosts();
    loadStats();
    loadTopUsers();
    loadRecentActivity();
    loadChatMessages();
}

// ==================== DATABASE OPERATIONS ====================

async function loadPosts() {
    let posts = [];
    
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        // Load from Supabase
        try {
            const { data, error } = await ForumApp.supabase
                .from(ForumApp.TABLES.POSTS)
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            posts = data || [];
        } catch (error) {
            console.error('Load posts error:', error);
            posts = LOCAL_DB.getPosts();
        }
    } else {
        posts = LOCAL_DB.getPosts();
    }
    
    renderPosts(posts);
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    // Apply filters
    if (ForumApp.currentCategory !== 'all') {
        posts = posts.filter(p => p.category === ForumApp.currentCategory);
    }
    
    if (ForumApp.searchQuery) {
        const q = ForumApp.searchQuery.toLowerCase();
        posts = posts.filter(p => 
            p.title?.toLowerCase().includes(q) ||
            p.content?.toLowerCase().includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
        );
    }

    // Sort
    posts.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    });

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-inbox"></i>
                <h3>No posts found</h3>
                <p>Be the first to start a discussion!</p>
                <button onclick="openCreatePostModal()" class="btn-primary">
                    <i class="fas fa-plus"></i> Create Post
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => renderPostCard(post)).join('');
    updateCategoryCounts();
}

function renderPostCard(post) {
    const timeAgo = timeAgoStr(post.created_at || post.createdAt);
    const typeColors = { discussion: '#4a6cf7', question: '#ff9500', tutorial: '#22c55e', showcase: '#a855f7', announcement: '#ef4444' };
    
    return `
        <div class="post-card" onclick="viewPost('${post.id}')">
            ${post.pinned ? '<div class="pinned-badge"><i class="fas fa-thumbtack"></i> Pinned</div>' : ''}
            <div class="post-header">
                <span class="post-type" style="background: ${typeColors[post.type] || typeColors.discussion}">${post.type}</span>
                <span class="post-category"><i class="fas fa-folder"></i> ${post.category}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-preview">${escapeHtml((post.content || '').substring(0, 150))}...</p>
            ${(post.tags || []).length ? `<div class="post-tags">${post.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}
            <div class="post-footer">
                <div class="post-author">
                    <div class="author-avatar">${(post.author || 'U').charAt(0)}</div>
                    <span class="author-name">${escapeHtml(post.author || 'Anonymous')}</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <div class="post-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes || 0}</span>
                    <span><i class="fas fa-comment"></i> ${(post.replies || []).length}</span>
                    <span><i class="fas fa-eye"></i> ${post.views || 0}</span>
                </div>
            </div>
        </div>
    `;
}

async function createPost(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const type = document.getElementById('postType').value;
    const content = document.getElementById('postContent').value.trim();
    const tagsStr = document.getElementById('postTags').value.trim();

    if (!title || !category || !content) {
        Toast.error('Please fill in required fields');
        return;
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

    if (ForumApp.useRealAuth && ForumApp.supabase) {
        try {
            const { data, error } = await ForumApp.supabase
                .from(ForumApp.TABLES.POSTS)
                .insert({
                    title,
                    content,
                    category,
                    type,
                    tags,
                    author_id: ForumApp.currentUser.id,
                    author: ForumApp.currentUser.username,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            
            closeCreatePostModal();
            Toast.success('Post published to cloud!');
            loadPosts();
            loadStats();
        } catch (error) {
            console.error('Create post error:', error);
            Toast.error('Failed to create post');
        }
    } else {
        const post = LOCAL_DB.addPost({
            title, content, category, type, tags,
            author: ForumApp.currentUser.username,
            authorId: ForumApp.currentUser.id
        });
        
        closeCreatePostModal();
        Toast.success('Post published!');
        loadPosts();
        loadStats();
        loadRecentActivity();
    }
}

async function viewPost(postId) {
    let post = null;
    
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        const { data, error } = await ForumApp.supabase
            .from(ForumApp.TABLES.POSTS)
            .select('*')
            .eq('id', postId)
            .single();
            
        if (!error) post = data;
    } else {
        post = LOCAL_DB.getPostById(postId);
    }
    
    if (!post) {
        Toast.error('Post not found');
        return;
    }

    // Increment views
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        await ForumApp.supabase
            .from(ForumApp.TABLES.POSTS)
            .update({ views: (post.views || 0) + 1 })
            .eq('id', postId);
    } else {
        const posts = LOCAL_DB.getPosts();
        const idx = posts.findIndex(p => p.id === postId);
        if (idx !== -1) {
            posts[idx].views = (posts[idx].views || 0) + 1;
            LOCAL_DB.savePosts(posts);
        }
        post.views = (post.views || 0) + 1;
    }

    const modal = document.getElementById('viewPostModal');
    const content = document.getElementById('viewPostContent');
    
    const isLiked = ForumApp.useRealAuth ? false : Object.keys(LOCAL_DB.getLikes()).includes(`${postId}_${ForumApp.currentUser?.id}`);

    content.innerHTML = `
        <article class="full-post">
            <div class="full-post-header">
                <span class="post-type-badge">${post.type}</span>
                <span class="post-cat-badge">${post.category}</span>
            </div>
            <h2 class="full-post-title">${escapeHtml(post.title)}</h2>
            <div class="full-post-meta">
                <div class="post-author-info">
                    <div class="author-avatar-large">${(post.author || 'U').charAt(0)}</div>
                    <div>
                        <strong>${escapeHtml(post.author || 'Anonymous')}</strong>
                        <span class="post-date">${new Date(post.created_at || post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="full-post-content">${formatContent(post.content)}</div>
            <div class="full-post-actions">
                <button onclick="toggleLike('${post.id}')" class="${isLiked ? 'liked' : ''}" id="likeBtn-${post.id}">
                    <i class="fas fa-heart"></i> <span id="likeCount-${post.id}">${post.likes || 0}</span>
                </button>
                <button onclick="focusReply('${post.id}')"><i class="fas fa-reply"></i> Reply</button>
            </div>
            
            <div class="replies-section">
                <h3><i class="fas fa-comments"></i> Replies (${(post.replies || []).length})</h3>
                <div class="replies-list" id="repliesList-${post.id}">
                    ${(post.replies || []).map(r => `
                        <div class="reply-item">
                            <div class="reply-avatar">${r.author.charAt(0)}</div>
                            <div class="reply-content">
                                <div class="reply-header">
                                    <strong>${escapeHtml(r.author)}</strong>
                                    <span class="reply-time">${timeAgoStr(r.createdAt)}</span>
                                </div>
                                <p>${escapeHtml(r.content)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <form onsubmit="addReply(event, '${post.id}')" class="reply-form" id="replyForm-${post.id}">
                    <textarea placeholder="Write your reply..." rows="3" id="replyInput-${post.id}" required></textarea>
                    <button type="submit"><i class="fas fa-paper-plane"></i> Post Reply</button>
                </form>
            </div>
        </article>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeViewPostModal() {
    document.getElementById('viewPostModal').classList.add('hidden');
    document.body.style.overflow = '';
    loadPosts();
}

function toggleLike(postId) {
    if (!ForumApp.currentUser) {
        Toast.warning('Please login to like posts');
        return;
    }
    
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        // TODO: Implement real likes with Supabase
        Toast.info('Like feature coming soon!');
    } else {
        const liked = LOCAL_DB.toggleLike(postId, ForumApp.currentUser.id);
        const post = LOCAL_DB.getPostById(postId);
        
        const btn = document.getElementById(`likeBtn-${postId}`);
        const count = document.getElementById(`likeCount-${postId}`);
        
        if (btn && count) {
            btn.classList.toggle('liked', liked);
            count.textContent = post.likes;
        }
        
        Toast.success(liked ? '❤️ Liked!' : 'Like removed');
        loadPosts();
    }
}

async function addReply(event, postId) {
    event.preventDefault();
    
    const input = document.getElementById(`replyInput-${postId}`);
    const content = input.value.trim();
    
    if (!content || !ForumApp.currentUser) return;

    if (ForumApp.useRealAuth && ForumApp.supabase) {
        try {
            const { error } = await ForumApp.supabase
                .from(ForumApp.TABLES.REPLIES)
                .insert({
                    post_id: postId,
                    content,
                    author: ForumApp.currentUser.username,
                    author_id: ForumApp.currentUser.id,
                    created_at: new Date().toISOString()
                });
                
            if (error) throw error;
            
            input.value = '';
            Toast.success('Reply posted!');
            viewPost(postId);
        } catch (error) {
            Toast.error('Failed to post reply');
        }
    } else {
        const posts = LOCAL_DB.getPosts();
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            const reply = {
                id: LOCAL_DB.generateId(),
                content,
                author: ForumApp.currentUser.username,
                createdAt: new Date().toISOString(),
                likes: 0
            };
            
            if (!post.replies) post.replies = [];
            post.replies.push(reply);
            LOCAL_DB.savePosts(posts);
            
            input.value = '';
            Toast.success('Reply posted!');
            viewPost(postId);
        }
    }
}

// ==================== FILTERING & SEARCH ====================

function filterByTab(tab) {
    ForumApp.currentFilter = tab;
    
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    const titles = {
        all: '<i class="fas fa-stream"></i> Latest Posts',
        trending: '<i class="fas fa-fire"></i> Trending Posts',
        questions: '<i class="fas fa-question-circle"></i> Questions',
        tutorials: '<i class="fas fa-book"></i> Tutorials',
        tools: '<i class="fas fa-wrench"></i> Tools Discussion',
        general: '<i class="fas fa-comments"></i> General Chat'
    };
    document.getElementById('feedTitle').innerHTML = titles[tab] || titles.all;
    
    loadPosts();
}

function filterCategory(cat) {
    ForumApp.currentCategory = cat;
    
    document.querySelectorAll('.category-list li').forEach(li => {
        li.classList.toggle('active', li.dataset.cat === cat);
    });
    
    loadPosts();
}

function searchForum(q) {
    ForumApp.searchQuery = q;
    loadPosts();
}

function sortPosts(v) {
    // Sorting handled in renderPosts
    loadPosts();
}

// ==================== STATS & SIDEBAR ====================

async function loadStats() {
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        try {
            const [usersRes, postsRes] = await Promise.all([
                ForumApp.supabase.from(ForumApp.TABLES.PROFILES).select('*', { count: 'exact' }),
                ForumApp.supabase.from(ForumApp.TABLES.POSTS).select('*', { count: 'exact' })
            ]);
            
            document.getElementById('totalMembers').textContent = usersRes.count || 0;
            document.getElementById('totalPosts').textContent = postsRes.count || 0;
            document.getElementById('totalReplies').textContent = '--';
            document.getElementById('totalTopics').textContent = '--';
        } catch (e) {
            console.error('Stats error:', e);
        }
    } else {
        const users = LOCAL_DB.getUsers();
        const posts = LOCAL_DB.getPosts();
        let totalReplies = 0;
        posts.forEach(p => totalReplies += (p.replies?.length || 0));
        
        document.getElementById('totalMembers').textContent = users.length;
        document.getElementById('totalPosts').textContent = posts.length;
        document.getElementById('totalReplies').textContent = totalReplies;
        document.getElementById('totalTopics').textContent = [...new Set(posts.map(p => p.category))].length;
    }
}

function loadTopUsers() {
    let users = [];
    
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        // Would need a separate query - using placeholder for now
        users = [{ username: 'Loading...', reputation: 0 }];
    } else {
        users = [...LOCAL_DB.getUsers()].sort((a, b) => b.reputation - a.reputation).slice(0, 5);
    }
    
    document.getElementById('topUsersList').innerHTML = users.map((u, i) => `
        <li>
            <span class="rank">${i + 1}</span>
            <div class="user-avatar-xs">${u.username.charAt(0)}</div>
            <div class="user-info">
                <span class="username">${escapeHtml(u.username)}</span>
                <span class="rep"><i class="fas fa-star"></i> ${u.reputation || 0}</span>
            </div>
        </li>
    `).join('');
}

function loadRecentActivity() {
    const posts = (ForumApp.useRealAuth ? [] : LOCAL_DB.getPosts()).slice(0, 5);
    
    document.getElementById('activityList').innerHTML = posts.map(p => `
        <li onclick="viewPost('${p.id}')">
            <i class="fas fa-file-alt"></i>
            <div>
                <strong>${escapeHtml(p.title.substring(0, 30))}...</strong>
                <small>${timeAgoStr(p.createdAt)}</small>
            </div>
        </li>
    `).join('') || '<li><em>No recent activity</em></li>';
}

function updateCategoryCounts() {
    const posts = ForumApp.useRealAuth ? [] : LOCAL_DB.getPosts();
    
    const counts = {
        all: posts.length,
        bitcoin: posts.filter(p => p.category === 'bitcoin').length,
        ethereum: posts.filter(p => p.category === 'ethereum').length,
        security: posts.filter(p => p.category === 'security').length,
        wallets: posts.filter(p => p.category === 'wallets').length,
        development: posts.filter(p => p.category === 'development').length,
        news: posts.filter(p => p.category === 'news').length,
        offtopic: posts.filter(p => p.category === 'offtopic').length
    };
    
    document.getElementById('catAllCount').textContent = counts.all;
    document.getElementById('catBitcoinCount').textContent = counts.bitcoin;
    document.getElementById('catEthereumCount').textContent = counts.ethereum;
    document.getElementById('catSecurityCount').textContent = counts.security;
    document.getElementById('catWalletsCount').textContent = counts.wallets;
    document.getElementById('catDevCount').textContent = counts.development;
    document.getElementById('catNewsCount').textContent = counts.news;
    document.getElementById('catOffTopicCount').textContent = counts.offtopic;
}

// ==================== CHAT FUNCTIONS ====================

function loadChatMessages() {
    const messages = ForumApp.useRealAuth ? [] : LOCAL_DB.getChat();
    const container = document.getElementById('chatMessages');
    
    container.innerHTML = messages.length ? messages.map(msg => `
        <div class="chat-msg ${msg.user === ForumApp.currentUser?.username ? 'own-msg' : ''}">
            <div class="msg-avatar">${msg.user.charAt(0)}</div>
            <div class="msg-body">
                <span class="msg-user">${escapeHtml(msg.user)}</span>
                <p>${escapeHtml(msg.message)}</p>
                <small class="msg-time">${timeAgoStr(msg.timestamp)}</small>
            </div>
        </div>
    `).join('') : `
        <div class="chat-welcome">
            <i class="fas fa-rocketchat"></i>
            <p>Welcome to Community Chat!</p>
            <small>${ForumApp.useRealAuth ? 'Cloud chat coming soon!' : 'Start typing...'}</small>
        </div>
    `;
    
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage(event) {
    event.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !ForumApp.currentUser) return;

    if (ForumApp.useRealAuth) {
        Toast.info('Cloud chat coming soon!');
        return;
    }
    
    const msg = {
        id: LOCAL_DB.generateId(),
        user: ForumApp.currentUser.username,
        message,
        timestamp: new Date().toISOString()
    };
    
    const chat = LOCAL_DB.getChat();
    chat.push(msg);
    if (chat.length > 200) chat.splice(0, chat.length - 200);
    LOCAL_DB.saveChat(chat);
    
    input.value = '';
    loadChatMessages();
}

// ==================== PROFILE FUNCTIONS ====================

function viewProfile() {
    toggleUserMenu();
    
    if (!ForumApp.currentUser) return;
    
    const user = ForumApp.currentUser;
    const posts = (ForumApp.useRealAuth ? [] : LOCAL_DB.getPosts()).filter(p => p.authorId === user.id || p.author === user.username);
    
    document.getElementById('profileAvatarLarge').textContent = user.username.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileBio').textContent = user.bio || 'No bio yet';
    document.getElementById('profilePosts').textContent = user.post_count || user.postCount || posts.length;
    document.getElementById('profileLikes').textContent = user.likes_received || user.likesReceived || 0;
    document.getElementById('profileJoined').textContent = new Date(user.created_at || user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    document.getElementById('profilePostsList').innerHTML = posts.length ? posts.slice(0, 5).map(p => `
        <div class="profile-post-item" onclick="closeProfileModal(); viewPost('${p.id}')">
            <h5>${escapeHtml(p.title.substring(0, 40))}...</h5>
            <small>${timeAgoStr(p.createdAt)} • ${p.likes} likes</small>
        </div>
    `).join('') : '<p class="no-posts-yet">No posts yet</p>';
    
    document.getElementById('profileModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function editProfile() {
    toggleUserMenu();
    
    document.getElementById('editDisplayName').value = ForumApp.currentUser.username;
    document.getElementById('editBio').value = ForumApp.currentUser.bio || '';
    
    document.getElementById('editProfileModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.add('hidden');
    document.body.style.overflow = '';
}

async function saveProfile(event) {
    event.preventDefault();
    
    const displayName = document.getElementById('editDisplayName').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    
    if (!displayName) {
        Toast.error('Display name is required');
        return;
    }

    if (ForumApp.useRealAuth && ForumApp.supabase) {
        try {
            const { error } = await ForumApp.supabase
                .from(ForumApp.TABLES.PROFILES)
                .update({ username: displayName, bio, updated_at: new Date().toISOString() })
                .eq('id', ForumApp.currentUser.id);
                
            if (error) throw error;
            
            ForumApp.currentUser = { ...ForumApp.currentUser, username: displayName, bio };
            document.getElementById('userAvatarSmall').textContent = displayName.charAt(0);
            document.getElementById('userNameSmall').textContent = displayName;
            
            closeEditProfileModal();
            Toast.success('Profile updated!');
        } catch (error) {
            Toast.error('Failed to update profile');
        }
    } else {
        const users = LOCAL_DB.getUsers();
        const idx = users.findIndex(u => u.id === ForumApp.currentUser.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], username: displayName, bio };
            LOCAL_DB.saveUsers(users);
            ForumApp.currentUser = users[idx];
            LOCAL_DB.setCurrentUser(users[idx]);
            
            document.getElementById('userAvatarSmall').textContent = displayName.charAt(0);
            document.getElementById('userNameSmall').textContent = displayName;
            
            closeEditProfileModal();
            Toast.success('Profile updated!');
        }
    }
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('hidden');
}

// ==================== MODAL FUNCTIONS ====================

function openCreatePostModal() {
    if (!ForumApp.currentUser) {
        Toast.warning('Please login to create posts');
        return;
    }
    document.getElementById('createPostModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCreatePostModal() {
    document.getElementById('createPostModal').classList.add('hidden');
    document.body.style.overflow = '';
    
    document.getElementById('postTitle').value = '';
    document.getElementById('postCategory').value = '';
    document.getElementById('postType').value = 'discussion';
    document.getElementById('postContent').value = '';
    document.getElementById('postTags').value = '';
    document.getElementById('charCount').textContent = '0';
}

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatContent(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/\n/g, '<br>');
}

function timeAgoStr(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
    
    return 'just now';
}

function setupEventListeners() {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.addEventListener('input', () => {
            document.getElementById('charCount').textContent = postContent.value.length;
        });
    }

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown && !e.target.closest('.user-menu')) {
            dropdown.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCreatePostModal();
            closeViewPostModal();
            closeProfileModal();
            closeEditProfileModal();
        }
    });
}

function simulateOnlineUsers() {
    const updateOnline = () => {
        document.getElementById('onlineUsers').textContent = 12 + Math.floor(Math.random() * 8);
    };
    updateOnline();
    setInterval(updateOnline, 30000);
}

function testConnection() {
    if (ForumApp.useRealAuth && ForumApp.supabase) {
        ForumApp.supabase.from(ForumApp.TABLES.PROFILES).select('count').then(({ error }) => {
            if (error) {
                Toast.error('Connection failed: ' + error.message);
            } else {
                Toast.success('✅ Connected to Supabase!');
            }
        });
    } else {
        Toast.info('Demo mode - no cloud connection');
    }
}

function focusReply(postId) {
    const input = document.getElementById(`replyInput-${postId}`);
    if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth' });
    }
}

function showGuidelines() {
    alert('Community Guidelines:\n\n1. Be respectful to all members\n2. No spam or self-promotion\n3. Never share private keys or sensitive info\n4. Stay on topic\n5. Help others learn and grow\n\nViolations may result in account suspension.');
}
