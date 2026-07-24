// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// 100% Client-Side Application (GitHub Pages Ready)
// Data stored in localStorage
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
        LIKES: 'ct_forum_likes'
    },

    // Initialize database with default data
    init() {
        // Create default users if not exists
        if (!localStorage.getItem(this.KEYS.USERS)) {
            const defaultUsers = [
                { id: 'admin', username: 'CryptoMaster99', password: 'demo', email: '', bio: 'Forum Admin & Crypto Expert', createdAt: new Date().toISOString(), postCount: 5, likesReceived: 150, reputation: 500 },
                { id: 'user1', username: 'EthDev_Pro', password: 'demo', email: '', bio: 'Ethereum Developer', createdAt: new Date(Date.now() - 86400000).toISOString(), postCount: 12, likesReceived: 89, reputation: 320 },
                { id: 'user2', username: 'BlockchainNinja', password: 'demo', email: '', bio: 'Blockchain Enthusiast', createdAt: new Date(Date.now() - 172800000).toISOString(), postCount: 8, likesReceived: 45, reputation: 180 },
                { id: 'user3', username: 'SecurityExpert', password: 'demo', email: '', bio: 'Security Researcher', createdAt: new Date(Date.now() - 259200000).toISOString(), postCount: 15, likesReceived: 200, reputation: 450 }
            ];
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(defaultUsers));
        }

        // Create sample posts if not exists
        if (!localStorage.getItem(this.KEYS.POSTS)) {
            const now = new Date();
            const samplePosts = [
                {
                    id: 'post_1',
                    authorId: 'admin',
                    authorName: 'CryptoMaster99',
                    title: 'Welcome to CryptographyTube Community! 🎉',
                    content: 'Welcome everyone! This is our community forum where we discuss:\n\n• Bitcoin & Cryptocurrency\n• Security Best Practices\n• Development Tools\n• Wallet Management\n\nFeel free to introduce yourself and start posting!',
                    category: 'general',
                    type: 'announcement',
                    tags: ['welcome', 'community', 'introduction'],
                    likes: 25,
                    views: 350,
                    comments: [],
                    isPinned: true,
                    createdAt: new Date(now - 3600000 * 24).toISOString()
                },
                {
                    id: 'post_2',
                    authorId: 'user1',
                    authorName: 'EthDev_Pro',
                    title: 'Understanding Ethereum Smart Contracts for Beginners',
                    content: 'In this post, I will explain the basics of Ethereum smart contracts:\n\n1. What are Smart Contracts?\nSmart contracts are self-executing contracts with the terms directly written into code.\n\n2. How do they work?\nThey run on the Ethereum Virtual Machine (EVM).\n\n3. Why are they useful?\nThey enable trustless transactions without intermediaries.\n\nLet me know if you have any questions!',
                    category: 'ethereum',
                    type: 'tutorial',
                    tags: ['ethereum', 'smart-contracts', 'beginner', 'tutorial'],
                    likes: 42,
                    views: 520,
                    comments: [],
                    isPinned: false,
                    createdAt: new Date(now - 3600000 * 12).toISOString()
                },
                {
                    id: 'post_3',
                    authorId: 'user2',
                    authorName: 'BlockchainNinja',
                    title: 'Question: What is the best hardware wallet in 2024?',
                    content: 'I am looking to buy a hardware wallet for my crypto assets. What would you recommend?\n\nI have been looking at:\n- Ledger Nano X\n- Trezor Model T\n- SafePal\n\nWhat has been your experience? Which one offers the best security and usability?',
                    category: 'wallets',
                    type: 'question',
                    tags: ['wallet', 'hardware-wallet', 'ledger', 'trezor', 'question'],
                    likes: 18,
                    views: 290,
                    comments: [],
                    isPinned: false,
                    createdAt: new Date(now - 3600000 * 6).toISOString()
                },
                {
                    id: 'post_4',
                    authorId: 'user3',
                    authorName: 'SecurityExpert',
                    title: '🚨 IMPORTANT: Security Tips for Protecting Your Crypto',
                    content: 'Here are essential security tips every crypto user should follow:\n\n🔐 NEVER share your private keys or seed phrases\n🔐 Use unique passwords for each exchange\n🔐 Enable 2FA everywhere possible\n🔐 Keep your software updated\n🔐 Be aware of phishing attempts\n🔐 Use hardware wallets for large amounts\n\nStay safe out there!',
                    category: 'security',
                    type: 'announcement',
                    tags: ['security', 'tips', 'safety', 'important'],
                    likes: 67,
                    views: 890,
                    comments: [],
                    isPinned: true,
                    createdAt: new Date(now - 3600000 * 48).toISOString()
                },
                {
                    id: 'post_5',
                    authorId: 'admin',
                    authorName: 'CryptoMaster99',
                    title: 'Building a Bitcoin Address Generator from Scratch (Python)',
                    content: 'Today I want to share how to build a Bitcoin address generator using Python.\n\nRequired libraries:\n- elliptic (for ECDSA)\n- hashlib (for SHA256)\n- base58 (for encoding)\n\nThe process involves:\n1. Generate private key (256-bit random number)\n2. Derive public key using ECDSA\n3. Hash the public key (SHA256 + RIPEMD160)\n4. Encode with Base58Check\n\nWould anyone like me to create a detailed tutorial on this?',
                    category: 'development',
                    type: 'discussion',
                    tags: ['bitcoin', 'python', 'development', 'tutorial', 'address-generator'],
                    likes: 34,
                    views: 450,
                    comments: [],
                    isPinned: false,
                    createdAt: new Date(now - 3600000 * 72).toISOString()
                }
            ];
            localStorage.setItem(this.KEYS.POSTS, JSON.stringify(samplePosts));
        }

        // Create sample chat messages if not exists
        if (!localStorage.getItem(this.KEYS.CHAT)) {
            const now = new Date();
            const sampleChat = [
                { id: 'chat_1', senderId: 'admin', senderName: 'CryptoMaster99', message: 'Welcome to the community chat! 👋', timestamp: new Date(now - 3600000).toISOString() },
                { id: 'chat_2', senderId: 'user1', senderName: 'EthDev_Pro', message: 'Thanks for having us here!', timestamp: new Date(now - 1800000).toISOString() },
                { id: 'chat_3', senderId: 'user2', senderName: 'BlockchainNinja', message: 'Excited to learn and share knowledge! 🚀', timestamp: new Date(now - 900000).toISOString() }
            ];
            localStorage.setItem(this.KEYS.CHAT, JSON.stringify(sampleChat));
        }

        console.log('✅ Database initialized');
    },

    // Generic get/set methods
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },

    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            showToast('Storage full! Please clear some data.', 'error');
            return false;
        }
    },

    // Users
    getUsers() { return this.get(this.KEYS.USERS); },
    saveUsers(users) { return this.set(this.KEYS.USERS, users); },
    
    findUser(username) {
        return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    createUser(userData) {
        const users = this.getUsers();
        userData.id = 'user_' + Date.now();
        userData.createdAt = new Date().toISOString();
        userData.postCount = 0;
        userData.likesReceived = 0;
        userData.reputation = 10;
        users.push(userData);
        this.saveUsers(users);
        return userData;
    },

    // Posts
    getPosts() { return this.get(this.KEYS.POSTS); },
    savePosts(posts) { return this.set(this.KEYS.POSTS, posts); },
    
    addPost(postData) {
        const posts = this.getPosts();
        postData.id = 'post_' + Date.now();
        postData.likes = 0;
        postData.views = 0;
        postData.comments = [];
        postData.isPinned = false;
        postData.createdAt = new Date().toISOString();
        posts.unshift(postData);
        this.savePosts(posts);
        
        // Update user post count
        this.incrementUserPostCount(postData.authorId);
        
        return postData;
    },

    likePost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            this.savePosts(posts);
            
            // Update author's received likes
            const users = this.getUsers();
            const user = users.find(u => u.id === post.authorId);
            if (user) {
                user.likesReceived = (user.likesReceived || 0) + 1;
                user.reputation = (user.reputation || 0) + 1;
                this.saveUsers(users);
            }
        }
        return post;
    },

    incrementUserPostCount(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.postCount = (user.postCount || 0) + 1;
            user.reputation = (user.reputation || 0) + 5;
            this.saveUsers(users);
        }
    },

    // Comments
    getComments() { return this.get(this.KEYS.COMMENTS); },
    saveComments(comments) { return this.set(this.KEYS.COMMENTS, comments); },
    
    addComment(postId, commentData) {
        const comments = this.getComments();
        commentData.id = 'comment_' + Date.now();
        commentData.postId = postId;
        commentData.likes = 0;
        commentData.createdAt = new Date().toISOString();
        comments.push(commentData);
        this.saveComments(comments);
        
        // Add comment to post
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push(commentData.id);
            this.savePosts(posts);
        }
        
        return commentData;
    },

    getPostComments(postId) {
        return this.getComments().filter(c => c.postId === postId);
    },

    // Chat
    getChatMessages() { return this.get(this.KEYS.CHAT); },
    saveChat(messages) { return this.set(this.KEYS.CHAT, messages); },
    
    addChatMessage(messageData) {
        const messages = this.getChatMessages();
        messageData.id = 'chat_' + Date.now();
        messageData.timestamp = new Date().toISOString();
        messages.push(messageData);
        
        // Keep only last 100 messages
        if (messages.length > 100) {
            messages.splice(0, messages.length - 100);
        }
        
        this.saveChat(messages);
        return messageData;
    },

    // Current User
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
        } catch {
            return null;
        }
    },

    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    },

    clearCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // Storage info
    getStorageInfo() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return {
            used: total,
            usedKB: Math.round(total / 1024),
            maxKB: 5120, // ~5MB typical limit
            percent: Math.min(100, (total / (5 * 1024 * 1024)) * 100)
        };
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        this.init(); // Reinitialize with defaults
    },

    // Export all data
    exportAll() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        data.exportDate = new Date().toISOString();
        data.version = '1.0';
        return data;
    },

    // Import data
    importAll(data) {
        if (!data.version) throw new Error('Invalid backup file');
        Object.entries(this.KEYS).forEach(([name, key]) => {
            if (data[name]) {
                this.set(key, data[name]);
            }
        });
    }
};

