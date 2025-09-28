// 📦 Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 👤 Auth Functions
async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Signup error:", error.message);
  }
}

async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Login error:", error.message);
  }
}

function logout() {
  signOut(auth).then(() => {
    console.log("User signed out");
  });
}

// 📚 Book Functions
async function addBook(book) {
  const docRef = await addDoc(collection(db, "books"), book);
  console.log("Book added with ID:", docRef.id);
}

function makeBookCard(bookData, bookId) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
    <img src="${bookData.coverUrl}" alt="${bookData.title}">
    <h4>${bookData.title}</h4>
    <button class="btn" data-id="${bookId}">Borrow</button>
  `;
  return card;
}

async function renderBooks() {
  const booksContainer = document.querySelector(".book-grid");
  booksContainer.innerHTML = "";
  const snapshot = await getDocs(collection(db, "books"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    const card = makeBookCard(data, id);
    booksContainer.appendChild(card);
  });

  // Re-attach borrow listeners
  document.querySelectorAll(".book-card .btn").forEach(button => {
    button.addEventListener("click", () => {
      requestBorrow(button.dataset.id);
    });
  });
}

async function requestBorrow(bookId) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }
  await addDoc(collection(db, "borrowRequests"), {
    userId: user.uid,
    bookId: bookId,
    status: "pending",
    timestamp: new Date()
  });
  alert("✅ Borrow request submitted.");
}

// 🔍 Search Functionality
const searchInput = document.querySelector('.search');
searchInput.addEventListener('keyup', function () {
  const query = this.value.toLowerCase();
  const bookCards = document.querySelectorAll('.book-card');
  bookCards.forEach(card => {
    const title = card.querySelector('h4').textContent.toLowerCase();
    card.style.display = title.includes(query) ? 'block' : 'none';
  });
});

// 🆙 Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.textContent = '↑ Top';
backToTopBtn.className = 'back-to-top';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  backToTopBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 🔐 Auth UI Handlers
document.getElementById("btn-signup").addEventListener("click", () => {
  const email = document.getElementById("auth-email").value;
  const pass = document.getElementById("auth-pass").value;
  signup(email, pass);
});

document.getElementById("btn-login").addEventListener("click", () => {
  const email = document.getElementById("auth-email").value;
  const pass = document.getElementById("auth-pass").value;
  login(email, pass);
});

// 👀 Auth State Listener
onAuthStateChanged(auth, (user) => {
  const authSection = document.getElementById("auth");
  const mainContent = document.getElementById("main-content");

  if (user) {
    console.log("User is signed in:", user.email);
    authSection.style.display = "none";
    mainContent.style.display = "block";
    renderBooks();
  } else {
    console.log("No user signed in.");
    authSection.style.display = "block";
    mainContent.style.display = "none";
  }
});

