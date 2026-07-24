// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// Real-time Chat System (chat.js)
// ============================================

// Chat State
let chatMessages = [];
let chatUnreadCount = 0;
let chatListener = null;

// ============================================
// INITIALIZE CHAT
// ============================================
function listenToChat() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            // Firebase Real-time Listener
            chatListener = ForumFirebase.db.collection('chatMessages')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .onSnapshot(snapshot => {
                    chatMessages = [];
                    snapshot.forEach(doc => {
                        chatMessages.push({ id: doc.id, ...doc.data() });
                    });
                    chatMessages.reverse();
                    renderChatMessages();
                }, error => {
                    console.error('Chat listener error:', error);
                    loadDemoChat();
                });
        } else {
            // Demo Mode - Load sample messages
            loadDemoChat();
        }
    } catch (error) {
        console.error('Error initializing chat:', error);
        loadDemoChat();
    }
}

// ============================================
// DEMO CHAT MESSAGES
// ============================================
function loadDemoChat() {
    const container = document.getElementById('chatMessages');
    
    const demoMessages = [
        {
            id: 'chat_1',
            senderId: 'user_1',
            senderName: 'CryptoMaster99',
            senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CM',
            message: 'Hey everyone! Welcome to CryptographyTube Community! 🎉',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            isSystem: false
        },
        {
            id: 'chat_2',
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '',
            message: '📢 New member joined: EthDev_Pro',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            isSystem: true
        },
        {
            id: 'chat_3',
            senderId: 'user_2',
            senderName: 'EthDev_Pro',
            senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ED',
            message: 'Thanks! Excited to be here. Anyone working on Ethereum projects?',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            isSystem: false
        },
        {
            id: 'chat_4',
            senderId: 'user_3',
            senderName: 'BlockchainNinja',
            senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BN',
            message: 'Yes! I am building a DeFi dashboard. Would love to collaborate!',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            isSystem: false
        },
        {
            id: 'chat_5',
            senderId: 'user_4',
            senderName: 'SecurityExpert',
            senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SE',
            message: '🚨 Quick tip: Never share your private keys in public chat!',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            isSystem: false
        }
    ];
    
    chatMessages = demoMessages;
    renderChatMessages();
}

