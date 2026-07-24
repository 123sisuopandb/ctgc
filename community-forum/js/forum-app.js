// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// 100% Client-Side Application (GitHub Pages Ready)
// Data stored in localStorage - NO Firebase needed!
// Author: Sisujhon
// ============================================

// ==================== DATABASE MANAGER ====================
const DB = {
    // Storage keys
    KEYS: {
        USERS: 'ct_forum_users',
        POSTS: 'ct_forum_posts',
        COMMENTS: 'ct_forum_comments',
        CHAT: 'ct_forum_chat',
        CURRENT_USER: 'ct_forum_current_user',
        LIKES: 'ct_forum_likes',
        INITIALIZED: 'ct_forum_initialized'
    },

    // Initialize database with default data
    init() {
        if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
            this.createDefaultData();
            localStorage.setItem(this.KEYS.INITIALIZED, 'true');
        }
        
        // Check for existing session
        const currentUser = localStorage.getItem(this.KEYS.CURRENT_USER);
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                ForumApp.showForum(user);
            } catch (e) {
                localStorage.removeItem(this.KEYS.CURRENT_USER);
            }
        }
    },

    // Create default sample data
    createDefaultData() {
        // Default users
        const defaultUsers = [
            { 
                id: this.generateId(), 
                username: 'CryptoMaster99', 
                password: 'demo123', 
                email: 'crypto@example.com', 
                bio: 'Forum Admin & Bitcoin Expert since 2017',
                avatar: null,
                provider: 'email',
                createdAt: new Date(Date.now() - 2592000000).toISOString(),
                postCount: 5,
                likesReceived: 150,
                reputation: 500,
                isOnline: true
            },
            { 
                id: this.generateId(), 
                username: 'EthDev_Pro', 
                password: 'demo123', 
                email: 'ethdev@example.com', 
                bio: 'Ethereum Developer | DeFi Enthusiast',
                avatar: null,
                provider: 'email',
                createdAt: new Date(Date.now() - 1728000000).toISOString(),
                postCount: 12,
                likesReceived: 89,
                reputation: 320,
                isOnline: true
            },
            { 
                id: this.generateId(), 
                username: 'BlockchainNinja', 
                password: 'demo123', 
                email: 'ninja@example.com', 
                bio: 'Blockchain Enthusiast | Learning every day',
                avatar: null,
                provider: 'email',
                createdAt: new Date(Date.now() - 864000000).toISOString(),
                postCount: 8,
                likesReceived: 45,
                reputation: 180,
                isOnline: false
            },
            { 
                id: this.generateId(), 
                username: 'SecurityGuru', 
                password: 'demo123', 
                email: 'security@example.com', 
                bio: 'Security Researcher | Smart Contract Auditor',
                avatar: null,
                provider: 'email',
                createdAt: new Date(Date.now() - 432000000).toISOString(),
                postCount: 15,
                likesReceived: 200,
                reputation: 450,
                isOnline: true
            },
            { 
                id: this.generateId(), 
                username: 'Sisujhon', 
                password: 'admin123', 
                email: 'sisujhon@cryptotube.com', 
                bio: 'Creator of CryptographyTube | Crypto Tools Developer',
                avatar: null,
                provider: 'email',
                createdAt: new Date(Date.now() - 31536000000).toISOString(),
                postCount: 25,
                likesReceived: 500,
                reputation: 1000,
                isOnline: true,
                isAdmin: true
            }
        ];
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(defaultUsers));

        // Default posts
        const defaultPosts = [
            {
                id: this.generateId(),
                title: 'Welcome to CryptographyTube Community! 🎉',
                content: 'Hey everyone! Welcome to our brand new community forum!\n\nThis is a place where crypto enthusiasts can:\n- Share knowledge about Bitcoin, Ethereum, and other cryptocurrencies\n- Discuss security best practices\n- Talk about wallets and development\n- Ask questions and get help from experts\n\nFeel free to introduce yourself below and start engaging with the community!\n\nHappy posting! 🚀',
                category: 'general',
                type: 'announcement',
                tags: ['welcome', 'introduction', 'community'],
                author: 'Sisujhon',
                authorId: defaultUsers[4].id,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 3600000).toISOString(),
                likes: 25,
                views: 150,
                pinned: true,
                replies: [
                    { id: this.generateId(), author: 'CryptoMaster99', content: 'Excited to be here! This community is going to be amazing! 🎊', createdAt: new Date(Date.now() - 3000000).toISOString(), likes: 5 },
                    { id: this.generateId(), author: 'EthDev_Pro', content: 'Thanks for creating this space! Looking forward to great discussions.', createdAt: new Date(Date.now() - 2400000).toISOString(), likes: 3 },
                    { id: this.generateId(), author: 'BlockchainNinja', content: 'Just joined! New to crypto but eager to learn. 👋', createdAt: new Date(Date.now() - 1800000).toISOString(), likes: 8 }
                ]
            },
            {
                id: this.generateId(),
                title: 'Bitcoin Price Analysis - Next Target $100K? 📈',
                content: 'Looking at the current Bitcoin chart patterns:\n\n1. **Bullish Signals:**\n   - Breaking above key resistance at $65K\n   - Increasing institutional adoption\n   - ETF inflows remain strong\n\n2. **Key Levels to Watch:**\n   - Support: $58,000\n   - Resistance: $72,000\n   - Next target: $85,000-$100,000\n\n3. **Risk Factors:**\n   - Regulatory concerns\n   - Macro economic conditions\n\nWhat are your thoughts on BTC price action? Are we heading to new ATH soon?',
                category: 'bitcoin',
                type: 'discussion',
                tags: ['bitcoin', 'price-analysis', 'trading', 'TA'],
                author: 'CryptoMaster99',
                authorId: defaultUsers[0].id,
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                updatedAt: new Date(Date.now() - 7200000).toISOString(),
                likes: 42,
                views: 320,
                pinned: false,
                replies: [
                    { id: this.generateId(), author: 'EthDev_Pro', content: 'Great analysis! I think we\'ll see $80K before end of year. The halving effect is real!', createdAt: new Date(Date.now() - 6000000).toISOString(), likes: 12 },
                    { id: this.generateId(), author: 'SecurityGuru', content: 'Don\'t forget about the risk of a correction. Always DYOR and manage your positions wisely.', createdAt: new Date(Date.now() - 4800000).toISOString(), likes: 7 }
                ]
            },
            {
                id: this.generateId(),
                title: 'How to Secure Your Crypto Wallet? 🔒',
                content: 'Security is paramount in crypto! Here\'s my comprehensive guide:\n\n## Hardware Wallets\n- Use Ledger or Trezor for large holdings\n- Never share your seed phrase\n- Store seed phrase offline (paper or metal)\n\n## Software Security\n- Enable 2FA everywhere\n- Use unique passwords (password manager)\n- Be wary of phishing attempts\n- Keep software updated\n\n## Best Practices\n- Don\'t brag about holdings online\n- Use separate wallets for different purposes\n- Regular security audits of your setup\n\n**Question:** What security measures do you use? Share your setup!',
                category: 'security',
                type: 'tutorial',
                tags: ['security', 'wallet', 'safety', 'guide'],
                author: 'SecurityGuru',
                authorId: defaultUsers[3].id,
                createdAt: new Date(Date.now() - 14400000).toISOString(),
                updatedAt: new Date(Date.now() - 14400000).toISOString(),
                likes: 67,
                views: 450,
                pinned: true,
                replies: [
                    { id: this.generateId(), author: 'BlockchainNinja', content: 'This saved me! Just ordered a hardware wallet thanks to this post.', createdAt: new Date(Date.now() - 12000000).toISOString(), likes: 15 },
                    { id: this.generateId(), author: 'CryptoMaster99', content: 'Excellent guide! Would add: test with small amounts first before storing large sums.', createdAt: new Date(Date.now() - 9600000).toISOString(), likes: 9 }
                ]
            },
            {
                id: this.generateId(),
                title: 'Ethereum 2.0 Staking Guide for Beginners',
                content: 'Interested in staking ETH? Here\'s what you need to know:\n\n## What is Staking?\nStaking is locking up your ETH to help secure the network and earn rewards.\n\n## Options:\n1. **Solo Staking** - Requires 32 ETH + technical setup\n2. **Staking Pools** - Lower minimum (Lido, Rocket Pool)\n3. **Exchange Staking** - Easiest but custody risks\n\n## Current APY:\n- Solo: ~4-6%\n- Pooled: ~3-5%\n- Exchange: ~2-4%\n\n## Risks:\n- Slashing penalties\n- Liquidity lock-up\n- Smart contract risk\n\nWould anyone like a detailed tutorial on setting up staking?',
                category: 'ethereum',
                type: 'tutorial',
                tags: ['ethereum', 'staking', 'defi', 'passive-income'],
                author: 'EthDev_Pro',
                authorId: defaultUsers[1].id,
                createdAt: new Date(Date.now() - 21600000).toISOString(),
                updatedAt: new Date(Date.now() - 21600000).toISOString(),
                likes: 38,
                views: 280,
                pinned: false,
                replies: [
                    { id: this.generateId(), author: 'Sisujhon', content: 'Great overview! A tutorial on Rocket Pool would be amazing for beginners.', createdAt: new Date(Date.now() - 18000000).toISOString(), likes: 10 }
                ]
            },
            {
                id: this.generateId(),
                title: 'Best Crypto Wallets in 2024? 💼',
                content: 'I\'m looking for recommendations on the best crypto wallets available right now.\n\nMy requirements:\n- Support multiple chains (BTC, ETH, SOL)\n- Good mobile app\n- Reasonable fees\n- User-friendly interface\n\nCurrently using MetaMask but open to alternatives.\n\nWhat are you guys using and why?',
                category: 'wallets',
                type: 'question',
                tags: ['wallets', 'recommendation', 'multi-chain'],
                author: 'BlockchainNinja',
                authorId: defaultUsers[2].id,
                createdAt: new Date(Date.now() - 28800000).toISOString(),
                updatedAt: new Date(Date.now() - 28800000).toISOString(),
                likes: 19,
                views: 195,
                pinned: false,
                replies: [
                    { id: this.generateId(), author: 'CryptoMaster99', content: 'I recommend Trust Wallet or Phantom (for SOL). Both are solid choices!', createdAt: new Date(Date.now() - 24000000).toISOString(), likes: 8 },
                    { id: this.generateId(), author: 'EthDev_Pro', content: 'For multi-chain, Rabby Wallet is excellent. Great UX and security features.', createdAt: new Date(Date.now() - 20000000).toISOString(), likes: 6 },
                    { id: this.generateId(), author: 'SecurityGuru', content: 'For maximum security, always go hardware. Ledger supports most chains now.', createdAt: new Date(Date.now() - 16000000).toISOString(), likes: 11 }
                ]
            },
            {
                id: this.generateId(),
                title: 'Smart Contract Development Resources 📚',
                content: 'Compiling a list of resources for aspiring smart contract developers:\n\n## Free Courses:\n1. **Cyfrin Updraft** - Patrick Collins (amazing!)\n2. **Alchemy University** - Comprehensive Solidity course\n3. **Dapp University** - YouTube tutorials\n\n## Practice Platforms:\n- CryptoZombies (gamified learning)\n- Ethernaut (security-focused challenges)\n- SpeedRunEthereum (hands-on projects)\n\n## Tools:\n- Remix IDE (browser-based)\n- Hardhat/Foundry (local development)\n- OpenZeppelin (secure contracts library)\n\nWhat resources helped you learn? Drop them below! 👇',
                category: 'development',
                type: 'tutorial',
                tags: ['development', 'solidity', 'smart-contracts', 'resources'],
                author: 'EthDev_Pro',
                authorId: defaultUsers[1].id,
                createdAt: new Date(Date.now() - 43200000).toISOString(),
                updatedAt: new Date(Date.now() - 43200000).toISOString(),
                likes: 55,
                views: 380,
                pinned: false,
                replies: [
                    { id: this.generateId(), author: 'Sisujhon', content: 'Patrick Collins\' courses are gold! Changed my career path completely.', createdAt: new Date(Date.now() - 36000000).toISOString(), likes: 18 },
                    { id: this.generateId(), author: 'BlockchainNinja', content: 'Started with CryptoZombies, now building DeFi protocols. Thanks for sharing!', createdAt: new Date(Date.now() - 30000000).toISOString(), likes: 7 }
                ]
            }
        ];
        localStorage.setItem(this.KEYS.POSTS, JSON.stringify(defaultPosts));

        // Default comments (already included in posts above)
        localStorage.setItem(this.KEYS.COMMENTS, JSON.stringify([]));

        // Default chat messages
        const defaultChat = [
            { id: this.generateId(), user: 'CryptoMaster99', message: 'Hey everyone! Welcome to the chat! 🎉', timestamp: new Date(Date.now() - 600000).toISOString(), isSystem: false },
            { id: this.generateId(), user: 'System', message: 'CryptoMaster99 joined the chat', timestamp: new Date(Date.now() - 550000).toISOString(), isSystem: true },
            { id: this.generateId(), user: 'EthDev_Pro', message: 'Thanks! Excited to be here!', timestamp: new Date(Date.now() - 500000).toISOString(), isSystem: false },
            { id: this.generateId(), user: 'SecurityGuru', message: 'Remember: Never share your private keys! 🔒', timestamp: new Date(Date.now() - 450000).toISOString(), isSystem: false },
            { id: this.generateId(), user: 'Sisujhon', message: 'Welcome to CryptographyTube Community! Feel free to ask anything about crypto tools.', timestamp: new Date(Date.now() - 400000).toISOString(), isSystem: false }
        ];
        localStorage.setItem(this.KEYS.CHAT, JSON.stringify(defaultChat));

        // Default likes
        const defaultLikes = {};
        localStorage.setItem(this.KEYS.LIKES, JSON.stringify(defaultLikes));
    },

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    // Get all users
    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },

    // Save users
    saveUsers(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    // Get user by username
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    // Get user by ID
    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    },

    // Get all posts
    getPosts() {
        return JSON.parse(localStorage.getItem(this.KEYS.POSTS) || '[]');
    },

    // Save posts
    savePosts(posts) {
        localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
    },

    // Get post by ID
    getPostById(id) {
        const posts = this.getPosts();
        return posts.find(p => p.id === id);
    },

    // Get chat messages
    getChat() {
        return JSON.parse(localStorage.getItem(this.KEYS.CHAT) || '[]');
    },

    // Save chat
    saveChat(chat) {
        localStorage.setItem(this.KEYS.CHAT, JSON.stringify(chat));
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    },

    // Clear current user (logout)
    clearCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // Get likes
    getLikes() {
        return JSON.parse(localStorage.getItem(this.KEYS.LIKES) || '{}');
    },

    // Save likes
    saveLikes(likes) {
        localStorage.setItem(this.KEYS.LIKES, JSON.stringify(likes));
    },

    // Add user
    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            ...userData,
            createdAt: new Date().toISOString(),
            postCount: 0,
            likesReceived: 0,
            reputation: 10,
            isOnline: true,
            avatar: null
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    },

    // Update user
    updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            return users[index];
        }
        return null;
    },

    // Add post
    addPost(postData) {
        const posts = this.getPosts();
        const newPost = {
            id: this.generateId(),
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            views: 0,
            pinned: false,
            replies: []
        };
        posts.unshift(newPost); // Add to beginning
        this.savePosts(posts);

        // Update user post count
        const user = this.getUserById(postData.authorId);
        if (user) {
            this.updateUser(user.id, { postCount: user.postCount + 1 });
        }

        return newPost;
    },

    // Update post
    updatePost(postId, updates) {
        const posts = this.getPosts();
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
            this.savePosts(posts);
            return posts[index];
        }
        return null;
    },

    // Delete post
    deletePost(postId) {
        let posts = this.getPosts();
        posts = posts.filter(p => p.id !== postId);
        this.savePosts(posts);
    },

    // Add reply to post
    addReply(postId, replyData) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            const reply = {
                id: this.generateId(),
                ...replyData,
                createdAt: new Date().toISOString(),
                likes: 0
            };
            post.replies.push(reply);
            post.updatedAt = new Date().toISOString();
            this.savePosts(posts);
            return reply;
        }
        return null;
    },

    // Toggle like on post
    toggleLike(postId, userId) {
        const likes = this.getLikes();
        const key = `${postId}_${userId}`;
        
        if (likes[key]) {
            delete likes[key];
            this.updatePost(postId, { likes: Math.max(0, (this.getPostById(postId)?.likes || 0) - 1) });
            this.saveLikes(likes);
            return false; // Unliked
        } else {
            likes[key] = true;
            this.updatePost(postId, { likes: (this.getPostById(postId)?.likes || 0) + 1 });
            
            // Update author's received likes
            const post = this.getPostById(postId);
            if (post && post.authorId !== userId) {
                const author = this.getUserById(post.authorId);
                if (author) {
                    this.updateUser(author.id, { likesReceived: author.likesReceived + 1 });
                }
            }
            
            this.saveLikes(likes);
            return true; // Liked
        }
    },

    // Add chat message
    addChatMessage(messageData) {
        const chat = this.getChat();
        const msg = {
            id: this.generateId(),
            ...messageData,
            timestamp: new Date().toISOString()
        };
        chat.push(msg);
        
        // Keep only last 200 messages
        if (chat.length > 200) {
            chat.splice(0, chat.length - 200);
        }
        
        this.saveChat(chat);
        return msg;
    },

    // Get storage info
    getStorageInfo() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith('ct_forum_')) {
                total += localStorage.getItem(key).length * 2; // UTF-16
            }
        }
        return {
            used: total,
            usedKB: Math.round(total / 1024),
            maxKB: 5 * 1024, // 5MB approximate limit
            percent: Math.min(100, (total / (5 * 1024 * 1024)) * 100)
        };
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.createDefaultData();
    },

    // Export all data
    exportAll() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = JSON.parse(localStorage.getItem(key) || 'null');
        });
        return data;
    },

    // Import data
    importAll(data) {
        Object.entries(this.KEYS).forEach(([name, key]) => {
            if (data[name]) {
                localStorage.setItem(key, JSON.stringify(data[name]));
            }
        });
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

// ==================== MAIN APPLICATION ====================
const ForumApp = {
    currentUser: null,
    currentFilter: 'all',
    currentCategory: 'all',
    searchQuery: '',

    // Initialize application
    init() {
        DB.init();
        this.setupEventListeners();
        this.simulateOnlineUsers();
    },

    // Setup event listeners
    setupEventListeners() {
        // Character count for post content
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.addEventListener('input', () => {
                document.getElementById('charCount').textContent = postContent.value.length;
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            const menu = e.target.closest('.user-menu');
            if (!menu && dropdown && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },

    // Simulate online users count
    simulateOnlineUsers() {
        const updateOnline = () => {
            const base = 12;
            const variance = Math.floor(Math.random() * 8);
            document.getElementById('onlineUsers').textContent = base + variance;
        };
        updateOnline();
        setInterval(updateOnline, 30000);
    },

    // ==================== AUTH FUNCTIONS ====================

    // Show login form
    showLogin() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    },

    // Show register form
    showRegister() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    },

    // Toggle password visibility
    togglePassword(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    },

    // Email/Password Login
    emailLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Validation
        if (!username || !password) {
            Toast.error('Please fill in all fields');
            return;
        }

        // Show loading
        this.showAuthLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Find user by username OR email
            const users = DB.getUsers();
            const user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() || 
                u.email?.toLowerCase() === username.toLowerCase()
            );

            if (!user) {
                this.showAuthLoading(false);
                Toast.error('User not found. Please check your username or register.');
                return;
            }

            if (user.password !== password) {
                this.showAuthLoading(false);
                Toast.error('Incorrect password. Please try again.');
                return;
            }

            // Login successful
            const userData = { ...user, lastLogin: new Date().toISOString() };
            DB.setCurrentUser(userData);
            
            // Update online status
            DB.updateUser(user.id, { isOnline: true });
            
            this.showAuthLoading(false);
            Toast.success(`Welcome back, ${user.username}!`);
            
            this.showForum(userData);
        }, 800);
    },

    // Email/Password Registration
    emailRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            Toast.error('Please fill in all required fields');
            return;
        }

        // Username validation
        if (username.length < 3 || username.length > 30) {
            Toast.error('Username must be 3-30 characters');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            Toast.error('Username can only contain letters, numbers, and underscores');
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Toast.error('Please enter a valid email address');
            return;
        }

        // Password validation
        if (password.length < 6) {
            Toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Toast.error('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            Toast.warning('Please agree to the Community Guidelines');
            return;
        }

        // Check if username already exists
        if (DB.getUserByUsername(username)) {
            Toast.error('Username already taken. Please choose another.');
            return;
        }

        // Check if email already exists
        const existingEmail = DB.getUsers().find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
            Toast.error('Email already registered. Please login instead.');
            return;
        }

        // Show loading
        this.showAuthLoading(true);

        // Create account
        setTimeout(() => {
            const newUser = DB.addUser({
                username,
                email,
                password,
                bio: 'New member of CryptographyTube Community',
                provider: 'email'
            });

            // Auto-login after registration
            DB.setCurrentUser(newUser);
            
            this.showAuthLoading(false);
            Toast.success(`Account created successfully! Welcome, ${username}!`);
            
            this.showForum(newUser);
        }, 1000);
    },

    // Google Login (Simulated)
    googleLogin() {
        this.showAuthLoading(true);
        
        // Simulate Google OAuth flow
        setTimeout(() => {
            const googleUsername = 'GoogleUser_' + Math.floor(Math.random() * 9999);
            
            // Check if user exists with this pattern or create new
            let user = DB.getUserByUsername(googleUsername);
            if (!user) {
                user = DB.addUser({
                    username: googleUsername,
                    email: `${googleUsername.toLowerCase()}@gmail.com`,
                    password: '',
                    bio: 'Joined via Google Sign-In',
                    provider: 'google'
                });
            }
            
            DB.setCurrentUser({ ...user, lastLogin: new Date().toISOString() });
            DB.updateUser(user.id, { isOnline: true });
            
            this.showAuthLoading(false);
            Toast.success(`Signed in with Google as ${user.username}`);
            
            this.showForum(user);
        }, 1500);
    },

    // GitHub Login (Simulated)
    githubLogin() {
        this.showAuthLoading(true);
        
        // Simulate GitHub OAuth flow
        setTimeout(() => {
            const githubUsername = 'GitHubDev_' + Math.floor(Math.random() * 9999);
            
            // Check if user exists with this pattern or create new
            let user = DB.getUserByUsername(githubUsername);
            if (!user) {
                user = DB.addUser({
                    username: githubUsername,
                    email: `${githubUsername.toLowerCase()}@users.noreply.github.com`,
                    password: '',
                    bio: 'Developer who joined via GitHub',
                    provider: 'github'
                });
            }
            
            DB.setCurrentUser({ ...user, lastLogin: new Date().toISOString() });
            DB.updateUser(user.id, { isOnline: true });
            
            this.showAuthLoading(false);
            Toast.success(`Signed in with GitHub as ${user.username}`);
            
            this.showForum(user);
        }, 1500);
    },

    // Show/hide auth loading
    showAuthLoading(show) {
        const loading = document.getElementById('authLoading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    },

    // Logout
    logout() {
        if (this.currentUser) {
            DB.updateUser(this.currentUser.id, { isOnline: false });
        }
        DB.clearCurrentUser();
        this.currentUser = null;
        
        document.getElementById('forumSection').classList.add('hidden');
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        
        // Clear form inputs
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        
        Toast.info('You have been logged out');
    },

    // Show forum (after successful login)
    showForum(user) {
        this.currentUser = user;
        
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('forumSection').classList.remove('hidden');
        
        // Update header user info
        document.getElementById('userAvatarSmall').textContent = user.username.charAt(0).toUpperCase();
        document.getElementById('userNameSmall').textContent = user.username;
        
        // Load forum data
        this.loadPosts();
        this.loadStats();
        this.loadTopUsers();
        this.loadRecentActivity();
        this.loadChatMessages();
        this.updateStorageInfo();
    },

    // ==================== POST FUNCTIONS ====================

    // Open create post modal
    openCreatePostModal() {
        document.getElementById('createPostModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    // Close create post modal
    closeCreatePostModal() {
        document.getElementById('createPostModal').classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form
        document.getElementById('postTitle').value = '';
        document.getElementById('postCategory').value = '';
        document.getElementById('postType').value = 'discussion';
        document.getElementById('postContent').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('charCount').textContent = '0';
    },

    // Create new post
    createPost(event) {
        event.preventDefault();
        
        const title = document.getElementById('postTitle').value.trim();
        const category = document.getElementById('postCategory').value;
        const type = document.getElementById('postType').value;
        const content = document.getElementById('postContent').value.trim();
        const tagsStr = document.getElementById('postTags').value.trim();

        // Validation
        if (!title || !category || !content) {
            Toast.error('Please fill in all required fields');
            return;
        }

        if (content.length > 5000) {
            Toast.error('Content must be under 5000 characters');
            return;
        }

        // Parse tags
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

        // Create post
        const post = DB.addPost({
            title,
            content,
            category,
            type,
            tags,
            author: this.currentUser.username,
            authorId: this.currentUser.id
        });

        this.closeCreatePostModal();
        Toast.success('Post published successfully!');
        
        this.loadPosts();
        this.loadStats();
        this.loadRecentActivity();
    },

    // Load and display posts
    loadPosts() {
        let posts = DB.getPosts();
        const container = document.getElementById('postsContainer');
        
        // Apply filters
        if (this.currentCategory !== 'all') {
            posts = posts.filter(p => p.category === this.currentCategory);
        }
        
        if (this.currentFilter === 'trending') {
            posts = posts.filter(p => p.likes >= 10).sort((a, b) => b.likes - a.likes);
        } else if (this.currentFilter === 'questions') {
            posts = posts.filter(p => p.type === 'question');
        } else if (this.currentFilter === 'tutorials') {
            posts = posts.filter(p => p.type === 'tutorial');
        } else if (this.currentFilter === 'tools') {
            posts = posts.filter(p => p.category === 'development' || p.category === 'tools');
        } else if (this.currentFilter === 'general') {
            posts = posts.filter(p => p.category === 'general' || p.category === 'offtopic');
        }
        
        // Apply search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            posts = posts.filter(p => 
                p.title.toLowerCase().includes(query) ||
                p.content.toLowerCase().includes(query) ||
                p.tags.some(t => t.toLowerCase().includes(query))
            );
        }

        // Sort (default: newest first, pinned first)
        posts.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Render posts
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

        container.innerHTML = posts.map(post => this.renderPostCard(post)).join('');
        
        // Update category counts
        this.updateCategoryCounts();
    },

    // Render single post card
    renderPostCard(post) {
        const timeAgo = this.timeAgo(post.createdAt);
        const typeColors = {
            discussion: '#4a6cf7',
            question: '#ff9500',
            tutorial: '#22c55e',
            showcase: '#a855f7',
            announcement: '#ef4444'
        };
        
        const categoryIcons = {
            bitcoin: 'fab fa-bitcoin text-orange',
            ethereum: 'fab fa-ethereum text-blue',
            security: 'fas fa-shield-alt text-green',
            wallets: 'fas fa-wallet text-purple',
            development: 'fas fa-code text-cyan',
            news: 'fas fa-newspaper text-red',
            offtopic: 'fas fa-coffee text-brown'
        };

        return `
            <div class="post-card" onclick="viewPost('${post.id}')">
                ${post.pinned ? '<div class="pinned-badge"><i class="fas fa-thumbtack"></i> Pinned</div>' : ''}
                <div class="post-header">
                    <span class="post-type" style="background: ${typeColors[post.type] || typeColors.discussion}">
                        ${post.type}
                    </span>
                    <span class="post-category">
                        <i class="${categoryIcons[post.category] || 'fas fa-folder'}"></i>
                        ${post.category}
                    </span>
                </div>
                <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                <p class="post-preview">${this.escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}</p>
                ${post.tags.length ? `<div class="post-tags">${post.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}
                <div class="post-footer">
                    <div class="post-author">
                        <div class="author-avatar">${post.author.charAt(0).toUpperCase()}</div>
                        <span class="author-name">${this.escapeHtml(post.author)}</span>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                    <div class="post-stats">
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                        <span><i class="fas fa-comment"></i> ${post.replies?.length || 0}</span>
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // View single post
    viewPost(postId) {
        const post = DB.getPostById(postId);
        if (!post) {
            Toast.error('Post not found');
            return;
        }

        // Increment views
        DB.updatePost(postId, { views: (post.views || 0) + 1 });
        post.views++;

        const modal = document.getElementById('viewPostModal');
        const content = document.getElementById('viewPostContent');

        const isLiked = DB.getLikes()[`${postId}_${this.currentUser?.id}`];

        content.innerHTML = `
            <article class="full-post">
                <div class="full-post-header">
                    <span class="post-type-badge">${post.type}</span>
                    <span class="post-cat-badge">${post.category}</span>
                </div>
                <h2 class="full-post-title">${this.escapeHtml(post.title)}</h2>
                <div class="full-post-meta">
                    <div class="post-author-info">
                        <div class="author-avatar-large">${post.author.charAt(0).toUpperCase()}</div>
                        <div>
                            <strong>${this.escapeHtml(post.author)}</strong>
                            <span class="post-date">${new Date(post.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}</span>
                        </div>
                    </div>
                    ${post.updatedAt !== post.createdAt ? `<span class="edited-badge"><i class="fas fa-edit"></i> Edited</span>` : ''}
                </div>
                <div class="full-post-content">${this.formatContent(post.content)}</div>
                ${post.tags.length ? `<div class="full-post-tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}
                <div class="full-post-actions">
                    <button onclick="toggleLike('${post.id}')" class="${isLiked ? 'liked' : ''}" id="likeBtn-${post.id}">
                        <i class="fas fa-heart"></i> <span id="likeCount-${post.id}">${post.likes}</span>
                    </button>
                    <button onclick="focusReply('${post.id}')">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button onclick="sharePost('${post.id}')">
                        <i class="fas fa-share"></i> Share
                    </button>
                    ${post.authorId === this.currentUser?.id ? `<button onclick="deleteMyPost('${post.id}')" class="text-danger"><i class="fas fa-trash"></i> Delete</button>` : ''}
                </div>
                
                <!-- Replies Section -->
                <div class="replies-section">
                    <h3><i class="fas fa-comments"></i> Replies (${post.replies?.length || 0})</h3>
                    <div class="replies-list" id="repliesList-${post.id}">
                        ${(post.replies || []).map(reply => `
                            <div class="reply-item">
                                <div class="reply-avatar">${reply.author.charAt(0).toUpperCase()}</div>
                                <div class="reply-content">
                                    <div class="reply-header">
                                        <strong>${this.escapeHtml(reply.author)}</strong>
                                        <span class="reply-time">${this.timeAgo(reply.createdAt)}</span>
                                    </div>
                                    <p>${this.escapeHtml(reply.content)}</p>
                                    <div class="reply-actions">
                                        <button onclick="likeReply('${post.id}', '${reply.id}')" class="${DB.getLikes()[`${reply.id}_${this.currentUser?.id}`] ? 'liked' : ''}">
                                            <i class="fas fa-heart"></i> ${reply.likes || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Reply Form -->
                    <form onsubmit="addReply(event, '${post.id}')" class="reply-form" id="replyForm-${post.id}">
                        <textarea placeholder="Write your reply..." rows="3" id="replyInput-${post.id}" required></textarea>
                        <button type="submit"><i class="fas fa-paper-plane"></i> Post Reply</button>
                    </form>
                </div>
            </article>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    // Close view post modal
    closeViewPostModal() {
        document.getElementById('viewPostModal').classList.add('hidden');
        document.body.style.overflow = '';
        this.loadPosts(); // Refresh to update view counts
    },

    // Toggle like on post
    toggleLike(postId) {
        if (!this.currentUser) {
            Toast.warning('Please login to like posts');
            return;
        }
        
        const liked = DB.toggleLike(postId, this.currentUser.id);
        const post = DB.getPostById(postId);
        
        const btn = document.getElementById(`likeBtn-${postId}`);
        const count = document.getElementById(`likeCount-${postId}`);
        
        if (btn && count) {
            btn.classList.toggle('liked', liked);
            count.textContent = post.likes;
        }
        
        Toast.success(liked ? 'Post liked!' : 'Like removed');
        this.loadPosts(); // Refresh post list
    },

    // Focus reply input
    focusReply(postId) {
        const input = document.getElementById(`replyInput-${postId}`);
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Add reply to post
    addReply(event, postId) {
        event.preventDefault();
        
        const input = document.getElementById(`replyInput-${postId}`);
        const content = input.value.trim();
        
        if (!content) {
            Toast.error('Please enter a reply');
            return;
        }
        
        const reply = DB.addReply(postId, {
            content,
            author: this.currentUser.username,
            authorId: this.currentUser.id
        });
        
        if (reply) {
            input.value = '';
            Toast.success('Reply posted!');
            this.viewPost(postId); // Refresh view
            this.loadStats();
        }
    },

    // Delete own post
    deleteMyPost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            DB.deletePost(postId);
            this.closeViewPostModal();
            Toast.success('Post deleted');
            this.loadPosts();
            this.loadStats();
        }
    },

    // Share post
    sharePost(postId) {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on CryptographyTube Forum',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            Toast.success('Link copied to clipboard!');
        }
    },

    // ==================== FILTERING & SEARCH ====================

    filterByTab(tab) {
        this.currentFilter = tab;
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Update feed title
        const titles = {
            all: '<i class="fas fa-stream"></i> Latest Posts',
            trending: '<i class="fas fa-fire"></i> Trending Posts',
            questions: '<i class="fas fa-question-circle"></i> Questions',
            tutorials: '<i class="fas fa-book"></i> Tutorials',
            tools: '<i class="fas fa-wrench"></i> Tools Discussion',
            general: '<i class="fas fa-comments"></i> General Chat'
        };
        document.getElementById('feedTitle').innerHTML = titles[tab] || titles.all;
        
        this.loadPosts();
    },

    filterCategory(category) {
        this.currentCategory = category;
        
        // Update active category
        document.querySelectorAll('.category-list li').forEach(li => {
            li.classList.toggle('active', li.dataset.cat === category);
        });
        
        this.loadPosts();
    },

    searchForum(query) {
        this.searchQuery = query;
        this.loadPosts();
    },

    sortPosts(sortBy) {
        let posts = DB.getPosts();
        
        switch(sortBy) {
            case 'oldest':
                posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'mostLiked':
                posts.sort((a, b) => b.likes - a.likes);
                break;
            case 'mostReplied':
                posts.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
                break;
            default: // newest
                posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        DB.savePosts(posts);
        this.loadPosts();
    },

    // ==================== STATS & SIDEBAR ====================

    loadStats() {
        const users = DB.getUsers();
        const posts = DB.getPosts();
        
        let totalReplies = 0;
        posts.forEach(p => totalReplies += (p.replies?.length || 0));
        
        const topics = [...new Set(posts.map(p => p.category))];
        
        document.getElementById('totalMembers').textContent = users.length;
        document.getElementById('totalPosts').textContent = posts.length;
        document.getElementById('totalReplies').textContent = totalReplies;
        document.getElementById('totalTopics').textContent = topics.length;
    },

    loadTopUsers() {
        const users = DB.getUsers()
            .sort((a, b) => b.reputation - a.reputation)
            .slice(0, 5);
        
        const list = document.getElementById('topUsersList');
        list.innerHTML = users.map((user, i) => `
            <li>
                <span class="rank">${i + 1}</span>
                <div class="user-avatar-xs">${user.username.charAt(0)}</div>
                <div class="user-info">
                    <span class="username">${this.escapeHtml(user.username)}</span>
                    <span class="rep"><i class="fas fa-star"></i> ${user.reputation}</span>
                </div>
            </li>
        `).join('');
    },

    loadRecentActivity() {
        const posts = DB.getPosts().slice(0, 5);
        const list = document.getElementById('activityList');
        
        list.innerHTML = posts.map(post => `
            <li onclick="viewPost('${post.id}')">
                <i class="fas fa-file-alt"></i>
                <div>
                    <strong>${this.escapeHtml(post.title.substring(0, 30))}${post.title.length > 30 ? '...' : ''}</strong>
                    <small>${this.timeAgo(post.createdAt)}</small>
                </div>
            </li>
        `).join('');
    },

    updateCategoryCounts() {
        const posts = DB.getPosts();
        
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
    },

    updateStorageInfo() {
        const info = DB.getStorageInfo();
        document.getElementById('storageFill').style.width = info.percent + '%';
        document.getElementById('storageUsed').textContent = info.usedKB + ' KB';
    },

    // ==================== CHAT FUNCTIONS ====================

    loadChatMessages() {
        const messages = DB.getChat();
        const container = document.getElementById('chatMessages');
        
        container.innerHTML = messages.map(msg => {
            if (msg.isSystem) {
                return `<div class="chat-msg system-msg"><em>${msg.message}</em></div>`;
            }
            const isOwn = msg.user === this.currentUser?.username;
            return `
                <div class="chat-msg ${isOwn ? 'own-msg' : ''}">
                    <div class="msg-avatar">${msg.user.charAt(0)}</div>
                    <div class="msg-body">
                        <span class="msg-user">${this.escapeHtml(msg.user)}</span>
                        <p>${this.escapeHtml(msg.message)}</p>
                        <small class="msg-time">${this.timeAgo(msg.timestamp)}</small>
                    </div>
                </div>
            `;
        }).join('');
        
        container.scrollTop = container.scrollHeight;
    },

    sendChatMessage(event) {
        event.preventDefault();
        
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Handle commands
        if (message.startsWith('/')) {
            this.handleChatCommand(message);
            input.value = '';
            return;
        }
        
        const msg = DB.addChatMessage({
            user: this.currentUser.username,
            message,
            isSystem: false
        });
        
        input.value = '';
        this.loadChatMessages();
    },

    handleChatCommand(cmd) {
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        
        switch(command) {
            case '/help':
                Toast.info('Commands: /help, /users, /clear, /emojis');
                break;
            case '/users':
                const users = DB.getUsers().filter(u => u.isOnline).map(u => u.username);
                Toast.info(`Online: ${users.join(', ')}`);
                break;
            case '/clear':
                DB.saveChat([]);
                this.loadChatMessages();
                Toast.success('Chat cleared');
                break;
            case '/emojis':
                Toast.info('Emojis: 😄 ❤️ 🔥 👍 🎉 💯 🚀 ⭐');
                break;
            default:
                Toast.warning('Unknown command. Type /help for commands.');
        }
    },

    // ==================== PROFILE FUNCTIONS ====================

    viewProfile() {
        this.toggleUserMenu();
        
        if (!this.currentUser) return;
        
        const user = DB.getUserById(this.currentUser.id) || this.currentUser;
        const posts = DB.getPosts().filter(p => p.authorId === user.id);
        
        document.getElementById('profileAvatarLarge').textContent = user.username.charAt(0).toUpperCase();
        document.getElementById('profileName').textContent = user.username;
        document.getElementById('profileBio').textContent = user.bio || 'No bio yet';
        document.getElementById('profilePosts').textContent = user.postCount || posts.length;
        document.getElementById('profileLikes').textContent = user.likesReceived || 0;
        document.getElementById('profileJoined').textContent = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        document.getElementById('profilePostsList').innerHTML = posts.length ? posts.slice(0, 5).map(p => `
            <div class="profile-post-item" onclick="closeProfileModal(); viewPost('${p.id}')">
                <h5>${this.escapeHtml(p.title.substring(0, 40))}${p.title.length > 40 ? '...' : ''}</h5>
                <small>${this.timeAgo(p.createdAt)} • ${p.likes} likes</small>
            </div>
        `).join('') : '<p class="no-posts-yet">No posts yet</p>';
        
        document.getElementById('profileModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    closeProfileModal() {
        document.getElementById('profileModal').classList.add('hidden');
        document.body.style.overflow = '';
    },

    editProfile() {
        this.toggleUserMenu();
        
        const user = this.currentUser;
        document.getElementById('editDisplayName').value = user.username;
        document.getElementById('editBio').value = user.bio || '';
        
        document.getElementById('editProfileModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    closeEditProfileModal() {
        document.getElementById('editProfileModal').classList.add('hidden');
        document.body.style.overflow = '';
    },

    saveProfile(event) {
        event.preventDefault();
        
        const displayName = document.getElementById('editDisplayName').value.trim();
        const bio = document.getElementById('editBio').value.trim();
        
        if (!displayName) {
            Toast.error('Display name is required');
            return;
        }
        
        DB.updateUser(this.currentUser.id, { username: displayName, bio });
        this.currentUser = { ...this.currentUser, username: displayName, bio };
        DB.setCurrentUser(this.currentUser);
        
        // Update UI
        document.getElementById('userAvatarSmall').textContent = displayName.charAt(0).toUpperCase();
        document.getElementById('userNameSmall').textContent = displayName;
        
        this.closeEditProfileModal();
        Toast.success('Profile updated!');
    },

    // Toggle user dropdown
    toggleUserMenu() {
        document.getElementById('userDropdown').classList.toggle('hidden');
    },

    // ==================== DATA MANAGEMENT ====================

    exportData() {
        this.toggleUserMenu();
        
        const data = DB.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cryptotube-forum-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        Toast.success('Data exported successfully!');
    },

    importDataClick() {
        this.toggleUserMenu();
        document.getElementById('importFileInput').click();
    },

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                DB.importAll(data);
                Toast.success('Data imported! Refreshing...');
                setTimeout(() => location.reload(), 1000);
            } catch (err) {
                Toast.error('Invalid backup file');
            }
        };
        reader.readAsText(file);
    },

    clearAllData() {
        if (confirm('⚠️ This will delete ALL forum data including posts, users, and chat. Are you sure?')) {
            if (confirm('This cannot be undone! Continue?')) {
                DB.clearAll();
                Toast.success('All data cleared. Refreshing...');
                setTimeout(() => location.reload(), 1000);
            }
        }
    },

    // ==================== UTILITY FUNCTIONS ====================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatContent(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^\d\. (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/\n/g, '<br>');
    },

    timeAgo(dateString) {
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
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'just now';
    },

    closeAllModals() {
        this.closeCreatePostModal();
        this.closeViewPostModal();
        this.closeProfileModal();
        this.closeEditProfileModal();
    },

    showGuidelines() {
        alert('Community Guidelines:\n\n1. Be respectful to all members\n2. No spam or self-promotion\n3. No sharing of private keys or sensitive information\n4. Stay on topic\n5. Help others learn and grow\n\nViolations may result in account suspension.');
    }
};

// ==================== GLOBAL FUNCTIONS (for HTML onclick) ====================
function showRegister() { ForumApp.showRegister(); }
function showLogin() { ForumApp.showLogin(); }
function togglePassword(id, btn) { ForumApp.togglePassword(id, btn); }
function emailLogin(e) { ForumApp.emailLogin(e); }
function emailRegister(e) { ForumApp.emailRegister(e); }
function googleLogin() { ForumApp.googleLogin(); }
function githubLogin() { ForumApp.githubLogin(); }
function logout() { ForumApp.logout(); }
function openCreatePostModal() { ForumApp.openCreatePostModal(); }
function closeCreatePostModal() { ForumApp.closeCreatePostModal(); }
function createPost(e) { ForumApp.createPost(e); }
function viewPost(id) { ForumApp.viewPost(id); }
function closeViewPostModal() { ForumApp.closeViewPostModal(); }
function toggleLike(id) { ForumApp.toggleLike(id); }
function focusReply(id) { ForumApp.focusReply(id); }
function addReply(e, id) { ForumApp.addReply(e, id); }
function deleteMyPost(id) { ForumApp.deleteMyPost(id); }
function sharePost(id) { ForumApp.sharePost(id); }
function filterByTab(tab) { ForumApp.filterByTab(tab); }
function filterCategory(cat) { ForumApp.filterCategory(cat); }
function searchForum(q) { ForumApp.searchForum(q); }
function sortPosts(v) { ForumApp.sortPosts(v); }
function sendChatMessage(e) { ForumApp.sendChatMessage(e); }
function viewProfile() { ForumApp.viewProfile(); }
function closeProfileModal() { ForumApp.closeProfileModal(); }
function editProfile() { ForumApp.editProfile(); }
function closeEditProfileModal() { ForumApp.closeEditProfileModal(); }
function saveProfile(e) { ForumApp.saveProfile(e); }
function toggleUserMenu() { ForumApp.toggleUserMenu(); }
function exportData() { ForumApp.exportData(); }
function importDataClick() { ForumApp.importDataClick(); }
function handleImportFile(e) { ForumApp.handleImportFile(e); }
function clearAllData() { ForumApp.clearAllData(); }
function showGuidelines() { ForumApp.showGuidelines(); }

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    ForumApp.init();
});
