// ============================================
// CRYPTOGRAPHYTUBE COMMUNITY FORUM
// Authentication System (auth.js)
// ============================================

// Global User State
let currentUser = null;

// ============================================
// AUTH STATE LISTENER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && typeof ForumFirebase !== 'undefined') {
        // Listen for auth state changes
        ForumFirebase.auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                currentUser = user;
                loadUserProfile(user);
                showForumSection();
                showToast('Welcome back, ' + (user.displayName || user.email.split('@')[0]) + '!', 'success');
            } else {
                // User is signed out
                currentUser = null;
                showAuthSection();
            }
        });
    } else {
        // Demo mode - check localStorage
        const savedUser = localStorage.getItem('forumUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showForumSection();
        } else {
            showAuthSection();
        }
    }
});

// ============================================
// SHOW/HIDE SECTIONS
// ============================================
function showAuthSection() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('forumSection').classList.add('hidden');
}

function showForumSection() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('forumSection').classList.remove('hidden');
    
    // Load forum data
    if (typeof loadPosts === 'function') loadPosts();
    if (typeof loadStats === 'function') loadStats();
    if (typeof loadTopUsers === 'function') loadTopUsers();
    if (typeof loadRecentActivity === 'function') loadRecentActivity();
    if (typeof listenToChat === 'function') listenToChat();
}

// ============================================
// TOGGLE LOGIN/REGISTER FORMS
// ============================================
function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function showLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================
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

// ============================================
// LOADING OVERLAY
// ============================================
function showLoading() {
    document.getElementById('authLoading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('authLoading').classList.add('hidden');
}

// ============================================
// EMAIL/PASSWORD LOGIN
// ============================================
async function emailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        if (!ForumFirebase.useDemoMode) {
            // Firebase Login
            const userCredential = await ForumFirebase.auth.signInWithEmailAndPassword(email, password);
            showToast('Login successful!', 'success');
        } else {
            // Demo Mode Login
            await demoLogin(email, password);
        }
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Login failed';
        
        switch(error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email format';
                break;
            case 'auth/too-many-requests':
                message = 'Too many attempts. Try again later';
                break;
            default:
                message = error.message || 'Login failed';
        }
        
        showToast(message, 'error');
        hideLoading();
    }
}

// ============================================
// EMAIL/PASSWORD REGISTER
// ============================================
async function emailRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPwd').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
    }
    
    // Username validation (alphanumeric only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showToast('Username can only contain letters, numbers, and underscores', 'error');
        return;
    }
    
    showLoading();
    
    try {
        if (!ForumFirebase.useDemoMode) {
            // Firebase Register
            const userCredential = await ForumFirebase.auth.createUserWithEmailAndPassword(email, password);
            
            // Update profile with username
            await userCredential.user.updateProfile({
                displayName: username
            });
            
            // Save user data to Firestore
            await ForumFirebase.db.collection('users').doc(userCredential.user.uid).set({
                uid: userCredential.user.uid,
                email: email,
                displayName: username,
                photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
                username: username,
                bio: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                reputation: 0,
                postCount: 0,
                likesReceived: 0
            });
            
            showToast('Account created successfully! Welcome to CryptographyTube Community! 🎉', 'success');
        } else {
            // Demo Mode Register
            await demoRegister(username, email, password);
        }
    } catch (error) {
        console.error('Registration error:', error);
        let message = 'Registration failed';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email format';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak';
                break;
            default:
                message = error.message || 'Registration failed';
        }
        
        showToast(message, 'error');
        hideLoading();
    }
}

