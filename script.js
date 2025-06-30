// firebase-config.js must already export: auth, db
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Sign Up
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ Account created!");
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

// Values-Based Onboarding
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
      document.getElementById("valuesModal").classList.add("hidden");
    } else {
      alert("❌ Please login first.");
    }
  });
});

// AI Cashflow Predictor
document.getElementById("cashflowForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const income = parseFloat(document.getElementById("income").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const savings = income - expenses;

  const result = document.getElementById("predictionResult");
  result.textContent = savings >= 0
    ? `🌟 You’re likely to save ₹${savings} this month!`
    : `⚠️ You’re overspending by ₹${Math.abs(savings)}.`;
  result.classList.remove("hidden");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await addDoc(collection(db, "users", user.uid, "cashflows"), {
        income,
        expenses,
        savings,
        timestamp: new Date()
      });
    }
  });
});

// Squad Challenge
document.getElementById("squadForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const friend = document.getElementById("friendName").value;
  const challenge = document.getElementById("challengeSelect").value;

  document.getElementById("squadMessage").textContent = `✅ Invite sent to ${friend} for ${challenge}`;
  document.getElementById("squadMessage").classList.remove("hidden");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await addDoc(collection(db, "users", user.uid, "squadChallenges"), {
        friend,
        challenge,
        timestamp: new Date()
      });
    }
  });
});

// Mood Tracker
document.getElementById("moodForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mood = document.querySelector('input[name="mood"]:checked')?.value;

  if (!mood) return alert("Please select a mood.");

  alert(`📝 Mood submitted: ${mood}`);
  closeMoodPopup();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await addDoc(collection(db, "users", user.uid, "moodLogs"), {
        mood,
        timestamp: new Date()
      });
    }
  });
});

// XP System (Real-time level tracking)
window.openXpPopup = () => {
  document.getElementById("xpModal").classList.remove("hidden");
  document.getElementById("xpModal").classList.add("flex");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { xpPoints: 120, level: 3 }, { merge: true });

      document.getElementById("xpLevel").textContent = "3";
      document.getElementById("xpPoints").textContent = "120";
      document.getElementById("xpBar").style.width = "60%";
    }
  });
};

window.closeXpPopup = () => {
  document.getElementById("xpModal").classList.add("hidden");
};

// Peer Insights (Dummy data)
window.openPeerPopup = () => {
  document.getElementById("peerModal").classList.remove("hidden");
  document.getElementById("peerModal").classList.add("flex");
};
window.closePeerPopup = () => {
  document.getElementById("peerModal").classList.add("hidden");
};

// Subscriptions
document.getElementById("subsForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("serviceName").value.trim();
  const cost = parseFloat(document.getElementById("serviceCost").value.trim());

  if (!name || isNaN(cost)) {
    alert("Please enter valid subscription details.");
    return;
  }

  const subsList = document.getElementById("subsList");
  const newEntry = document.createElement("p");
  newEntry.textContent = `📌 ${name} – ₹${cost.toFixed(2)} / month`;
  subsList.appendChild(newEntry);

  document.getElementById("subsForm").reset();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await addDoc(collection(db, "users", user.uid, "subscriptions"), {
        name,
        cost,
        timestamp: new Date()
      });
    }
  });
});

// Maya Chatbot (Static reply)
document.getElementById("chatForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("userMessage");
  const chatWindow = document.getElementById("chatWindow");
  const message = input.value.trim();
  if (!message) return;

  chatWindow.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  chatWindow.innerHTML += `<p><strong>Maya:</strong> Let's work on your financial goals! 💡</p>`;
  input.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
