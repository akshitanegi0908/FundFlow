import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Modal functions
window.openModal = () => {
  document.getElementById('signupModal').classList.remove('hidden');
  document.getElementById('signupModal').classList.add('flex');
};

window.closeModal = () => {
  document.getElementById('signupModal').classList.add('hidden');
};

window.openLogin = () => {
  document.getElementById('loginModal').classList.remove('hidden');
  document.getElementById('loginModal').classList.add('flex');
};

window.closeLogin = () => {
  document.getElementById('loginModal').classList.add('hidden');
};

// Sign Up
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ Account created successfully!");
    closeModal();
  } catch (err) {
    alert("❌ Sign Up Error: " + err.message);
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Logged in!");
    closeLogin();
  } catch (err) {
    alert("❌ Login Error: " + err.message);
  }
});

// Show values modal on card click
document.getElementById("valueCard").addEventListener("click", () => {
  document.getElementById("valueModal").classList.remove("hidden");
  document.getElementById("valueModal").classList.add("flex");
});

// Save selected values
document.getElementById("valuesForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selected = Array.from(document.querySelectorAll('input[name="values"]:checked')).map(i => i.value);

  if (selected.length < 1 || selected.length > 3) {
    alert("Please select 1-3 values.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), { coreValues: selected }, { merge: true });
      alert("✅ Values saved!");
      document.getElementById("valueModal").classList.add("hidden");
    } else {
      alert("❌ Please login first.");
    }
  });
});