// ==================== GLOBAL STATE ====================
let currentUser = null;
let allPosts = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'newest';

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    DB.init();
    
    // Check for logged-in user
    currentUser = DB.getCurrentUser();
    
    if (currentUser) {
        showForumSection();
    } else {
        showAuthSection();
    }
    
    // Setup character counter
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.addEventListener('input', updateCharCount);
    }
});

// ==================== AUTH FUNCTIONS ====================
function showAuthSection() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('forumSection').classList.add('hidden');
}

function showForumSection() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('forumSection').classList.remove('hidden');
    
    // Update UI with user info
    updateUserUI();
    
    // Load forum data
    loadPosts();
    loadStats();
    loadTopUsers();
    loadRecentActivity();
    loadChatMessages();
    updateStorageInfo();
}

function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function showLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

function togglePassword(inputId, btn) {
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
}

function emailLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Find user (demo mode: accepts any password)
    let user = DB.findUser(username);
    
    if (!user) {
        // Auto-register for demo mode
        user = DB.createUser({ username, password, email: '' });
    }
    
    // Set as current user
    currentUser = user;
    DB.setCurrentUser(user);
    
    showToast(`Welcome back, ${user.username}! 👋`, 'success');
    showForumSection();
}

function emailRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!username || !password) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (password.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the guidelines', 'error');
        return;
    }
    
    // Check if username exists
    if (DB.findUser(username)) {
        showToast('Username already taken', 'error');
        return;
    }
    
    // Create user
    const user = DB.createUser({ username, email, password });
    currentUser = user;
    DB.setCurrentUser(user);
    
    showToast('Account created! Welcome to the community! 🎉', 'success');
    showForumSection();
}

