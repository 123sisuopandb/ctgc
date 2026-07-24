// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// Forum Logic (forum.js)
// Posts, Categories, Search, Stats
// ============================================

// Global State
let allPosts = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'newest';
let lastVisiblePost = null;
const POSTS_PER_PAGE = 10;

// ============================================
// LOAD POSTS
// ============================================
async function loadPosts() {
    const container = document.getElementById('postsContainer');
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            // Firebase Firestore - Real-time
            let query = ForumFirebase.db.collection('posts')
                .orderBy('createdAt', 'desc')
                .limit(POSTS_PER_PAGE);
            
            // Apply category filter
            if (currentCategory !== 'all') {
                query = query.where('category', '==', currentCategory);
            }
            
            const snapshot = await query.get();
            allPosts = [];
            
            snapshot.forEach(doc => {
                allPosts.push({ id: doc.id, ...doc.data() });
            });
            
            renderPosts(allPosts);
        } else {
            // Demo Mode - Load from localStorage or use sample data
            loadDemoPosts();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        loadDemoPosts(); // Fallback to demo data
    }
}

// ============================================
// DEMO/SAMPLE DATA
// ============================================
function loadDemoPosts() {
    const samplePosts = [
        {
            id: 'post_1',
            authorId: 'user_1',
            authorName: 'CryptoMaster99',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CM',
            title: 'Understanding Bitcoin Private Keys: A Complete Guide for Beginners',
            content: 'In this comprehensive guide, we will explore everything about Bitcoin private keys. From generation to security best practices...\n\n## What is a Private Key?\nA private key is a 256-bit number that allows you to spend your bitcoins...',
            category: 'bitcoin',
            type: 'tutorial',
            tags: ['bitcoin', 'private-key', 'security', 'beginner'],
            likes: 45,
            replies: 23,
            views: 1250,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            isPinned: true
        },
        {
            id: 'post_2',
            authorId: 'user_2',
            authorName: 'EthDev_Pro',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ED',
            title: 'How to Secure Your Ethereum Wallet: Top 10 Security Tips',
            content: 'Security is paramount when dealing with cryptocurrency. Here are my top 10 tips for keeping your ETH safe...',
            category: 'ethereum',
            type: 'discussion',
            tags: ['ethereum', 'security', 'wallet', 'tips'],
            likes: 32,
            replies: 18,
            views: 890,
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            isPinned: false
        },
        {
            id: 'post_3',
            authorId: 'user_3',
            authorName: 'BlockchainNinja',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BN',
            title: 'Question: What is the difference between WIF and WIF-compressed format?',
            content: 'I have been studying Bitcoin address formats and I am confused about WIF vs WIF-compressed. Can someone explain the difference?',
            category: 'bitcoin',
            type: 'question',
            tags: ['bitcoin', 'wif', 'format', 'question'],
            likes: 12,
            replies: 8,
            views: 345,
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
            isPinned: false
        },
        {
            id: 'post_4',
            authorId: 'user_4',
            authorName: 'SecurityExpert',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SE',
            title: '🚨 ALERT: New Phishing Scam Targeting Crypto Users - Stay Safe!',
            content: 'There is a new sophisticated phishing scam going around. Please be careful and never share your private keys or seed phrases...',
            category: 'security',
            type: 'announcement',
            tags: ['security', 'scam', 'phishing', 'alert'],
            likes: 67,
            replies: 34,
            views: 2100,
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            isPinned: true
        },
        {
            id: 'post_5',
            authorId: 'user_5',
            authorName: 'WalletWizard',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WW',
            title: 'Best Hardware Wallets in 2024: Ledger vs Trezor Comparison',
            content: 'After testing both major hardware wallets extensively, here is my detailed comparison of features, security, and usability...',
            category: 'wallets',
            type: 'showcase',
            tags: ['wallet', 'hardware', 'ledger', 'trezor', 'review'],
            likes: 28,
            replies: 42,
            views: 1567,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            isPinned: false
        },
        {
            id: 'post_6',
            authorId: 'user_6',
            authorName: 'CodeMonkey_Crypto',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CMC',
            title: 'Building a Bitcoin Address Generator from Scratch (Python Tutorial)',
            content: 'Today I want to share how you can build your own Bitcoin address generator using Python and the elliptic curve library...',
            category: 'development',
            type: 'tutorial',
            tags: ['python', 'bitcoin', 'development', 'tutorial', 'code'],
            likes: 89,
            replies: 56,
            views: 3456,
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            isPinned: true
        }
    ];
    
    allPosts = samplePosts;
    renderPosts(allPosts);
    updateCategoryCounts(samplePosts);
}