// ============================================
// RENDER CHAT MESSAGES
// ============================================
function renderChatMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    let html = '';
    
    chatMessages.forEach(msg => {
        const isSelf = currentUser && msg.senderId === currentUser.uid;
        const time = formatChatTime(msg.timestamp);
        
        if (msg.isSystem) {
            html += `
                <div class="chat-message system-message">
                    <p class="system-text">${escapeHtml(msg.message)}</p>
                    <span class="time">${time}</span>
                </div>
            `;
        } else {
            html += `
                <div class="chat-message ${isSelf ? 'self' : ''}">
                    <img src="${msg.senderAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}`}" 
                         alt="${msg.senderName}" 
                         class="chat-avatar"
                         onclick="viewUserProfile('${msg.senderId}')">
                    <div>
                        <span class="sender">${escapeHtml(msg.senderName)}${isSelf ? ' (You)' : ''}</span>
                        <div class="text">${formatChatMessage(msg.message)}</div>
                        <span class="time">${time}</span>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html || '<div class="chat-welcome"><i class="fas fa-rocketchat"></i><p>Welcome to Community Chat!</p></div>';
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// ============================================
// SEND MESSAGE
// ============================================
async function sendChatMessage(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to send messages', 'warning');
        return;
    }
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Validate message length
    if (message.length > 500) {
        showToast('Message too long (max 500 characters)', 'error');
        return;
    }
    
    // Basic profanity filter (simple version)
    const blockedWords = ['password', 'private key', 'seed phrase', 'secret'];
    const lowerMessage = message.toLowerCase();
    for (const word of blockedWords) {
        if (lowerMessage.includes(word)) {
            showToast('⚠️ Security Alert: Never share sensitive information in chat!', 'error');
            return;
        }
    }
    
    const chatMessage = {
        id: 'chat_' + Date.now(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.username || 'Anonymous',
        senderAvatar: currentUser.photoURL || '',
        message: message,
        timestamp: new Date().toISOString()
    };
    
    try {
        if (!ForumFirebase.useDemoMode && typeof ForumFirebase !== 'undefined') {
            await ForumFirebase.db.collection('chatMessages').add(chatMessage);
        } else {
            // Demo mode - add to local array
            chatMessages.push(chatMessage);
            
            // Keep only last 100 messages
            if (chatMessages.length > 100) {
                chatMessages = chatMessages.slice(-100);
            }
            
            renderChatMessages();
        }
        
        input.value = '';
        
        // Show typing indicator simulation
        simulateTypingResponse();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message', 'error');
    }
}

// ============================================
// SIMULATE TYPING RESPONSE (Demo)
// ============================================
function simulateTypingResponse() {
    // In production, this would be real users typing
    // For demo, we just clear any existing typing indicators
}

// ============================================
// CHAT UTILITIES
// ============================================
function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours - show time
    if (diff < 86400000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than 7 days - show day name
    if (diff < 604800000) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()] + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatChatMessage(text) {
    if (!text) return '';
    
    let formatted = escapeHtml(text);
    
    // Convert URLs to links
    formatted = formatted.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener" class="chat-link">$1</a>'
    );
    
    // Convert mentions (@username)
    formatted = formatted.replace(
        /@(\w+)/g, 
        '<span class="mention">@$1</span>'
    );
    
    // Convert emojis (basic set)
    const emojiMap = {
        ':)': '😊', ':D': '😄', ':(': '😢', ';)': '😉',
        '<3': '❤️', ':thumbsup:', '👍', ':fire:', '🔥',
        ':rocket:', '🚀', ':bitcoin:', '₿', ':check:', '✅'
    };
    
    for (const [emoji, char] of Object.entries(emojiMap)) {
        formatted = formatted.replace(new RegExp(emoji.replace(':', '\\:'), 'g'), char);
    }
    
    return formatted;
}

function viewUserProfile(userId) {
    // Would open user profile modal
    showToast('Viewing user profile...', 'info');
}

// ============================================
// UNREAD COUNT BADGE
// ============================================
function updateUnreadCount(count) {
    chatUnreadCount = count;
    const badge = document.getElementById('unreadChatCount');
    if (badge) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Mark all as read when chat is opened
document.addEventListener('DOMContentLoaded', () => {
    const chatCard = document.querySelector('.chat-card');
    if (chatCard) {
        chatCard.addEventListener('click', () => {
            updateUnreadCount(0);
        });
    }
});

// ============================================
// CHAT COMMANDS
// ============================================
const chatCommands = {
    '/help': 'Available commands: /help, /users, /clear, /emoji',
    '/users': () => `Online users: ${Math.floor(Math.random() * 20 + 5)}`,
    '/clear': () => { 
        chatMessages = []; 
        renderChatMessages(); 
        return 'Chat cleared'; 
    },
    '/emoji': 'Emojis: :) :D :( ;) <3 :fire: :rocket: :bitcoin:'
};

// Intercept commands before sending
const originalSendChatMessage = sendChatMessage;
sendChatMessage = function(event) {
    event.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    // Check for commands
    if (message.startsWith('/')) {
        const command = message.split(' ')[0].toLowerCase();
        if (chatCommands[command]) {
            const response = typeof chatCommands[command] === 'function' 
                ? chatCommands[command]() 
                : chatCommands[command];
            
            // Add system response
            chatMessages.push({
                id: 'system_' + Date.now(),
                senderId: 'system',
                senderName: 'Bot',
                senderAvatar: '',
                message: response,
                timestamp: new Date().toISOString(),
                isSystem: true
            });
            
            renderChatMessages();
            input.value = '';
            return;
        }
    }
    
    // Call original function for normal messages
    originalSendChatMessage(event);
};

// Auto-scroll chat on new messages
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        const observer = new MutationObserver(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
        
        observer.observe(chatContainer, { childList: true, subtree: true });
    }
});
