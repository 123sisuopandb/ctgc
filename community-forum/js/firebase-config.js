// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// Firebase Configuration
// ============================================
// 
// ⚠️ IMPORTANT: Replace these values with your own Firebase project config!
//
// STEPS TO SETUP:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Enable Authentication:
//    - Email/Password
//    - Google
//    - GitHub
// 4. Create Firestore Database
// 5. Copy your config below
// ============================================

const firebaseConfig = {
    // 🔴 REPLACE WITH YOUR FIREBASE CONFIG 🔴
    
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================
// FIRESTORE COLLECTIONS STRUCTURE
// ============================================
/*
 * COLLECTIONS:
 * 
 * 1. users/{uid}
 *    - uid, email, displayName, photoURL, username
 *    - bio, createdAt, lastActive, reputation
 *    - postCount, likesReceived
 *
 * 2. posts/{postId}
 *    - authorId, authorName, authorAvatar
 *    - title, content, category, type
 *    - tags[], likes, replies[]
 *    - createdAt, updatedAt, views
 *    - isPinned, isLocked
 *
 * 3. comments/{commentId}
 *    - postId, authorId, authorName
 *    - content, createdAt
 *    - likes[], parentId (for nested)
 *
 * 4. chatMessages/{messageId}
 *    - senderId, senderName, senderAvatar
 *    - message, timestamp
 *
 * 5. notifications/{notifId}
 *    - userId, type, title, message
 *    - relatedPostId, isRead, createdAt
 */

// ============================================
// DEMO MODE (Works without Firebase setup!)
// ============================================
// If Firebase is not configured, forum will use localStorage for demo

let useDemoMode = false;

function checkFirebaseConnection() {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log('⚠️ Firebase not configured - Using Demo Mode');
            useDemoMode = true;
            resolve(false);
        }, 3000);
        
        try {
            auth.onAuthStateChanged((user) => {
                clearTimeout(timeout);
                if (firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
                    useDemoMode = true;
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        } catch (e) {
            clearTimeout(timeout);
            useDemoMode = true;
            resolve(false);
        }
    });
}

// Export for other scripts
window.ForumFirebase = {
    auth,
    db,
    useDemoMode,
    checkFirebaseConnection
};