// ============================================
// RENDER POSTS
// ============================================
function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
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
    
    let html = '';
    
    // Sort posts first
    const sortedPosts = sortPostsArray(posts, currentSort);
    
    sortedPosts.forEach(post => {
        const timeAgo = getTimeAgo(post.createdAt);
        const categoryClass = post.category || 'general';
        
        html += `
            <div class="post-card ${categoryClass}" onclick="viewPost('${post.id}')">
                <div class="post-card-header">
                    <img src="${post.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`}" 
                         alt="${post.authorName}" class="post-author-img">
                    <div class="post-meta">
                        <span class="post-author-name">${escapeHtml(post.authorName)}</span>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                    <span class="post-category-badge badge-${categoryClass}">${post.category || 'General'}</span>
                </div>
                
                ${post.isPinned ? '<div class="pinned-badge"><i class="fas fa-thumbtack"></i> Pinned</div>' : ''}
                
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <p class="post-preview">${escapeHtml(stripMarkdown(post.content)).substring(0, 200)}...</p>
                
                <div class="post-footer">
                    <span class="post-stat" onclick="event.stopPropagation(); likePost('${post.id}')">
                        <i class="fas fa-heart"></i> ${post.likes || 0}
                    </span>
                    <span class="post-stat">
                        <i class="fas fa-comment"></i> ${post.replies?.length || post.replies || 0}
                    </span>
                    <span class="post-stat">
                        <i class="fas fa-eye"></i> ${formatNumber(post.views || 0)}
                    </span>
                    ${post.type ? `<span class="post-stat"><i class="fas fa-tag"></i> ${post.type}</span>` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Show/hide load more button
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.classList.toggle('hidden', posts.length < POSTS_PER_PAGE);
    }
}

// ============================================
// SORT FUNCTIONS
// ============================================
function sortPostsArray(posts, sortBy) {
    const sorted = [...posts];
    
    switch(sortBy) {
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'mostLiked':
            return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'mostReplied':
            return sorted.sort((a, b) => {
                const aReplies = Array.isArray(a.replies) ? a.replies.length : (a.replies || 0);
                const bReplies = Array.isArray(b.replies) ? b.replies.length : (b.replies || 0);
                return bReplies - aReplies;
            });
        case 'newest':
        default:
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

function sortPosts(sortBy) {
    currentSort = sortBy;
    renderPosts(filterPosts(allPosts));
}

// ============================================
// FILTER FUNCTIONS
// ============================================
function filterByTab(tab) {
    currentFilter = tab;
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-tab="${tab}"]`)?.classList.add('active');
    
    // Update feed title
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
    
    // Apply tab-specific filters
    if (tab === 'questions') {
        filtered = filtered.filter(p => p.type === 'question');
    } else if (tab === 'tutorials') {
        filtered = filtered.filter(p => p.type === 'tutorial');
    } else if (tab === 'tools') {
        filtered = filtered.filter(p => p.category === 'development' || p.tags?.includes('tools'));
    } else if (tab === 'trending') {
        filtered = filtered.sort((a, b) => (b.likes || 0) + ((b.replies?.length || b.replies || 0) * 2) 
                                          - (a.likes || 0) - ((a.replies?.length || a.replies || 0) * 2))
                              .slice(0, 10);
    }
    
    renderPosts(filtered);
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update active category
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.category-list li[data-cat="${category}"]`)?.classList.add('active');
    
    let filtered = filterPosts(allPosts);
    renderPosts(filtered);
}

function filterPosts(posts) {
    let filtered = [...posts];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    return filtered;
}

// ============================================
// SEARCH FUNCTION
// ============================================
let searchTimeout;
function searchForum(query) {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        if (!query.trim()) {
            renderPosts(filterPosts(allPosts));
            return;
        }
        
        const q = query.toLowerCase().trim();
        const results = allPosts.filter(post => 
            post.title?.toLowerCase().includes(q) ||
            post.content?.toLowerCase().includes(q) ||
            post.tags?.some(tag => tag.toLowerCase().includes(q)) ||
            post.authorName?.toLowerCase().includes(q)
        );
        
        document.getElementById('feedTitle').innerHTML = `<i class="fas fa-search"></i> Search Results: "${query}"`;
        renderPosts(results);
    }, 300);
}

// ============================================
// CREATE POST MODAL
// ============================================
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