function logout() {
    currentUser = null;
    DB.clearCurrentUser();
    showAuthSection();
    showToast('Logged out successfully. See you soon! 👋', 'info');
    
    // Close dropdown
    document.getElementById('userDropdown')?.classList.add('hidden');
}

// ==================== USER UI UPDATES ====================
function updateUserUI() {
    if (!currentUser) return;
    
    // Update avatar
    const avatarEl = document.getElementById('userAvatarSmall');
    if (avatarEl) {
        avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    
    // Update name
    const nameEl = document.getElementById('userNameSmall');
    if (nameEl) {
        nameEl.textContent = currentUser.username;
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown?.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    if (menu && !menu.contains(e.target) && dropdown) {
        dropdown.classList.add('hidden');
    }
});

// ==================== POSTS FUNCTIONS ====================
function loadPosts() {
    allPosts = DB.getPosts();
    renderPosts(allPosts);
    updateCategoryCounts(allPosts);
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No posts yet</h3>
                <p>Be the first to start a discussion!</p>
                <button onclick="openCreatePostModal()" class="btn-primary">
                    <i class="fas fa-plus"></i> Create Post
                </button>
            </div>`;
        return;
    }
    
    // Sort posts
    let sortedPosts = sortPostsArray(posts, currentSort);
    
    // Pinned posts first
    const pinned = sortedPosts.filter(p => p.isPinned);
    const unpinned = sortedPosts.filter(p => !p.isPinned);
    sortedPosts = [...pinned, ...unpinned];
    
    let html = '';
    sortedPosts.forEach(post => {
        html += createPostCard(post);
    });
    
    container.innerHTML = html;
}

function createPostCard(post) {
    const timeAgo = getTimeAgo(post.createdAt);
    const categoryClass = post.category || 'general';
    const initial = post.authorName ? post.authorName.charAt(0).toUpperCase() : '?';
    
    return `
        <div class="post-card ${categoryClass}" onclick="viewPost('${post.id}')">
            <div class="post-card-header">
                <div class="post-author-avatar">${initial}</div>
                <div class="post-meta">
                    <span class="post-author-name">${escapeHtml(post.authorName)}</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <span class="post-category-badge badge-${categoryClass}">${post.category || 'General'}</span>
            </div>
            ${post.isPinned ? '<div style="font-size:11px;color:#ff9500;margin-bottom:8px;"><i class="fas fa-thumbtack"></i> Pinned</div>' : ''}
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-preview">${escapeHtml(post.content.substring(0, 200))}...</p>
            <div class="post-footer">
                <span class="post-stat" onclick="event.stopPropagation(); likePost('${post.id}')">
                    <i class="fas fa-heart"></i> ${post.likes || 0}
                </span>
                <span class="post-stat">
                    <i class="fas fa-comment"></i> ${(post.comments || []).length}
                </span>
                <span class="post-stat">
                    <i class="fas fa-eye"></i> ${formatNumber(post.views || 0)}
                </span>
            </div>
        </div>
    `;
}

function sortPostsArray(posts, sortBy) {
    const sorted = [...posts];
    switch(sortBy) {
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'mostLiked':
            return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'mostReplied':
            return sorted.sort((a, b) => (b.comments || []).length - (a.comments || []).length);
        case 'newest':
        default:
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

function sortPosts(sortBy) {
    currentSort = sortBy;
    renderPosts(filterPosts(allPosts));
}

function filterByTab(tab) {
    currentFilter = tab;
    
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-tab="${tab}"]`)?.classList.add('active');
    
    const titles = {
        'all': '<i class="fas fa-stream"></i> Latest Posts',
        'trending': '<i class="fas fa-fire"></i> Trending Posts',
        'questions': '<i class="fas fa-question-circle"></i> Questions',
        'tutorials': '<i class="fas fa-book"></i> Tutorials',
        'tools': '<i class="fas fa-wrench"></i> Tools Discussion',
        'general': '<i class="fas fa-comments"></i> General Chat'
    };
    
    document.getElementById('feedTitle').innerHTML = titles[tab] || titles['all'];
    
    let filtered = filterPosts(allPosts);
    
    if (tab === 'questions') filtered = filtered.filter(p => p.type === 'question');
    else if (tab === 'tutorials') filtered = filtered.filter(p => p.type === 'tutorial');
    else if (tab === 'tools') filtered = filtered.filter(p => p.category === 'development' || p.tags?.includes('tools'));
    else if (tab === 'trending') filtered = sortPostsArray(filtered, 'mostLiked').slice(0, 10);
    
    renderPosts(filtered);
}

