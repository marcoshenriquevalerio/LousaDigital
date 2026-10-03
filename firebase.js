// firebase.js — Login com Google + banco de dados (Firestore) da Lousa Digital
// Usa os módulos oficiais via CDN, então funciona direto no GitHub Pages (sem npm/bundler).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqfdAJm5WElb3RZrChFbUEnQKGek-EPlo",
  authDomain: "lousadigital.firebaseapp.com",
  projectId: "lousadigital",
  storageBucket: "lousadigital.firebasestorage.app",
  messagingSenderId: "61389111120",
  appId: "1:61389111120:web:fb129fc70a0537e47ef655"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // deixa escolher a conta a cada login

/* ---------- base64 (seguro para acentos/emojis) ---------- */
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function fromBase64(b64) {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* ---------- caminhos: cada usuário só enxerga o que está dentro de users/{uid} ---------- */
function uid() {
  const u = auth.currentUser;
  if (!u) throw new Error("Usuário não autenticado");
  return u.uid;
}
const mainRef = () => doc(db, "users", uid());
const imageRef = (id) => doc(db, "users", uid(), "images", id);

/* ---------- API usada pelo index.html ---------- */
window.FB = {
  login: () => signInWithPopup(auth, provider),
  logout: () => signOut(auth),

  // Lousas, notas, calendário e tema (JSON convertido em base64)
  async loadAppData() {
    const snap = await getDoc(mainRef());
    if (!snap.exists()) return null;
    const d = snap.data();
    if (!d.payload) return null;
    return JSON.parse(fromBase64(d.payload));
  },

  async saveAppData(obj) {
    const payload = toBase64(JSON.stringify(obj));
    if (payload.length > 950000) {
      throw new Error("Lousa grande demais para salvar (limite de ~950 KB de texto).");
    }
    await setDoc(mainRef(), {
      payload,
      encoding: "base64-json",
      updatedAt: obj.updatedAt || Date.now(),
      email: auth.currentUser.email || null
    });
  },

  // Imagens: cada uma num documento próprio, em base64 (data URL)
  async saveImage(id, dataUrl) {
    await setDoc(imageRef(id), { data: dataUrl, createdAt: Date.now() });
  },

  async loadImage(id) {
    const snap = await getDoc(imageRef(id));
    return snap.exists() ? snap.data().data : null;
  },

  async deleteImage(id) {
    await deleteDoc(imageRef(id));
  }
};

/* ---------- avisa o index.html quando o login muda ---------- */
onAuthStateChanged(auth, (user) => {
  window.dispatchEvent(
    new CustomEvent("fb-auth", {
      detail: {
        user: user
          ? {
              uid: user.uid,
              name: user.displayName || user.email,
              email: user.email,
              photo: user.photoURL
            }
          : null
      }
    })
  );
});