async function createPost(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to create a post', 'error');
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;
    const type = document.getElementById('postType').value;
    const tagsInput = document.getElementById('postTags').value.trim();
    
    // Validation
    if (!title || !content || !category) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    if (title.length < 10) {
        showToast('Title must be at least 10 characters', 'error');
        return;
    }
    
    if (content.length < 30) {
        showToast('Content must be at least 30 characters', 'error');
        return;
    }
    
    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    
    const postData = {
        id: 'post_' + Date.now(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.username || 'Anonymous',
        authorAvatar: currentUser.photoURL || '',
        title: title,
        content: content,
        category: category,
        type: type,
        tags: tags,
        likes: 0,
        replies: [],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        isLocked: false
    };
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            // Save to Firebase
            await ForumFirebase.db.collection('posts').add(postData);
            
            // Update user post count
            await ForumFirebase.db.collection('users').doc(currentUser.uid).update({
                postCount: firebase.firestore.FieldValue.increment(1)
            });
        } else {
            // Demo mode - save to localStorage
            savePostToLocalStorage(postData);
        }
        
        showToast('Post published successfully! 🎉', 'success');
        closeCreatePostModal();
        loadPosts();
        loadStats();
        
    } catch (error) {
        console.error('Error creating post:', error);
        showToast('Failed to create post. Please try again.', 'error');
    }
}

// ============================================
// VIEW POST
// ============================================
async function viewPost(postId) {
    const modal = document.getElementById('viewPostModal');
    const content = document.getElementById('viewPostContent');
    
    // Show loading
    content.innerHTML = '<div class="loading-posts"><div class="spinner"></div><p>Loading post...</p></div>';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    try {
        let post;
        
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            const doc = await ForumFirebase.db.collection('posts').doc(postId).get();
            post = { id: doc.id, ...doc.data() };
            
            // Increment views
            await ForumFirebase.db.collection('posts').doc(postId).update({
                views: firebase.firestore.FieldValue.increment(1)
            });
        } else {
            post = allPosts.find(p => p.id === postId) || getPostFromLocalStorage(postId);
        }
        
        if (post) {
            renderViewPost(post);
        } else {
            content.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Post not found</h3></div>';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        content.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error loading post</h3></div>';
    }
}

function renderViewPost(post) {
    const content = document.getElementById('viewPostContent');
    const timeAgo = getTimeAgo(post.createdAt);
    
    content.innerHTML = `
        <article class="full-post">
            <header class="full-post-header">
                <img src="${post.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`}" 
                     alt="${post.authorName}" class="post-author-img large">
                <div>
                    <h4>${escapeHtml(post.authorName)}</h4>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <span class="post-category-badge badge-${post.category}">${post.category}</span>
            </header>
            
            <h1 class="full-post-title">${escapeHtml(post.title)}</h1>
            
            <div class="full-post-content">${renderMarkdown(post.content)}</div>
            
            ${post.tags && post.tags.length ? `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag-item" onclick="searchForum('${tag}')">#${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            
            <footer class="full-post-footer">
                <div class="post-actions">
                    <button onclick="likePost('${post.id}')" class="action-btn">
                        <i class="fas fa-heart"></i> ${post.likes || 0} Likes
                    </button>
                    <button onclick="sharePost('${post.id}')" class="action-btn">
                        <i class="fas fa-share"></i> Share
                    </button>
                    <button onclick="bookmarkPost('${post.id}')" class="action-btn">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
                <div class="post-stats-inline">
                    <span><i class="fas fa-eye"></i> ${formatNumber(post.views || 0)} views</span>
                    <span><i class="fas fa-comment"></i> ${post.replies?.length || post.replies || 0} replies</span>
                </div>
            </footer>
            
            <!-- Comments Section -->
            <section class="comments-section">
                <h3><i class="fas fa-comments"></i> Discussion (${post.replies?.length || post.replies || 0})</h3>
                
                <form onsubmit="addComment(event, '${post.id}')" class="comment-form">
                    <textarea id="commentInput" placeholder="Join the discussion..." rows="3" required></textarea>
                    <button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Post Comment</button>
                </form>
                
                <div class="comments-list" id="commentsList">
                    <!-- Comments loaded here -->
                </div>
            </section>
        </article>
    `;
    
    // Load comments
    loadComments(post.id);
}