function filterCategory(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.category-list li[data-cat="${category}"]`)?.classList.add('active');
    
    renderPosts(filterPosts(allPosts));
}

function filterPosts(posts) {
    if (currentCategory !== 'all') {
        return posts.filter(p => p.category === currentCategory);
    }
    return [...posts];
}

function searchForum(query) {
    if (!query.trim()) {
        renderPosts(filterPosts(allPosts));
        return;
    }
    
    const q = query.toLowerCase();
    const results = allPosts.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.includes(q)) ||
        p.authorName?.toLowerCase().includes(q)
    );
    
    document.getElementById('feedTitle').innerHTML = `<i class="fas fa-search"></i> Search: "${query}"`;
    renderPosts(results);
}

// ==================== CREATE POST ====================
function openCreatePostModal() {
    if (!currentUser) {
        showToast('Please login to create a post', 'warning');
        showAuthSection();
        return;
    }
    
    document.getElementById('createPostModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCreatePostModal() {
    document.getElementById('createPostModal').classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postTags').value = '';
    document.getElementById('postCategory').value = '';
    document.getElementById('charCount').textContent = '0';
}

function createPost(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;
    const type = document.getElementById('postType').value;
    const tagsInput = document.getElementById('postTags').value.trim();
    
    if (!title || !content || !category) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    if (title.length < 10) {
        showToast('Title too short (min 10 chars)', 'error');
        return;
    }
    
    if (content.length < 20) {
        showToast('Content too short (min 20 chars)', 'error');
        return;
    }
    
    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    
    const postData = {
        authorId: currentUser.id,
        authorName: currentUser.username,
        title,
        content,
        category,
        type,
        tags
    };
    
    DB.addPost(postData);
    
    showToast('Post published successfully! 🎉', 'success');
    closeCreatePostModal();
    loadPosts();
    loadStats();
}

function updateCharCount() {
    const textarea = document.getElementById('postContent');
    const count = document.getElementById('charCount');
    if (count && textarea) count.textContent = textarea.value.length;
}

// ==================== VIEW POST ====================
function viewPost(postId) {
    const modal = document.getElementById('viewPostModal');
    const content = document.getElementById('viewPostContent');
    
    content.innerHTML = '<div class="loading-posts"><div class="spinner"></div><p>Loading...</p></div>';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    const posts = DB.getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        content.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Post not found</h3></div>';
        return;
    }
    
    // Increment views
    post.views = (post.views || 0) + 1;
    DB.savePosts(posts);
    
    const initial = post.authorName ? post.authorName.charAt(0).toUpperCase() : '?';
    const comments = DB.getPostComments(postId);
    
    content.innerHTML = `
        <article class="full-post">
            <header class="full-post-header">
                <div class="post-author-avatar" style="width:50px;height:50px;font-size:20px;">${initial}</div>
                <div>
                    <strong>${escapeHtml(post.authorName)}</strong><br>
                    <small class="post-time">${getTimeAgo(post.createdAt)}</small>
                </div>
                <span class="post-category-badge badge-${post.category}">${post.category}</span>
            </header>
            
            <h1 class="full-post-title">${escapeHtml(post.title)}</h1>
            <div class="full-post-content">${escapeHtml(post.content)}</div>
            
            ${post.tags && post.tags.length ? `<div class="post-tags">${post.tags.map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
            
            <footer class="full-post-footer">
                <div class="action-buttons">
                    <button class="action-btn" onclick="likePost('${post.id}')"><i class="fas fa-heart"></i> ${post.likes || 0}</button>
                    <button class="action-btn" onclick="sharePost('${post.id}')"><i class="fas fa-share"></i></button>
                </div>
                <small>${formatNumber(post.views || 0)} views • ${comments.length} replies</small>
            </footer>
            
            <section class="comments-section">
                <h4><i class="fas fa-comments"></i> Discussion (${comments.length})</h4>
                
                <form onsubmit="addComment(event, '${post.id}')" class="comment-form">
                    <textarea id="commentInput" placeholder="Write a comment..." rows="3" required></textarea>
                    <button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Post Comment</button>
                </form>
                
                <div id="commentsList">
                    ${comments.map(c => createCommentHTML(c)).join('')}
                </div>
            </section>
        </article>`;
}

function closeViewPostModal() {
    document.getElementById('viewPostModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function createCommentHTML(comment) {
    const initial = comment.senderName ? comment.senderName.charAt(0).toUpperCase() : '?';
    return `
        <div class="comment-item">
            <div class="comment-avatar">${initial}</div>
            <div class="comment-body">
                <div class="comment-header">
                    <strong>${escapeHtml(comment.senderName)}</strong>
                    <span class="comment-time">${getTimeAgo(comment.createdAt)}</span>
                </div>
                <p class="comment-text">${escapeHtml(comment.content)}</p>
                <div class="comment-actions">
                    <button><i class="fas fa-heart"></i> ${comment.likes || 0}</button>
                </div>
            </div>
        </div>`;
}

function addComment(event, postId) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to comment', 'warning');
        return;
    }
    
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const comment = DB.addComment(postId, {
        senderId: currentUser.id,
        senderName: currentUser.username,
        content: text
    });
    
    input.value = '';
    showToast('Comment added!', 'success');
    
    // Refresh view
    viewPost(postId);
    loadPosts();
}

