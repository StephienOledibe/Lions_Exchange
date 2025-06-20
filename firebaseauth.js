  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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


  function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
  } 


  const signUp = document.getElementById("signup-submit");
  signUp.addEventListener("click", event => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user = userCredential.user;
        const userData ={

            firstName: firstName,
            lastName: lastName,
            email: email
        };

        showMessage("Account created successfully! Please Log in!", "signUpMessage");
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showMessage("Email already in use. Please try another email.", "signUpMessage");
        }
        else if (errorCode === 'auth/invalid-email') {
            showMessage("Invalid email format. Please enter a valid email.", "signUpMessage");
        }
        else if (errorCode === 'auth/weak-password') {
            showMessage("Weak password. Please enter a stronger password.", "signUpMessage");
        }
        else {
            showMessage("Error creating account: " + error.message, "signUpMessage");
        }
    });
  })

    const signIn = document.getElementById("login-submit");
    signIn.addEventListener("click", event => {
        event.preventDefault();
        const email = document.getElementById("email-login").value;
        const password = document.getElementById("password-login").value;

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage("Login successful!", "loginMessage");
            const user = userCredential.user;
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage("Incorrect Email or Password", "loginMessage");
            }
            else {
                showMessage("Account does not exist", "loginMessage");
            }
        });
    });
    