function closeViewPostModal() {
    document.getElementById('viewPostModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// ============================================
// LIKE POST
// ============================================
async function likePost(postId) {
    if (!currentUser) {
        showToast('Please login to like posts', 'warning');
        return;
    }
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            const postRef = ForumFirebase.db.collection('posts').doc(postId);
            await postRef.update({
                likes: firebase.firestore.FieldValue.increment(1)
            });
        }
        
        // Update local state
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            renderPosts(filterPosts(allPosts));
        }
        
        showToast('Post liked! ❤️', 'success');
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

// ============================================
// COMMENTS
// ============================================
async function addComment(event, postId) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to comment', 'warning');
        return;
    }
    
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const comment = {
        id: 'comment_' + Date.now(),
        postId: postId,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.username || 'Anonymous',
        authorAvatar: currentUser.photoURL || '',
        content: text,
        likes: 0,
        createdAt: new Date().toISOString()
    };
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            await ForumFirebase.db.collection('comments').add(comment);
            await ForumFirebase.db.collection('posts').doc(postId).update({
                replies: firebase.firestore.FieldValue.arrayUnion(comment.id)
            });
        }
        
        input.value = '';
        showToast('Comment added!', 'success');
        loadComments(postId);
    } catch (error) {
        console.error('Error adding comment:', error);
        showToast('Failed to add comment', 'error');
    }
}

async function loadComments(postId) {
    const container = document.getElementById('commentsList');
    
    // Sample comments for demo
    const demoComments = [
        {
            id: 'c1',
            authorName: 'CryptoEnthusiast',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CE',
            content: 'Great explanation! This really helped me understand the concept better.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 5
        },
        {
            id: 'c2',
            authorName: 'NewbieLearner',
            authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NL',
            content: 'Can you explain more about the security aspects? I am still confused about key management.',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            likes: 2
        }
    ];
    
    let html = '';
    demoComments.forEach(c => {
        html += `
            <div class="comment-item">
                <img src="${c.authorAvatar}" alt="${c.authorName}" class="comment-avatar">
                <div class="comment-body">
                    <div class="comment-header">
                        <strong>${c.authorName}</strong>
                        <span class="comment-time">${getTimeAgo(c.createdAt)}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(c.content)}</p>
                    <div class="comment-actions">
                        <button onclick="likeComment('${c.id}')"><i class="fas fa-heart"></i> ${c.likes}</button>
                        <button onclick="replyToComment('${c.id}')">Reply</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html || '<p class="no-comments">No comments yet. Be the first!</p>';
}

// ============================================
// STATS & SIDEBAR DATA
// ============================================
async function loadStats() {
    // Sample stats (would come from Firebase in production)
    updateStat('totalMembers', 1247);
    updateStat('totalPosts', 3842);
    updateStat('totalReplies', 15847);
    updateStat('totalTopics', 892);
    updateStat('onlineUsers', Math.floor(Math.random() * 50) + 20);
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) animateNumber(el, value);
}

function animateNumber(el, target) {
    const duration = 1000;
    const start = parseInt(el.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            el.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            el.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

async function loadTopUsers() {
    const container = document.getElementById('topUsersList');
    
    const topUsers = [
        { name: 'CryptoMaster99', avatar: 'CM', rep: 2450, rank: 1 },
        { name: 'EthDev_Pro', avatar: 'ED', rep: 1890, rank: 2 },
        { name: 'BlockchainNinja', avatar: 'BN', rep: 1567, rank: 3 },
        { name: 'SecurityExpert', avatar: 'SE', rep: 1234, rank: 4 },
        { name: 'WalletWizard', avatar: 'WW', rep: 987, rank: 5 }
    ];
    
    let html = '';
    topUsers.forEach(user => {
        const rankClass = user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : user.rank === 3 ? 'bronze' : '';
        html += `
            <li>
                <span class="rank ${rankClass}">${user.rank}</span>
                <img src="https://api.dicebear.com/7.x/initials/svg?seed=${user.avatar}" alt="${user.name}">
                <div class="user-info">
                    <span class="username">${user.name}</span>
                    <span class="rep-score">${formatNumber(user.rep)} rep</span>
                </div>
            </li>
        `;
    });
    
    container.innerHTML = html;
}

async function loadRecentActivity() {
    const container = document.getElementById('activityList');
    
    const activities = [
        { icon: 'fa-comment', text: '<strong>CryptoMaster99</strong> replied to "Bitcoin Guide"', time: '2m ago' },
        { icon: 'fa-heart', text: '<strong>EthDev_Pro</strong> liked "Ethereum Security"', time: '5m ago' },
        { icon: 'fa-user-plus', text: '<strong>NewUser123</strong> joined the community', time: '12m ago' },
        { icon: 'fa-edit', text: '<strong>BlockchainNinja</strong> created a new post', time: '18m ago' },
        { icon: 'fa-trophy', text: '<strong>SecurityExpert</strong> earned "Helper" badge', time: '25m ago' }
    ];
    
    let html = '';
    activities.forEach(a => {
        html += `
            <li>
                <span class="activity-icon"><i class="fas ${a.icon}"></i></span>
                <span class="activity-text">${a.text} · ${a.time}</span>
            </li>
        `;
    });
    
    container.innerHTML = html;
}

function updateCategoryCounts(posts) {
    const categories = ['bitcoin', 'ethereum', 'security', 'wallets', 'development', 'news', 'offtopic'];
    
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
    
    Object.keys(counts).forEach(cat => {
        const el = document.getElementById(`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}Count`);
        if (el) el.textContent = counts[cat];
    });
    
    // Also set total count
    const allCountEl = document.getElementById('catAllCount');
    if (allCountEl) allCountEl.textContent = counts.all;
}

// ============================================
// PROFILE FUNCTIONS
// ============================================
function viewProfile() {
    if (!currentUser) return;
    
    const modal = document.getElementById('profileModal');
    
    document.getElementById('profileAvatarLarge').innerHTML = `
        <img src="${currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName}`}" 
             style="width:100%;height:100%;border-radius:50%;">
    `;
    document.getElementById('profileName').textContent = currentUser.displayName || currentUser.username;
    document.getElementById('profileBio').textContent = currentUser.bio || 'Crypto enthusiast & community member';
    document.getElementById('profilePosts').textContent = currentUser.postCount || 0;
    document.getElementById('profileLikes').textContent = currentUser.likesReceived || 0;
    document.getElementById('profileReputation').textContent = currentUser.reputation || 0;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Close dropdown
    document.getElementById('userDropdown')?.classList.add('hidden');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function myPosts() {
    if (!currentUser) return;
    filterByTab('all');
    // Filter by current user's posts would go here
    showToast('Loading your posts...', 'info');
}

function openSettings() {
    showToast('Settings coming soon! 🔧', 'info');
    document.getElementById('userDropdown')?.classList.add('hidden');
}

// ============================================
// TEXT EDITOR HELPERS
// ============================================
function formatText(format) {
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = '';
    
    switch(format) {
        case 'bold': replacement = `**${selected || 'bold text'}**`; break;
        case 'italic': replacement = `*${selected || 'italic text'}*`; break;
        case 'code': replacement = `\`${selected || 'code'}\``; break;
        case 'link': replacement = `[${selected || 'link text'}](url)`; break;
        case 'quote': replacement = `> ${selected || 'quote'}`; break;
        case 'list': replacement = `- ${selected || 'list item'}`; break;
    }
    
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + replacement.length;
    updateCharCount();
}