// ============================================
// GOOGLE LOGIN
// ============================================
async function googleLogin() {
    showLoading();
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        if (!ForumFirebase.useDemoMode) {
            const result = await ForumFirebase.auth.signInWithPopup(provider);
            
            // Check if user exists in Firestore, if not create
            const userDoc = await ForumFirebase.db.collection('users').doc(result.user.uid).get();
            
            if (!userDoc.exists) {
                await ForumFirebase.db.collection('users').doc(result.user.uid).set({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName || 'Google User',
                    photoURL: result.user.photoURL || '',
                    username: result.user.displayName?.replace(/\s/g, '').toLowerCase() || 'google_user',
                    bio: '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                    reputation: 0,
                    postCount: 0,
                    likesReceived: 0
                });
            }
            
            // Update last active
            await ForumFirebase.db.collection('users').doc(result.user.uid).update({
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showToast('Welcome, ' + (result.user.displayName || 'User') + '! 🎉', 'success');
        } else {
            // Demo mode Google login
            await demoGoogleLogin();
        }
    } catch (error) {
        console.error('Google login error:', error);
        showToast('Google login cancelled or failed', 'warning');
        hideLoading();
    }
}

// ============================================
// GITHUB LOGIN
// ============================================
async function githubLogin() {
    showLoading();
    
    try {
        const provider = new firebase.auth.GithubAuthProvider();
        
        if (!ForumFirebase.useDemoMode) {
            const result = await ForumFirebase.auth.signInWithPopup(provider);
            
            // Check if user exists in Firestore
            const userDoc = await ForumFirebase.db.collection('users').doc(result.user.uid).get();
            
            if (!userDoc.exists) {
                await ForumFirebase.db.collection('users').doc(result.user.uid).set({
                    uid: result.user.uid,
                    email: result.user.email || '',
                    displayName: result.user.displayName || 'GitHub User',
                    photoURL: result.user.photoURL || '',
                    username: result.user.displayName?.replace(/\s/g, '').toLowerCase() || 'github_user',
                    bio: '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                    reputation: 0,
                    postCount: 0,
                    likesReceived: 0
                });
            }
            
            // Update last active
            await ForumFirebase.db.collection('users').doc(result.user.uid).update({
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showToast('Welcome, ' + (result.user.displayName || 'Developer') + '! 🚀', 'success');
        } else {
            // Demo mode GitHub login
            await demoGithubLogin();
        }
    } catch (error) {
        console.error('GitHub login error:', error);
        showToast('GitHub login cancelled or failed', 'warning');
        hideLoading();
    }
}

// ============================================
// FORGOT PASSWORD
// ============================================
async function forgotPassword() {
    const email = prompt('Enter your email address for password reset:');
    
    if (!email) return;
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        if (!ForumFirebase.useDemoMode) {
            await ForumFirebase.auth.sendPasswordResetEmail(email);
            showToast('Password reset email sent! Check your inbox.', 'success');
        } else {
            showToast('Demo mode: Password would be reset for ' + email, 'info');
        }
    } catch (error) {
        console.error('Password reset error:', error);
        showToast('Failed to send reset email. Check the email address.', 'error');
    }
}

// ============================================
// LOGOUT
// ============================================
async function logout() {
    try {
        if (!ForumFirebase.useDemoMode) {
            await ForumFirebase.auth.signOut();
        } else {
            localStorage.removeItem('forumUser');
        }
        
        currentUser = null;
        showAuthSection();
        showToast('Logged out successfully. See you soon! 👋', 'info');
        
        // Close dropdown
        document.getElementById('userDropdown').classList.add('hidden');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
    }
}

// ============================================
// LOAD USER PROFILE DATA
// ============================================
async function loadUserProfile(user) {
    try {
        // Update UI elements
        const avatarImg = document.getElementById('userAvatarSmall');
        if (avatarImg) {
            avatarImg.src = user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'U'}`;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// ============================================
// TOGGLE USER MENU DROPDOWN
// ============================================
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(event.target)) {
        if (dropdown) dropdown.classList.add('hidden');
    }
});

// ============================================
// DEMO MODE FUNCTIONS (LocalStorage)
// ============================================
const DEMO_USERS_KEY = 'forumDemoUsers';

function getDemoUsers() {
    const users = localStorage.get(DEMO_USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveDemoUsers(users) {
    localStorage.set(DEMO_USERS_KEY, JSON.stringify(users));
}

async function demoLogin(email, password) {
    const users = getDemoUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        localStorage.setItem('forumUser', JSON.stringify(currentUser));
        hideLoading();
        showToast('Login successful! (Demo Mode)', 'success');
        showForumSection();
    } else {
        hideLoading();
        throw { code: 'auth/user-not-found' };
    }
}

async function demoRegister(username, email, password) {
    const users = getDemoUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        hideLoading();
        throw { code: 'auth/email-already-in-use' };
    }
    
    // Create new user
    const newUser = {
        uid: 'demo_' + Date.now(),
        email: email,
        displayName: username,
        username: username,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
        bio: '',
        createdAt: new Date().toISOString(),
        reputation: 0,
        postCount: 0,
        likesReceived: 0,
        password: password // In demo only!
    };
    
    users.push(newUser);
    saveDemoUsers(users);
    
    currentUser = { ...newUser };
    delete currentUser.password;
    localStorage.setItem('forumUser', JSON.stringify(currentUser));
    
    hideLoading();
    showToast('Account created! Welcome to CryptographyTube Community! 🎉 (Demo)', 'success');
    showForumSection();
}

async function demoGoogleLogin() {
    const demoUser = {
        uid: 'demo_google_' + Date.now(),
        email: 'google_user@gmail.com',
        displayName: 'Google User',
        username: 'google_user',
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=GU`,
        bio: '',
        createdAt: new Date().toISOString(),
        reputation: 50,
        postCount: 5,
        likesReceived: 25
    };
    
    currentUser = demoUser;
    localStorage.setItem('forumUser', JSON.stringify(demoUser));
    hideLoading();
    showToast('Welcome, Google User! (Demo Mode) 🎉', 'success');
    showForumSection();
}

async function demoGithubLogin() {
    const demoUser = {
        uid: 'demo_github_' + Date.now(),
        email: 'github_user@users.noreply.github.com',
        displayName: 'GitHub Developer',
        username: 'github_dev',
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=GH`,
        bio: 'Crypto enthusiast & developer',
        createdAt: new Date().toISOString(),
        reputation: 100,
        postCount: 15,
        likesReceived: 75
    };
    
    currentUser = demoUser;
    localStorage.setItem('forumUser', JSON.stringify(demoUser));
    hideLoading();
    showToast('Welcome, Developer! (Demo Mode) 🚀', 'success');
    showForumSection();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    switch(type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'error': icon = 'fa-exclamation-circle'; break;
        case 'warning': icon = 'fa-exclamation-triangle'; break;
    }
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