function likePost(postId) {
    const post = DB.likePost(postId);
    if (post) {
        showToast('Post liked! ❤️', 'success');
        renderPosts(filterPosts(allPosts));
    }
}

function sharePost(postId) {
    if (navigator.share) {
        navigator.share({ title: 'CryptographyTube Forum Post', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied! 📋', 'success');
    }
}

// ==================== CHAT FUNCTIONS ====================
function loadChatMessages() {
    const container = document.getElementById('chatMessages');
    const messages = DB.getChatMessages();
    
    if (!messages || messages.length === 0) {
        container.innerHTML = '<div class="chat-welcome"><i class="fas fa-rocketchat"></i><p>Welcome to Community Chat!</p><small>Data stored in your browser</small></div>';
        return;
    }
    
    let html = '';
    messages.forEach(msg => {
        const isSelf = currentUser && msg.senderId === currentUser.id;
        html += `
            <div class="chat-message ${isSelf ? 'self' : ''}">
                <div>
                    <span class="sender">${msg.senderName}${isSelf ? ' (You)' : ''}</span>
                    <div class="text">${escapeHtml(msg.message)}</div>
                    <span class="time">${formatChatTime(msg.timestamp)}</span>
                </div>
            </div>`;
    });
    
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to chat', 'warning');
        return;
    }
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    if (message.length > 500) {
        showToast('Message too long (max 500 chars)', 'error');
        return;
    }
    
    DB.addChatMessage({
        senderId: currentUser.id,
        senderName: currentUser.username,
        message
    });
    
    input.value = '';
    loadChatMessages();
}

// ==================== STATS & SIDEBAR ====================
function loadStats() {
    const posts = DB.getPosts();
    const users = DB.getUsers();
    const comments = DB.getComments();
    
    animateNumber('totalMembers', users.length);
    animateNumber('totalPosts', posts.length);
    animateNumber('totalReplies', comments.length);
    animateNumber('totalTopics', posts.length);
    
    // Simulated online count
    document.getElementById('onlineUsers').textContent = Math.floor(Math.random() * 30) + 10;
}

function loadTopUsers() {
    const container = document.getElementById('topUsersList');
    const users = DB.getUsers()
        .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
        .slice(0, 5);
    
    let html = '';
    users.forEach((user, i) => {
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
        const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';
        html += `
            <li>
                <span class="rank ${rankClass}">${i + 1}</span>
                <div class="user-avatar-mini">${initial}</div>
                <div class="user-info">
                    <span class="username">${escapeHtml(user.username)}</span>
                    <span class="rep-score">${user.reputation || 0} rep</span>
                </div>
            </li>`;
    });
    
    container.innerHTML = html;
}

function loadRecentActivity() {
    const container = document.getElementById('activityList');
    const posts = DB.getPosts().slice(0, 5);
    
    let html = '';
    posts.forEach(post => {
        html += `
            <li>
                <span class="activity-icon"><i class="fas fa-edit"></i></span>
                <span class="activity-text"><strong>${escapeHtml(post.authorName)}</strong> posted "${escapeHtml(post.title.substring(0, 30))}..."</span>
            </li>`;
    });
    
    container.innerHTML = html || '<li>No recent activity</li>';
}

function updateStorageInfo() {
    const info = DB.getStorageInfo();
    const fill = document.getElementById('storageFill');
    const text = document.getElementById('storageUsed');
    
    if (fill) fill.style.width = info.percent + '%';
    if (text) text.textContent = info.usedKB + ' KB';
}

function updateCategoryCounts(posts) {
    const categories = ['all', 'bitcoin', 'ethereum', 'security', 'wallets', 'development', 'news', 'offtopic'];
    
    categories.forEach(cat => {
        const el = document.getElementById(`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}Count`);
        if (el) {
            el.textContent = cat === 'all' ? posts.length : posts.filter(p => p.category === cat).length;
        }
    });
}

// ==================== PROFILE ====================
function viewProfile() {
    if (!currentUser) return;
    
    const modal = document.getElementById('profileModal');
    
    document.getElementById('profileAvatarLarge').textContent = currentUser.username.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileBio').textContent = currentUser.bio || 'Crypto enthusiast & community member';
    document.getElementById('profilePosts').textContent = currentUser.postCount || 0;
    document.getElementById('profileLikes').textContent = currentUser.likesReceived || 0;
    document.getElementById('profileJoined').textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '-';
    
    // Show user's posts
    const posts = DB.getPosts().filter(p => p.authorId === currentUser.id);
    const list = document.getElementById('profilePostsList');
    list.innerHTML = posts.length ? posts.map(p => `<p style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(p.title)}<br><small>${getTimeAgo(p.createdAt)}</small></p>`).join('') : '<p style="color:#888;">No posts yet</p>';
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('userDropdown')?.classList.add('hidden');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// ==================== DATA MANAGEMENT ====================
function exportData() {
    try {
        const data = DB.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cryptographytube-forum-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('Data exported successfully! 💾', 'success');
        document.getElementById('userDropdown')?.classList.add('hidden');
    } catch (e) {
        showToast('Export failed: ' + e.message, 'error');
    }
}

function importData() {
    document.getElementById('importFileInput').click();
    document.getElementById('userDropdown')?.classList.add('hidden');
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            DB.importAll(data);
            
            showToast('Data imported successfully! ✅', 'success');
            
            // Reload everything
            if (currentUser) {
                showForumSection();
            }
        } catch (err) {
            showToast('Invalid backup file', 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

function clearAllData() {
    if (confirm('⚠️ Are you sure? This will delete ALL forum data including posts, comments, and chat history!')) {
        DB.clearAll();
        showToast('All data cleared', 'info');
        if (currentUser) {
            showForumSection();
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secs] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secs);
        if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
    
    return 'just now';
}

function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const start = parseInt(el.textContent) || 0;
    const duration = 500;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment <= 0 && current <= target)) {
            el.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            el.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