function insertImage() {
    const url = prompt('Enter image URL:');
    if (url) {
        const textarea = document.getElementById('postContent');
        const start = textarea.selectionStart;
        textarea.value = textarea.value.substring(0, start) + `![image](${url})` + textarea.value.substring(textarea.selectionEnd);
        textarea.focus();
        updateCharCount();
    }
}

function updateCharCount() {
    const textarea = document.getElementById('postContent');
    const count = document.getElementById('charCount');
    if (count && textarea) {
        count.textContent = textarea.value.length;
    }
}

// Add input listener for character count
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('postContent');
    if (textarea) {
        textarea.addEventListener('input', updateCharCount);
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function stripMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        .replace(/^>\s/gm, '')
        .replace(/[-*+]\s/g, '');
}

function renderMarkdown(text) {
    if (!text) return '';
    
    let html = escapeHtml(text);
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Images
    html = html.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">');
    // Blockquotes
    html = html.replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
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
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function sharePost(postId) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this post on CryptographyTube Community!',
            url: window.location.href + '#post=' + postId
        });
    } else {
        // Copy link to clipboard
        navigator.clipboard.writeText(window.location.href + '#post=' + postId);
        showToast('Link copied to clipboard! 📋', 'success');
    }
}

function bookmarkPost(postId) {
    showToast('Post saved to bookmarks! 🔖', 'success');
}

function likeComment(commentId) {
    showToast('Comment liked! ❤️', 'success');
}

function replyToComment(commentId) {
    const input = document.getElementById('commentInput');
    if (input) {
        input.value = '@replying_to_comment ';
        input.focus();
    }
}

// LocalStorage helpers for demo mode
function savePostToLocalStorage(post) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    posts.unshift(post);
    localStorage.setItem('forumPosts', JSON.stringify(posts.slice(0, 100))); // Keep max 100 posts
}

function getPostFromLocalStorage(postId) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    return posts.find(p => p.id === postId);
}

// Load more posts
async function loadMorePosts() {
    showToast('Loading more posts...', 'info');
    // Implementation would fetch next batch from Firebase
}

// Character counter for post content
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.addEventListener('input', updateCharCount);
    }
});
