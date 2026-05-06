import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Design tokens ─────────────────────────────────────────── */
const G = "#2C5F1A";   // primary green
const GD = "#1F4412";   // dark green
const GL = "#EAF3DE";   // light green
const OR = "#E8990A";   // orange accent
const GBG = "#F0EFEB";   // page background
const W = "#FFFFFF";

/* ─── Micro icons ────────────────────────────────────────────── */
const Ico = {
  Check: ({ s = 22, c = W }) => (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="11" fill={c === W ? G : c} />
      <polyline points="5.5,11 9,14.5 16.5,7.5" stroke={W} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={W} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke={W} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Pin: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={col} fillOpacity=".15" stroke={col} strokeWidth="1.8" />
      <circle cx="12" cy="9" r="2.5" fill={col} />
    </svg>
  ),
  Camera: ({ s = 22, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={col} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke={col} strokeWidth="1.8" />
    </svg>
  ),
  Cloud: ({ synced }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke={synced ? G : OR} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {synced && <polyline points="9,12 11,14 15,10" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {!synced && <line x1="12" y1="13" x2="12" y2="17" stroke={OR} strokeWidth="2" strokeLinecap="round" />}
    </svg>
  ),
  Wifi: ({ off }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      {!off
        ? <><path d="M5 12.55a11 11 0 0114.08 0" stroke={W} strokeWidth="2" strokeLinecap="round" /><path d="M1.42 9a16 16 0 0121.16 0" stroke={W} strokeWidth="1.8" strokeLinecap="round" /><path d="M8.53 16.11a6 6 0 016.95 0" stroke={W} strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="20" r="1" fill={W} /></>
        : <><line x1="2" y1="2" x2="22" y2="22" stroke={W} strokeWidth="2" strokeLinecap="round" /><path d="M8.53 16.11a6 6 0 016.95 0" stroke={W} strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="20" r="1" fill={W} /></>
      }
    </svg>
  ),
  Leaf: ({ s = 30, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M6 26C6 26 8 14 20 8C28 4 28 4 28 4C28 4 28 12 22 18C16 24 6 26 6 26Z" fill={col} fillOpacity=".18" stroke={col} strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="6" y1="26" x2="18" y2="14" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Scale: ({ s = 30, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <line x1="16" y1="4" x2="16" y2="28" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="28" x2="24" y2="28" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="10" x2="26" y2="10" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 10 L2 18 C2 20.2 3.8 22 6 22 C8.2 22 10 20.2 10 18 Z" fill={col} fillOpacity=".2" stroke={col} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M26 10 L22 18 C22 20.2 23.8 22 26 22 C28.2 22 30 20.2 30 18 Z" fill={col} fillOpacity=".2" stroke={col} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  Cal: ({ s = 30, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="24" height="22" rx="3" fill={col} fillOpacity=".12" stroke={col} strokeWidth="1.8" />
      <line x1="4" y1="13" x2="28" y2="13" stroke={col} strokeWidth="1.8" />
      <line x1="10" y1="4" x2="10" y2="9" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="4" x2="22" y2="9" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <rect x="9" y="17" width="5" height="4" rx="1" fill={col} fillOpacity=".3" />
      <rect x="18" y="17" width="5" height="4" rx="1" fill={col} fillOpacity=".15" />
    </svg>
  ),
  Clipboard: ({ s = 30, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="5" y="7" width="22" height="22" rx="3" fill={col} fillOpacity=".12" stroke={col} strokeWidth="1.8" />
      <rect x="11" y="4" width="10" height="5" rx="2" fill={col} />
      <polyline points="10,17 13.5,21 22,13" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Spinner: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0110 10" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Farmer: ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="8" r="4" fill={active ? G : "#aaa"} />
      <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={active ? G : "#aaa"} />
      <ellipse cx="16" cy="16" rx="8" ry="2" fill={active ? G : "#aaa"} fillOpacity=".25" />
    </svg>
  ),
  Coop: () => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path d="M4 22 L10 14 L16 18 L22 10 L28 16" stroke="#aaa" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="25" r="2" fill="#aaa" fillOpacity=".5" />
      <circle cx="22" cy="25" r="2" fill="#aaa" fillOpacity=".5" />
      <line x1="10" y1="23" x2="22" y2="23" stroke="#aaa" strokeWidth="1.5" />
    </svg>
  ),
  Verif: () => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="3" width="16" height="20" rx="2" stroke="#aaa" strokeWidth="1.8" fill="none" />
      <line x1="9" y1="9" x2="17" y2="9" stroke="#aaa" strokeWidth="1.5" />
      <line x1="9" y1="13" x2="17" y2="13" stroke="#aaa" strokeWidth="1.5" />
      <circle cx="23" cy="23" r="6" stroke="#aaa" strokeWidth="1.8" fill={W} />
      <line x1="27" y1="27" x2="30" y2="30" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Export: () => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="#aaa" strokeWidth="1.8" fill="none" />
      <ellipse cx="16" cy="16" rx="5" ry="11" stroke="#aaa" strokeWidth="1.5" fill="none" />
      <line x1="5" y1="12" x2="27" y2="12" stroke="#aaa" strokeWidth="1.5" />
      <line x1="5" y1="20" x2="27" y2="20" stroke="#aaa" strokeWidth="1.5" />
    </svg>
  ),
};

/* ─── LoginScreen Component ──────────────────────────────────── */
/* ─── Welcome Screen ──────────────────────────────────────── */
function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EAF3DE 0%, #F0EFEB 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: W, borderRadius: 32, padding: 40, maxWidth: 450, width: "100%", boxShadow: "0 20px 60px rgba(44,95,26,0.15)", textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          <Ico.Leaf s={64} col={G} />
          <h1 style={{ color: G, fontSize: 28, margin: "16px 0 8px", fontWeight: 800 }}>ChainCacao</h1>
          <p style={{ color: "#666", fontSize: 15, margin: 0 }}>Traçabilité blockchain des récoltes</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
          <button 
            onClick={() => onLogin()}
            style={{
              padding: "16px 32px",
              background: G,
              color: W,
              border: "none",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(44,95,26,0.3)",
              transition: "transform 0.2s"
            }}
          >
            Se connecter
          </button>
          <button 
            onClick={onSignup}
            style={{
              padding: "16px 32px",
              background: W,
              color: G,
              border: `2px solid ${G}`,
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🌱 Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Login Screen ────────────────────────────────────────── */
function LoginScreen({ onLogin, onBack }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (phone && password.length >= 4) {
        const isFirstTime = false;
        if (isFirstTime) { alert("🌱 Première connexion !"); onLogin("signup"); }
        else { onLogin({ name: "Koffi Mensah", phone, coop: "COOPAC Kloto", role: "farmer" }); }
      } else { alert("Identifiants incorrects"); }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EAF3DE 0%, #F0EFEB 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: W, borderRadius: 32, padding: 40, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(44,95,26,0.15)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "#888", cursor: "pointer", marginBottom: 16 }}>← Retour</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Ico.Leaf s={56} col={G} />
          <h2 style={{ color: G, fontSize: 24, margin: "16px 0 8px", fontWeight: 800 }}>Connexion</h2>
          <p style={{ color: "#666", margin: 0 }}>Accédez à votre espace agriculteur</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="tel" placeholder="📱 +228 XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} required />
          <input type="password" placeholder="🔐 Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} required />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: loading ? "#999" : G, color: W, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>{loading ? "Connexion..." : "Se connecter"}</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 20, padding: "16px 0", borderTop: "1px solid #eee" }}>
          <span style={{ fontSize: 13, color: "#666" }}>Première fois ? </span>
          <button onClick={() => onLogin("signup")} style={{ background: "none", border: "none", color: OR, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Créer un compte</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Species data ───────────────────────────────────────────── */
const SPECIES = [
  { id: "forastero", label: "Cacao — Forastero", emoji: "🍫", origin: "Togo" },
  { id: "trinitario", label: "Cacao — Trinitario", emoji: "🍫", origin: "Togo" },
  { id: "criollo", label: "Cacao — Criollo", emoji: "🍫", origin: "Togo" },
  { id: "robusta", label: "Café — Robusta", emoji: "☕", origin: "Togo" },
];

/* ─── Offline queue simulation (in-memory) ───────────────────── */
let offlineQueue = [];

function addToQueue(record) {
  offlineQueue = [...offlineQueue, { ...record, queuedAt: Date.now(), id: Math.random().toString(36).slice(2) }];
}

/* ─── Simulated backend sync ─────────────────────────────────── */
async function syncToBackend(record) {
  await new Promise(r => setTimeout(r, 1800));
  if (Math.random() < 0.15) throw new Error("Erreur réseau");
  return { hash: "0x" + Math.random().toString(16).slice(2, 18).toUpperCase(), blockId: Math.floor(Math.random() * 999999) };
}

/* ─── Step progress bar ──────────────────────────────────────── */
function Stepper({ step }) {
  const steps = ["Espèce", "Poids", "Date & Photo", "Validation"];
  return (
    <div style={{ background: W, borderRadius: 14, padding: "16px 14px 10px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {i > 0 && (
                  <div style={{ flex: 1, height: 2, background: done || active ? G : "#ddd", marginRight: 2, transition: "background .4s" }} />
                )}
                <div style={{ flexShrink: 0 }}>
                  {done ? <Ico.Check s={26} /> : (
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: active ? OR : "#ddd",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: active ? W : "#aaa", fontWeight: 700, fontSize: 12,
                      transition: "background .3s",
                    }}>{i + 1}</div>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? G : "#ddd", marginLeft: 2, transition: "background .4s" }} />
                )}
              </div>
              <div style={{ marginTop: 5, fontSize: 10, color: active ? "#555" : done ? G : "#aaa", fontWeight: active || done ? 600 : 400, textAlign: "center", lineHeight: 1.2 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Section title ──────────────────────────────────────────── */
function SectionTitle({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 4, height: 26, background: G, borderRadius: 2 }} />
      <div style={{ marginRight: 6 }}>{icon}</div>
      <span style={{ fontWeight: 700, fontSize: 16, color: "#222" }}>{text}</span>
    </div>
  );
}

/* ─── Btn ────────────────────────────────────────────────────── */
function Btn({ children, onClick, disabled, outline, loading, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      width: "100%", border: outline ? `2px solid ${G}` : "none",
      background: outline ? "transparent" : disabled ? "#ccc" : G,
      color: outline ? G : W,
      borderRadius: 13, padding: "15px 0",
      fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      transition: "opacity .2s, background .2s",
      opacity: disabled && !loading ? 0.6 : 1,
      ...style,
    }}>
      {loading ? <Ico.Spinner /> : null}
      {children}
    </button>
  );
}

/* ─── GPS Hook ───────────────────────────────────────────────── */
function useGPS() {
  const [state, setState] = useState({ status: "idle", coords: null, error: null });
  const capture = useCallback(() => {
    setState({ status: "loading", coords: null, error: null });
    if (!navigator.geolocation) {
      setTimeout(() => setState({
        status: "done",
        coords: { lat: 6.1372 + (Math.random() - .5) * 0.002, lng: 1.2123 + (Math.random() - .5) * 0.002, acc: 8 },
        error: null,
      }), 1200);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setState({
        status: "done",
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) },
        error: null,
      }),
      () => {
        setTimeout(() => setState({
          status: "done",
          coords: { lat: 6.1372, lng: 1.2123, acc: 15 },
          error: null,
        }), 800);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);
  return { ...state, capture };
}

/* ─── SignupScreen Component ─────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
function SignupScreen({ onSignup, onBackToLogin }) {
  const [form, setForm] = useState({
    name: "", phone: "", coop: "", password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSignup({
        name: form.name,
        phone: form.phone,
        coop: form.coop,
        role: "farmer"
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: GBG, padding: 20 }}>
      <div style={{ background: W, padding: 24, borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Ico.Leaf s={40} col={G} />
          <h2 style={{ margin: "12px 0 4px", color: G }}>Rejoindre ChainCacao</h2>
          <p style={{ margin: 0, color: "#666", fontSize: 13 }}>Crée ton compte agriculteur</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="👤 Nom complet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input placeholder="📱 Téléphone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input placeholder="🤝 Coopérative" value={form.coop} onChange={e => setForm({ ...form, coop: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input type="password" placeholder="🔐 Mot de passe (min 4 caractères)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <Btn loading={loading} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Création..." : "✅ Créer mon compte"}
          </Btn>
        </form>
        <div style={{ textAlign: "center", marginTop: 16, padding: "12px 0", borderTop: "1px solid #eee" }}>
          <span style={{ fontSize: 13, color: "#666" }}>Déjà inscrit ? </span>
          <button onClick={onBackToLogin} style={{ background: "none", border: "none", color: OR, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────────── */
export default function App() {
  // ─── 1. TOUS les states d'abord ─────────────────────────────
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ species: null, weight: "", date: new Date().toISOString().slice(0, 10), photo: null, photoURL: null });
  const [syncState, setSyncState] = useState({ status: "idle", hash: null, blockId: null, error: null, queued: false });
  const [offline, setOffline] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('welcome');
  const gps = useGPS();
  const fileRef = useRef();

  // ─── 2. TOUS les useEffect ensuite ──────────────────────────
  // ✅ CORRECTION 1 : Ajout de 'gps' dans les dépendances
  useEffect(() => { if (step === 3 && gps.status === "idle") gps.capture(); }, [step, gps]);

  // ─── 3. TOUTES les fonctions ensuite ────────────────────────
  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, photo: file, photoURL: url }));
  }

  async function handleSubmit() {
    setSyncing(true);
    const record = { ...form, gps: gps.coords, timestamp: Date.now(), farmer: user?.name || "Koffi Mensah", coop: user?.coop || "COOPAC Kloto" };
    if (offline) {
      addToQueue(record); setQueueCount(q => q + 1);
      setSyncState({ status: "queued", hash: null, blockId: null, error: null, queued: true });
      setSyncing(false); setStep(5); return;
    }
    try {
      const result = await syncToBackend(record);
      setSyncState({ status: "done", hash: result.hash, blockId: result.blockId, error: null, queued: false });
      setStep(5);
    } catch (err) {
      addToQueue(record); setQueueCount(q => q + 1);
      setSyncState({ status: "queued", hash: null, blockId: null, error: err.message, queued: true });
      setStep(5);
    }
    setSyncing(false);
  }

  async function drainQueue() {
    if (queueCount === 0) return;
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2200));
    setQueueCount(0); offlineQueue = [];
    setSyncing(false);
  }

  function reset() {
    setStep(0);
    setForm({ species: null, weight: "", date: new Date().toISOString().slice(0, 10), photo: null, photoURL: null });
    setSyncState({ status: "idle", hash: null, blockId: null, error: null, queued: false });
  }

  const canNext = [ !!form.species, form.weight && parseFloat(form.weight) > 0, !!form.date, gps.status === "done" ];

  // ─── 4. GARDE AUTH : si pas connecté → écrans login/signup ─
  if (!user) {
    if (authScreen === 'welcome') {
      return <WelcomeScreen onLogin={() => setAuthScreen('login')} onSignup={() => setAuthScreen('signup')} />;
    }
    if (authScreen === 'login') {
      return <LoginScreen onLogin={(data) => { if (data === 'signup') setAuthScreen('signup'); else setUser(data); }} onBack={() => setAuthScreen('welcome')} />;
    }
    if (authScreen === 'signup') {
      return <SignupScreen onSignup={setUser} onBack={() => setAuthScreen('welcome')} />;
    }
  }

  // ─── 5. RETURN PRINCIPAL (app de récolte) ──────────────────
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: "#dedad3", padding: "20px 12px", fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,.5)}50%{box-shadow:0 0 0 8px rgba(46,204,113,0)}}.card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px}.row-field{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px}.row-field:last-child{border-bottom:none}.chip{display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border-radius:10px;border:1.5px solid #e0e0e0;font-size:13px;cursor:pointer;transition:all .2s}.chip.active{border-color:${G};background:${GL};color:${G};font-weight:600}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}`}</style>
      <div style={{ width: 375, background: GBG, borderRadius: 38, overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,.28)" }}>
        {/* Status bar */}
        <div style={{ background: GD, padding: "11px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: W, fontWeight: 700, fontSize: 15 }}>9:40</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setOffline(o => !o)} style={{ background: offline ? "rgba(232,153,10,.25)" : "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "2px 8px", cursor: "pointer", color: W, fontSize: 10, fontWeight: 600 }}>{offline ? "HORS-LIGNE" : "EN LIGNE"}</button>
            <Ico.Wifi off={offline} />
          </div>
        </div>
        {/* Header */}
        <div style={{ background: GD, padding: "8px 18px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div><div style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginBottom: 2 }}>Nouvelle récolte</div><div style={{ color: W, fontSize: 19, fontWeight: 700 }}>Enregistrement blockchain</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            {queueCount > 0 && <button onClick={drainQueue} style={{ position: "relative", background: "rgba(232,153,10,.25)", border: "1px solid rgba(232,153,10,.5)", borderRadius: 10, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><Ico.Cloud synced={false} /><span style={{ color: W, fontSize: 11, fontWeight: 700 }}>{queueCount}</span></button>}
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.Bell /></div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: W, fontWeight: 700, fontSize: 13, cursor: "pointer" }} onClick={() => { if (window.confirm("Se déconnecter ?")) setUser(null); }}>
              {user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
              <span style={{ position: "absolute", bottom: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: OR, color: W, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${GD}` }}>✕</span>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ background: GBG, padding: "16px 14px 0", minHeight: 520 }}>
          {step < 4 && <Stepper step={step} />}
          {/* STEP 0 */}
          {step === 0 && (<div style={{ animation: "fadeUp .3s ease" }}><SectionTitle icon={<Ico.Leaf />} text="Quelle espèce récoltez-vous ?" /><div className="card">{SPECIES.map(sp => (<div key={sp.id} onClick={() => setForm(f => ({ ...f, species: sp }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: form.species?.id === sp.id ? GL : "transparent", border: `1.5px solid ${form.species?.id === sp.id ? G : "transparent"}`, transition: "all .2s" }}><span style={{ fontSize: 22 }}>{sp.emoji}</span><div style={{ flex: 1 }}><div style={{ fontWeight: form.species?.id === sp.id ? 700 : 500, fontSize: 14, color: form.species?.id === sp.id ? G : "#222" }}>{sp.label}</div><div style={{ fontSize: 11, color: "#999" }}>Origine : {sp.origin}</div></div>{form.species?.id === sp.id && <Ico.Check s={20} />}</div>))}</div><Btn disabled={!canNext[0]} onClick={() => setStep(1)}>Suivant →</Btn></div>)}
          {/* STEP 1 */}
          {step === 1 && (<div style={{ animation: "fadeUp .3s ease" }}><SectionTitle icon={<Ico.Scale />} text="Poids de la récolte" /><div className="card"><div style={{ textAlign: "center", padding: "10px 0 16px" }}><div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 6 }}><input type="number" min="1" max="9999" placeholder="000" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} style={{ width: 130, fontSize: 52, fontWeight: 800, color: G, border: "none", background: "transparent", textAlign: "right", outline: "none", caretColor: G }} /><span style={{ fontSize: 24, fontWeight: 600, color: "#666" }}>kg</span></div><div style={{ marginTop: 6, height: 3, background: "#eee", borderRadius: 2 }}><div style={{ height: "100%", background: G, borderRadius: 2, width: `${Math.min(100, (parseFloat(form.weight) || 0) / 10)}%`, transition: "width .3s" }} /></div></div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 6 }}>{[50, 100, 200, 500].map(n => (<button key={n} onClick={() => setForm(f => ({ ...f, weight: String(n) }))} style={{ padding: "8px 0", borderRadius: 9, border: `1.5px solid ${form.weight === n ? G : "#e0e0e0"}`, background: form.weight === n ? GL : W, color: form.weight === n ? G : "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{n} kg</button>))}</div><div style={{ marginTop: 14, padding: "10px 12px", background: "#f8f8f6", borderRadius: 10, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}><span>ℹ</span> Saisissez le poids brut incluant l'emballage.</div></div><div style={{ display: "flex", gap: 10 }}><Btn outline onClick={() => setStep(0)} style={{ width: "auto", flex: 0, padding: "15px 20px" }}>← Retour</Btn><Btn disabled={!canNext[1]} onClick={() => setStep(2)}>Suivant →</Btn></div></div>)}
          {/* STEP 2 */}
          {step === 2 && (<div style={{ animation: "fadeUp .3s ease" }}><SectionTitle icon={<Ico.Cal />} text="Date de récolte" /><div className="card"><input type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%", fontSize: 20, fontWeight: 700, color: G, border: "none", outline: "none", background: "transparent", cursor: "pointer", padding: "6px 0" }} /><div style={{ height: 1, background: "#eee", margin: "10px 0" }} /><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{[0, 1, 2, 7].map(d => { const dt = new Date(); dt.setDate(dt.getDate() - d); const iso = dt.toISOString().slice(0, 10); const label = d === 0 ? "Aujourd'hui" : d === 1 ? "Hier" : `Il y a ${d}j`; return (<div key={d} className={`chip ${form.date === iso ? "active" : ""}`} onClick={() => setForm(f => ({ ...f, date: iso }))}>{label}</div>); })}</div></div><SectionTitle icon={<Ico.Camera />} text="Photo de la récolte" /><div className="card"><input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />{form.photoURL ? (<div style={{ position: "relative" }}><img src={form.photoURL} alt="récolte" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} /><button onClick={() => setForm(f => ({ ...f, photo: null, photoURL: null }))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.55)", border: "none", color: W, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>✕ Supprimer</button><div style={{ marginTop: 8, padding: "7px 10px", background: GL, borderRadius: 8, fontSize: 12, color: G, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Ico.Check s={16} /> Photo capturée</div></div>) : (<button onClick={() => fileRef.current?.click()} style={{ width: "100%", height: 130, border: `2px dashed ${G}`, borderRadius: 12, background: GL, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}><Ico.Camera s={32} /><span style={{ fontSize: 14, fontWeight: 600, color: G }}>Prendre une photo</span><span style={{ fontSize: 11, color: "#888" }}>Ou importer depuis la galerie</span></button>)}<div style={{ marginTop: 10, fontSize: 11, color: "#aaa", textAlign: "center" }}>La photo est optionnelle mais recommandée pour la traçabilité.</div></div><div style={{ display: "flex", gap: 10 }}><Btn outline onClick={() => setStep(1)} style={{ width: "auto", flex: 0, padding: "15px 20px" }}>← Retour</Btn><Btn disabled={!canNext[2]} onClick={() => setStep(3)}>Suivant →</Btn></div></div>)}
          {/* STEP 3 */}
          {step === 3 && (<div style={{ animation: "fadeUp .3s ease" }}><SectionTitle icon={<Ico.Clipboard />} text="Récapitulatif" /><div className="card">{[{l:"Espèce",v:form.species?.label},{l:"Poids brut",v:`${form.weight} kg`},{l:"Date",v:new Date(form.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})},{l:"Producteur",v:user?.name||"Koffi Mensah"},{l:"Coopérative",v:user?.coop||"COOPAC Kloto"},{l:"Photo",v:form.photoURL?"✓ Capturée":"Non fournie"}].map(({l,v})=>(<div key={l} className="row-field"><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:700,color:"#111",maxWidth:180,textAlign:"right"}}>{v}</span></div>))}</div><SectionTitle icon={<Ico.Pin />} text="Localisation GPS" /><div className="card">{gps.status==="loading" && (<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",color:"#666",fontSize:14}}><Ico.Spinner /> Acquisition du signal GPS…</div>)}{gps.status==="done" && gps.coords && (<><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:12,height:12,borderRadius:"50%",background:"#2ECC71",flexShrink:0,animation:"pulse 2s infinite"}} /><div><div style={{fontWeight:700,fontSize:15,color:"#111"}}>{gps.coords.lat.toFixed(4)}° N, {gps.coords.lng.toFixed(4)}° E</div><div style={{fontSize:11,color:"#999",marginTop:2}}>Région des Plateaux — Kloto • Précision {gps.coords.acc}m</div></div></div><button onClick={gps.capture} style={{marginTop:10,background:"none",border:`1px solid ${G}`,color:G,borderRadius:8,padding:"5px 12px",fontSize:11,cursor:"pointer",fontWeight:600}}>↺ Recapturer</button></>)}</div>{offline && (<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(232,153,10,.1)",border:`1px solid rgba(232,153,10,.35)`,marginBottom:12,fontSize:12,color:"#8a5e00",display:"flex",gap:8,alignItems:"flex-start"}}><Ico.Cloud synced={false} /><span>Mode hors-ligne actif. Synchronisation automatique à la reconnexion.</span></div>)}<div style={{display:"flex",gap:10,marginBottom:4}}><Btn outline onClick={()=>setStep(2)} style={{width:"auto",flex:0,padding:"15px 20px"}}>← Retour</Btn><Btn disabled={!canNext[3]} loading={syncing} onClick={handleSubmit}>{offline?"💾 Enregistrer (offline)":"Enregistrer sur la blockchain"}</Btn></div></div>)}
          {/* STEP 5 */}
          {step === 5 && (<div style={{animation:"fadeUp .4s ease",textAlign:"center",padding:"20px 0 10px"}}><div style={{width:72,height:72,borderRadius:"50%",background:syncState.queued?"rgba(232,153,10,.15)":GL,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",border:`3px solid ${syncState.queued?OR:G}`}}>{syncState.queued?<Ico.Cloud synced={false} />:<Ico.Check s={36} />}</div><div style={{fontWeight:800,fontSize:20,color:syncState.queued?"#7a5500":G,marginBottom:6}}>{syncState.queued?"Enregistré hors-ligne":"Blockchain confirmée !"}</div><div style={{fontSize:13,color:"#888",marginBottom:18,lineHeight:1.6}}>{syncState.queued?`Synchronisation automatique au retour du réseau. ${queueCount} récolte(s) en attente.`:"Votre récolte a été inscrite de manière immuable sur la blockchain."}</div>{syncState.hash && (<div style={{background:W,borderRadius:12,padding:"12px 14px",textAlign:"left",marginBottom:16}}><div className="row-field"><span style={{color:"#888",fontSize:12}}>Hash</span><span style={{fontFamily:"monospace",fontSize:11,color:G,fontWeight:700}}>{syncState.hash}</span></div><div className="row-field"><span style={{color:"#888",fontSize:12}}>Block ID</span><span style={{fontFamily:"monospace",fontSize:11,color:"#333"}}>#{syncState.blockId}</span></div></div>)}{queueCount>0 && !syncing && (<Btn onClick={drainQueue} style={{background:OR,marginBottom:10}}>↑ Synchroniser {queueCount} récolte(s)</Btn>)}{syncing && <Btn loading={true} disabled>Synchronisation…</Btn>}<Btn outline onClick={reset} style={{marginTop:8}}>+ Nouvelle récolte</Btn></div>)}
          <div style={{height:16}} />
        </div>
        {/* Bottom nav */}
        <div style={{background:W,borderTop:"1px solid #ebebeb",display:"flex",justifyContent:"space-around",alignItems:"center",padding:"10px 6px 18px"}}>{[{label:"Agriculteur",icon:<Ico.Farmer active={true} />,active:true},{label:"Coopérative",icon:<Ico.Coop />},{plus:true},{label:"Vérificateur",icon:<Ico.Verif />},{label:"Exportateur",icon:<Ico.Export />}].map((item,i)=>item.plus?(<div key={i} style={{width:48,height:48,borderRadius:13,background:G,display:"flex",alignItems:"center",justifyContent:"center",color:W,fontSize:24,fontWeight:300,cursor:"pointer",marginTop:-10,boxShadow:"0 4px 14px rgba(44,95,26,.35)"}}>+</div>):(<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>{item.icon}<span style={{fontSize:10,color:item.active?G:"#aaa",fontWeight:item.active?700:400}}>{item.label}</span></div>))}</div>
      </div>
    </div>
  );
}