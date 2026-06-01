import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const avatar = document.getElementById("profileAvatar");
const nameEl = document.getElementById("profileName");
const loggedInSection = document.getElementById("loggedInSection");
const loggedOutSection = document.getElementById("loggedOutSection");

async function loadUser(user) {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        const firstName = userData.firstName || "User";
        const lastName = userData.lastName || "";
        const role = userData.role || "guest";
        const clearance = userData.clearance || 1;

        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("role", role);
        localStorage.setItem("clearance", clearance);

        avatar.textContent = (firstName[0] + (lastName[0] || "")).toUpperCase();
        nameEl.textContent = firstName + " " + lastName;
        loggedInSection.style.display = "block";
        loggedOutSection.style.display = "none";

        const roleBadge = document.getElementById("userRole");
        const clearanceBadge = document.getElementById("userClearance");
        const bowLink = document.getElementById("bowLink");
        const adminLink = document.getElementById("adminLink");

        if (roleBadge) roleBadge.textContent = role;
        if (clearanceBadge) clearanceBadge.textContent = "Clearance Level " + clearance;
        if (bowLink) bowLink.style.display = parseInt(clearance) >= 4 ? "block" : "none";
        if (adminLink) adminLink.style.display = parseInt(clearance) >= 6 ? "block" : "none";

    } else {
        localStorage.clear();
        avatar.textContent = "?";
        nameEl.textContent = "Guest";
        loggedInSection.style.display = "none";
        loggedOutSection.style.display = "block";
    }
}

onAuthStateChanged(auth, loadUser);

document.querySelector(".profile-btn").addEventListener("click", function(e) {
    e.stopPropagation();
    document.getElementById("profileDropdown").classList.toggle("open");
    this.classList.toggle("active");
});

document.addEventListener("click", function(e) {
    if (!e.target.closest(".profile-wrapper")) {
        document.getElementById("profileDropdown").classList.remove("open");
        document.querySelector(".profile-btn").classList.remove("active");
    }
});

document.getElementById("dropdownLoginBtn").addEventListener("click", async function() {
    const email = document.getElementById("dropdownEmail").value.trim();
    const pass = document.getElementById("dropdownPassword").value;

    if (!email || !pass) return;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById("profileDropdown").classList.remove("open");
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById("dropdownSignUpBtn").addEventListener("click", async function() {
    const firstName = document.getElementById("signUpFirstName").value.trim();
    const lastName = document.getElementById("signUpLastName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const pass = document.getElementById("signUpPassword").value;

    if (!firstName || !lastName || !email || !pass) return;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            role: "guest",
            clearance: 1,
            ownedBOWs: []
        });

        document.getElementById("profileDropdown").classList.remove("open");
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById("showSignUp").addEventListener("click", function() {
    document.getElementById("signInForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "flex";
});

document.getElementById("showSignIn").addEventListener("click", function() {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("signInForm").style.display = "flex";
});

document.querySelector(".signout").addEventListener("click", async function() {
    await signOut(auth);
});

document.getElementById("forgotPassword")?.addEventListener("click", async function() {
    const email = document.getElementById("dropdownEmail").value.trim();
    if (!email) {
        alert("Enter your email first then click Forgot Password");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent — check your inbox");
    } catch (err) {
        alert(err.message);
    }
});