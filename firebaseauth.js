// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMQQdUBSMHcrqRUBXJNyDkoKDNOO-wxKY",
    authDomain: "lionsexchange-88d6e.firebaseapp.com",
    projectId: "lionsexchange-88d6e",
    storageBucket: "lionsexchange-88d6e.firebasestorage.app",
    messagingSenderId: "1098511064527",
    appId: "1:1098511064527:web:d205383aaf7fcfc8be06ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['dashboard.html', 'my ads.html', 'Help and FAQ.html'];
    
    if (user) {
        // User is signed in
        // if (currentPage === 'index.html' || currentPage === '') {
        //     // If user is logged in and on landing page, redirect to dashboard
        //     window.location.href = 'dashboard.html';
        // }
        // Store user info
        sessionStorage.setItem("loggedInUserId", user.uid);
        sessionStorage.setItem("userEmail", user.email);
    } else {
        // User is signed out
        sessionStorage.removeItem("loggedInUserId");
        sessionStorage.removeItem("userEmail");
        
        // If user is not logged in and trying to access protected pages, redirect to landing
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }
});

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(function() {
            messageDiv.style.opacity = 0;
            setTimeout(function() {
                messageDiv.style.display = "none";
            }, 300);
        }, 5000);
    }
}

// Enhanced signup functionality
const signUpButton = document.getElementById("signup-submit");
if (signUpButton) {
    signUpButton.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const firstName = document.getElementById("fName").value;
        const lastName = document.getElementById("lName").value;

        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            showMessage("Please fill in all fields.", "signUpMessage");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters long.", "signUpMessage");
            return;
        }

        // Disable button during signup
        signUpButton.disabled = true;
        signUpButton.innerHTML = "Creating Account...";

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                createdAt: new Date(),
                accountType: 'student'
            };

            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, userData);
            
            showMessage("Account created successfully! Redirecting to dashboard...", "signUpMessage");
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);

        } catch (error) {
            const errorCode = error.code;
            let errorMessage = "Error creating account. Please try again.";
            
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered. Please try logging in instead.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password is too weak. Please use at least 6 characters.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection and try again.";
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showMessage(errorMessage, "signUpMessage");
        } finally {
            // Re-enable button
            signUpButton.disabled = false;
            signUpButton.innerHTML = "Sign Up";
        }
    });
}

// Enhanced login functionality
const signInButton = document.getElementById("login-submit");
if (signInButton) {
    signInButton.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const email = document.getElementById("email-login").value;
        const password = document.getElementById("password-login").value;

        // Basic validation
        if (!email || !password) {
            showMessage("Please fill in all fields.", "loginMessage");
            return;
        }

        // Disable button during login
        signInButton.disabled = true;
        signInButton.innerHTML = "Logging in...";

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            showMessage("Login successful! Redirecting...", "loginMessage");
            
            // Store user info and redirect
            sessionStorage.setItem("loggedInUserId", user.uid);
            sessionStorage.setItem("userEmail", user.email);
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);

        } catch (error) {
            const errorCode = error.code;
            let errorMessage = "Login failed. Please try again.";
            
            switch (errorCode) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMessage = "Invalid email or password. Please check your credentials.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection and try again.";
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showMessage(errorMessage, "loginMessage");
        } finally {
            // Re-enable button
            signInButton.disabled = false;
            signInButton.innerHTML = "Login";
        }
    });
}

// Global logout function
window.logout = async function() {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            // Clear any stored data
            sessionStorage.clear();
            localStorage.clear();
            
            // Show success message briefly before redirect
            const logoutMessage = document.createElement('div');
            logoutMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10000;
                font-family: Inter, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            logoutMessage.textContent = 'Logged out successfully!';
            document.body.appendChild(logoutMessage);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error logging out. Please try again.');
        }
    }
};

// Check if user is logged in (for protected pages)
window.checkAuth = function() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Get current user info
window.getCurrentUser = function() {
    return auth.currentUser;
};

// Export auth instance for use in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;