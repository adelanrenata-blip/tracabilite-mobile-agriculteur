import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Design tokens ─────────────────────────────────────────── */
const G = "#2C5F1A";
const GD = "#1F4412";
const GL = "#EAF3DE";
const OR = "#E8990A";
const GBG = "#F0EFEB";
const W = "#FFFFFF";
const RED = "#C41E3A";

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
  Network4G: () => (
    <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
      <text x="0" y="13" fill={W} fontSize="11" fontWeight="700" fontFamily="sans-serif">4G</text>
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
  Coop: ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path d="M4 22 L10 14 L16 18 L22 10 L28 16" stroke={active ? G : "#aaa"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="25" r="2" fill={active ? G : "#aaa"} fillOpacity=".5" />
      <circle cx="22" cy="25" r="2" fill={active ? G : "#aaa"} fillOpacity=".5" />
      <line x1="10" y1="23" x2="22" y2="23" stroke={active ? G : "#aaa"} strokeWidth="1.5" />
    </svg>
  ),
  Verif: ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="3" width="16" height="20" rx="2" stroke={active ? G : "#aaa"} strokeWidth="1.8" fill="none" />
      <line x1="9" y1="9" x2="17" y2="9" stroke={active ? G : "#aaa"} strokeWidth="1.5" />
      <line x1="9" y1="13" x2="17" y2="13" stroke={active ? G : "#aaa"} strokeWidth="1.5" />
      <circle cx="23" cy="23" r="6" stroke={active ? G : "#aaa"} strokeWidth="1.8" fill={W} />
      <line x1="27" y1="27" x2="30" y2="30" stroke={active ? G : "#aaa"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Export: ({ active }) => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke={active ? G : "#aaa"} strokeWidth="1.8" fill="none" />
      <ellipse cx="16" cy="16" rx="5" ry="11" stroke={active ? G : "#aaa"} strokeWidth="1.5" fill="none" />
      <line x1="5" y1="12" x2="27" y2="12" stroke={active ? G : "#aaa"} strokeWidth="1.5" />
      <line x1="5" y1="20" x2="27" y2="20" stroke={active ? G : "#aaa"} strokeWidth="1.5" />
    </svg>
  ),
  Cube: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="4" width="28" height="24" rx="4" stroke={col} strokeWidth="1.8" fill={col} fillOpacity=".08" />
      <line x1="8" y1="12" x2="24" y2="12" stroke={col} strokeWidth="1.5" />
      <line x1="8" y1="17" x2="20" y2="17" stroke={col} strokeWidth="1.5" />
      <line x1="8" y1="22" x2="16" y2="22" stroke={col} strokeWidth="1.5" />
    </svg>
  ),
  Qr: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={col} strokeWidth="1.8" />
      <rect x="6" y="6" width="12" height="12" rx="1" fill={col} fillOpacity=".1" />
      <rect x="8" y="8" width="3" height="3" fill={col} fillOpacity=".4" />
      <rect x="13" y="8" width="3" height="3" fill={col} fillOpacity=".2" />
      <rect x="8" y="13" width="3" height="3" fill={col} fillOpacity=".2" />
      <rect x="13" y="13" width="3" height="3" fill={col} fillOpacity=".4" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="19" y1="12" x2="5" y2="12" stroke={W} strokeWidth="2" strokeLinecap="round" />
      <polyline points="12,5 5,12 12,19" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Route: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="6" r="3" fill={col} fillOpacity=".2" stroke={col} strokeWidth="1.8" />
      <circle cx="18" cy="18" r="3" fill={col} fillOpacity=".2" stroke={col} strokeWidth="1.8" />
      <path d="M8.5 8.5L15.5 15.5" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  ),
  FileCert: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={col} strokeWidth="1.8" fill={col} fillOpacity=".1" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" stroke={col} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="13" x2="15" y2="13" stroke={col} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="17" x2="15" y2="17" stroke={col} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Download: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7,10 12,15 17,10" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Share: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke={col} strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke={col} strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke={col} strokeWidth="1.8" />
      <line x1="8.5" y1="10.5" x2="15.5" y2="6.5" stroke={col} strokeWidth="1.8" />
      <line x1="8.5" y1="13.5" x2="15.5" y2="17.5" stroke={col} strokeWidth="1.8" />
    </svg>
  ),
  Trophy: ({ s = 20, col = OR }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M6 4h12v3a6 6 0 01-12 0V4z" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7H4a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 7h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Wallet: ({ s = 20, col = OR }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={col} strokeWidth="1.8" />
      <path d="M16 12h.01" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h18" stroke={col} strokeWidth="1.8" />
    </svg>
  ),
  Building: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={col} strokeWidth="1.8" />
      <line x1="9" y1="2" x2="9" y2="22" stroke={col} strokeWidth="1.8" />
      <line x1="15" y1="2" x2="15" y2="22" stroke={col} strokeWidth="1.8" />
      <line x1="4" y1="8" x2="20" y2="8" stroke={col} strokeWidth="1.8" />
      <line x1="4" y1="16" x2="20" y2="16" stroke={col} strokeWidth="1.8" />
    </svg>
  ),
  ChevronRight: ({ s = 16, col = "#999" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <polyline points="9,18 15,12 9,6" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Logout: ({ s = 18, col = RED }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="16,17 21,12 16,7" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Reset: ({ s = 18, col = G }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <polyline points="1,4 1,10 7,10" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke={col} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

/* ─── Cooperatives data ─────────────────────────────────────── */
const COOPERATIVES = [
  { id: "c1", name: "COOPAC Kloto", region: "Plateaux" },
  { id: "c2", name: "COOPAC Kpalimé", region: "Plateaux" },
  { id: "c3", name: "COOPAC Atakpamé", region: "Plateaux" },
  { id: "c4", name: "COOPAC Sokodé", region: "Centrale" },
  { id: "c5", name: "COOPAC Kara", region: "Kara" },
];

/* ─── Species data ───────────────────────────────────────────── */
const SPECIES = [
  { id: "forastero", label: "Cacao — Forastero", emoji: "🍫", origin: "Togo" },
  { id: "trinitario", label: "Cacao — Trinitario", emoji: "🍫", origin: "Togo" },
  { id: "criollo", label: "Cacao — Criollo", emoji: "🍫", origin: "Togo" },
  { id: "robusta", label: "Café — Robusta", emoji: "☕", origin: "Togo" },
];

/* ─── Sample lots data ───────────────────────────────────────── */
const SAMPLE_LOTS = [
  {
    id: "LOT-TG-2026-04791", prod: "Cacao", sp: "Forastero", wt: 245,
    origin: { lat: 6.1372, lng: 1.2123, vil: "Kpalimé", reg: "Plateaux" },
    date: "2026-02-18", farmer: "Koffi Mensah", coop: "COOPAC Kloto",
    status: "exporte", certs: ["Fairtrade", "EUDR"],
    chain: [
      { from: "Agriculteur", to: "COOPAC Kloto", date: "2026-02-19", wt: 245, loc: "Kpalimé" },
      { from: "COOPAC Kloto", to: "TogoCacao SA", date: "2026-02-24", wt: 244, loc: "Lomé" },
      { from: "TogoCacao SA", to: "ExportAfrique SARL", date: "2026-03-04", wt: 243, loc: "Port de Lomé" },
    ],
    blocks: [
      { idx: 47, action: "CREATION", desc: "Lot créé — Koffi Mensah", hash: "0xA3F2…8D1C", ts: "18 fév. 09:14" },
      { idx: 52, action: "TRANSFER", desc: "Ferme → COOPAC Kloto", hash: "0xB7C1…4E9F", ts: "19 fév. 11:02" },
      { idx: 58, action: "TRANSFER", desc: "COOPAC → TogoCacao SA", hash: "0xD1E8…2A7B", ts: "24 fév. 14:30" },
      { idx: 63, action: "TRANSFER", desc: "TogoCacao → ExportAfrique", hash: "0xF4A6…7C3E", ts: "04 mars 08:45" },
      { idx: 67, action: "CERTIFICATION", desc: "Certificat EUDR émis", hash: "0xE9D3…1F5A", ts: "04 mars 09:01" },
    ],
  },
  {
    id: "LOT-TG-2026-04792", prod: "Cacao", sp: "Amelonado", wt: 1820,
    origin: { lat: 7.9325, lng: 1.1325, vil: "Atakpamé", reg: "Plateaux" },
    date: "2026-03-01", farmer: "Ama Kpelou", coop: "COOPAC Kloto",
    status: "transformateur", certs: [],
    chain: [
      { from: "Agriculteur", to: "COOPAC Kloto", date: "2026-03-02", wt: 1818, loc: "Atakpamé" },
      { from: "COOPAC Kloto", to: "TogoCacao SA", date: "2026-03-08", wt: 1815, loc: "Lomé" },
    ],
    blocks: [
      { idx: 71, action: "CREATION", desc: "Lot créé — Ama Kpelou", hash: "0xC2A7…5B8D", ts: "01 mars 10:22" },
      { idx: 74, action: "TRANSFER", desc: "Ferme → COOPAC Kloto", hash: "0x8F1E…3C6A", ts: "02 mars 08:15" },
      { idx: 79, action: "TRANSFER", desc: "COOPAC → TogoCacao SA", hash: "0xA4D9…9E2F", ts: "08 mars 15:40" },
    ],
  },
  {
    id: "LOT-TG-2026-04793", prod: "Café", sp: "Robusta", wt: 640,
    origin: { lat: 9.2034, lng: 1.1384, vil: "Sokodé", reg: "Centrale" },
    date: "2026-03-10", farmer: "Yaw Dzokoto", coop: "COOPAC Kloto",
    status: "cooperative", certs: [],
    chain: [
      { from: "Agriculteur", to: "COOPAC Kloto", date: "2026-03-11", wt: 638, loc: "Sokodé" },
    ],
    blocks: [
      { idx: 82, action: "CREATION", desc: "Lot créé — Yaw Dzokoto", hash: "0x6B3F…D4C1", ts: "10 mars 07:50" },
      { idx: 85, action: "TRANSFER", desc: "Ferme → COOPAC Kloto", hash: "0xE7A2…8F3B", ts: "11 mars 09:30" },
    ],
  },
  {
    id: "LOT-TG-2026-04794", prod: "Cacao", sp: "Trinitario", wt: 3100,
    origin: { lat: 7.5833, lng: 0.6167, vil: "Badou", reg: "Plateaux" },
    date: "2026-03-15", farmer: "Adjo Tchamba", coop: "COOPAC Kloto",
    status: "ferme", certs: [], chain: [],
    blocks: [
      { idx: 88, action: "CREATION", desc: "Lot créé — Adjo Tchamba", hash: "0x1D8C…A7E4", ts: "15 mars 06:30" },
    ],
  },
];

const STATUS_MAP = {
  ferme: { label: "À la ferme", bg: GL, color: G },
  cooperative: { label: "Coopérative", bg: "#FFF8E1", color: "#B8860B" },
  transformateur: { label: "Transformation", bg: "#E3F2FD", color: "#1565C0" },
  exportateur: { label: "Exportateur", bg: GL, color: G },
  exporte: { label: "Exporté", bg: G, color: W },
};

const TIMELINE_STEPS = [
  { key: "ferme", label: "Récolte à la ferme", icon: "🌱" },
  { key: "cooperative", label: "Réception coopérative", icon: "🏢" },
  { key: "transformateur", label: "Transformation", icon: "⚙️" },
  { key: "exportateur", label: "Exportation", icon: "🚢" },
  { key: "exporte", label: "Exporté", icon: "✅" },
];
const STATUS_ORDER = ["ferme", "cooperative", "transformateur", "exportateur", "exporte"];

/* ─── Offline queue ──────────────────────────────────────────── */
let offlineQueue = [];
function addToQueue(record) {
  offlineQueue = [...offlineQueue, { ...record, queuedAt: Date.now(), id: Math.random().toString(36).slice(2) }];
}
async function syncToBackend(record) {
  await new Promise(r => setTimeout(r, 1800));
  if (Math.random() < 0.15) throw new Error("Erreur réseau");
  return { hash: "0x" + Math.random().toString(16).slice(2, 18).toUpperCase(), blockId: Math.floor(Math.random() * 999999) };
}

/* ─── Stepper ────────────────────────────────────────────────── */
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
                {i > 0 && <div style={{ flex: 1, height: 2, background: done || active ? G : "#ddd", marginRight: 2, transition: "background .4s" }} />}
                <div style={{ flexShrink: 0 }}>
                  {done ? <Ico.Check s={26} /> : (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: active ? OR : "#ddd", display: "flex", alignItems: "center", justifyContent: "center", color: active ? W : "#aaa", fontWeight: 700, fontSize: 12, transition: "background .3s" }}>{i + 1}</div>
                  )}
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? G : "#ddd", marginLeft: 2, transition: "background .4s" }} />}
              </div>
              <div style={{ marginTop: 5, fontSize: 10, color: active ? "#555" : done ? G : "#aaa", fontWeight: active || done ? 600 : 400, textAlign: "center", lineHeight: 1.2 }}>{label}</div>
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
      color: outline ? G : W, borderRadius: 13, padding: "15px 0",
      fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      transition: "opacity .2s, background .2s", opacity: disabled && !loading ? 0.6 : 1, ...style,
    }}>
      {loading ? <Ico.Spinner /> : null}{children}
    </button>
  );
}

/* ─── GPS Hook ───────────────────────────────────────────────── */
function useGPS() {
  const [state, setState] = useState({ status: "idle", coords: null, error: null });
  const capture = useCallback(() => {
    setState({ status: "loading", coords: null, error: null });
    if (!navigator.geolocation) {
      setTimeout(() => setState({ status: "done", coords: { lat: 6.1372 + (Math.random() - .5) * 0.002, lng: 1.2123 + (Math.random() - .5) * 0.002, acc: 8 }, error: null }), 1200);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setState({ status: "done", coords: { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) }, error: null }),
      () => setTimeout(() => setState({ status: "done", coords: { lat: 6.1372, lng: 1.2123, acc: 15 }, error: null }), 800),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);
  return { ...state, capture };
}

/* ─── Row field ──────────────────────────────────────────────── */
function RowField({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span style={{ fontWeight: 700, color: "#111", maxWidth: 180, textAlign: "right" }}>{value}</span>
    </div>
  );
}

/* ─── Timeline dot ───────────────────────────────────────────── */
function TlDot({ done, now }) {
  if (done && !now) return (
    <div style={{ position: "absolute", left: -21, top: 4, width: 14, height: 14, borderRadius: "50%", border: "2.5px solid " + G, background: G, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="8" height="8" viewBox="0 0 22 22" fill="none"><polyline points="5.5,11 9,14.5 16.5,7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
  if (now) return (
    <div style={{ position: "absolute", left: -21, top: 4, width: 14, height: 14, borderRadius: "50%", border: "2.5px solid " + OR, background: OR, zIndex: 1, boxShadow: "0 0 0 4px rgba(232,153,10,.15)" }} />
  );
  return (
    <div style={{ position: "absolute", left: -21, top: 4, width: 14, height: 14, borderRadius: "50%", border: "2.5px solid #ddd", background: W, zIndex: 1 }} />
  );
}

/* ─── Profile Screen (Compact Mobile - Image 1) ─────────────── */
function ProfileScreen({ user, onBack, onLogout, onResetDemo, onCoopChange }) {
  const [showCoopModal, setShowCoopModal] = useState(false);
  const initials = user ? `${user.nom?.[0] || ""}${user.prenom?.[0] || ""}`.toUpperCase() : "KA";
  const coopName = user?.coop || "COOPAC Kpalimé";

  return (
    <>
      <div style={{
        background: "#FAF8F3",
        minHeight: "100vh",
        padding: "0 16px 24px",
        fontFamily: "'Segoe UI','Helvetica Neue',sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, paddingBottom: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Ico.ArrowLeft />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Profil</h1>
        </div>

        {/* User Card */}
        <div style={{
          background: W,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #B87333 0%, #8B4513 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: W, fontWeight: 700, fontSize: 18, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#1A1A1A", marginBottom: 2 }}>
              {user ? `${user.prenom} ${user.nom}` : "Kossi Adjovi"}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Agriculteur · {coopName}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: W, borderRadius: 16, padding: 16 }}>
            <div style={{ marginBottom: 8, color: OR }}>
              <Ico.Trophy s={20} col={OR} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, color: "#1A1A1A", marginBottom: 2 }}>12</div>
            <div style={{ fontSize: 11, color: "#888" }}>Lots certifiés</div>
          </div>
          <div style={{ background: W, borderRadius: 16, padding: 16 }}>
            <div style={{ marginBottom: 8, color: OR }}>
              <Ico.Wallet s={20} col={OR} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, color: "#1A1A1A", marginBottom: 2 }}>845 k FCFA</div>
            <div style={{ fontSize: 11, color: "#888" }}>Revenu suivi</div>
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: W, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "12px 16", borderBottom: "1px solid #F0EBE2", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "#666" }}>Langue</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Français</span>
          </div>
          <div style={{ padding: "12px 16", borderBottom: "1px solid #F0EBE2", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "#666" }}>Réseau</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Polygon · Mainnet</span>
          </div>
          <div style={{ padding: "12px 16", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "#666" }}>Synchronisation</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Auto</span>
          </div>
        </div>

        {/* Change Cooperative */}
        <button
          onClick={() => setShowCoopModal(true)}
          style={{
            width: "100%",
            background: W,
            borderRadius: 16,
            padding: "14px 16",
            marginBottom: 16,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Ico.Building s={18} col={G} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Changer de coopérative</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{coopName}</div>
            </div>
          </div>
          <Ico.ChevronRight s={16} col="#BBB" />
        </button>

        {/* Reset Demo */}
        <button
          onClick={onResetDemo}
          style={{
            width: "100%",
            padding: "14px",
            background: "#F0E6D8",
            border: "none",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          <Ico.Reset s={16} col="#666" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#666" }}>Réinitialiser la démo</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "12px",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
            <polyline points="16,17 21,12 16,7" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: RED }}>Se déconnecter</span>
        </button>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#AAA" }}>
          ChainCacao v0.1 · MIABE Hackathon 2026
        </div>
      </div>

      {/* Cooperative Modal */}
      {showCoopModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 9999,
          }}
          onClick={() => setShowCoopModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: W,
              width: "100%",
              maxWidth: 375,
              borderRadius: "20px 20px 0 0",
              padding: "20px 16px 28px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Coopérative</h3>
              <button onClick={() => setShowCoopModal(false)} style={{ background: "none", border: "none", fontSize: 24, color: "#999", cursor: "pointer", padding: 0 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {COOPERATIVES.map((coop) => (
                <button
                  key={coop.id}
                  onClick={() => { onCoopChange({ name: coop.name }); setShowCoopModal(false); }}
                  style={{
                    padding: "14px 16",
                    background: coop.name === coopName ? GL : "#F8F8F6",
                    border: `2px solid ${coop.name === coopName ? G : "#E8E4DC"}`,
                    borderRadius: 12,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A", marginBottom: 2 }}>{coop.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>Région: {coop.region}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Signup Screen ──────────────────────────────────────────── */
function SignupScreen({ onSignup, onBackToLogin }) {
  const [form, setForm] = useState({ nom: "", prenom: "", phone: "", coop: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { onSignup({ nom: form.nom, prenom: form.prenom, phone: form.phone, coop: form.coop, role: "farmer" }); setLoading(false); }, 1000); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: GBG, padding: 20 }}>
      <div style={{ background: W, padding: 24, borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Ico.Leaf s={40} col={G} /><h2 style={{ margin: "12px 0 4px", color: G }}>Rejoindre ChainCacao</h2><p style={{ margin: 0, color: "#666", fontSize: 13 }}>Crée ton compte agriculteur</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input placeholder="Prénom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input placeholder="Téléphone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input placeholder="Coopérative" value={form.coop} onChange={e => setForm({ ...form, coop: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <input type="password" placeholder="Mot de passe (min 4 caractères)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ padding: 14, borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none" }} required />
          <Btn loading={loading} disabled={loading} style={{ marginTop: 8 }}>{loading ? "Création..." : "✅ Créer mon compte"}</Btn>
        </form>
        <div style={{ textAlign: "center", marginTop: 16, padding: "12px 0", borderTop: "1px solid #eee" }}>
          <span style={{ fontSize: 13, color: "#666" }}>Déjà inscrit ? </span>
          <button onClick={onBackToLogin} style={{ background: "none", border: "none", color: OR, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Se connecter</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Login Screen ───────────────────────────────────────────── */
function LoginScreen({ onLogin, onBack }) {
  const [phone, setPhone] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { if (phone && password.length >= 4) onLogin({ nom: "Mensah", prenom: "Koffi", phone, coop: "COOPAC Kloto", role: "farmer" }); else alert("Identifiants incorrects"); setLoading(false); }, 800); };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EAF3DE 0%, #F0EFEB 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: W, borderRadius: 32, padding: 40, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(44,95,26,0.15)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "#888", cursor: "pointer", marginBottom: 16 }}>← Retour</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}><Ico.Leaf s={56} col={G} /><h2 style={{ color: G, fontSize: 24, margin: "16px 0 8px", fontWeight: 800 }}>Connexion</h2><p style={{ color: "#666", margin: 0 }}>Accédez à votre espace agriculteur</p></div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="tel" placeholder="+228 XX XX XX XX" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} required />
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

/* ─── Welcome Screen ─────────────────────────────────────────── */
function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EAF3DE 0%, #F0EFEB 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: W, borderRadius: 32, padding: 40, maxWidth: 450, width: "100%", boxShadow: "0 20px 60px rgba(44,95,26,0.15)", textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}><Ico.Leaf s={64} col={G} /><h1 style={{ color: G, fontSize: 28, margin: "16px 0 8px", fontWeight: 800 }}>ChainCacao</h1><p style={{ color: "#666", fontSize: 15, margin: 0 }}>Traçabilité blockchain des récoltes</p></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
          <button onClick={() => onLogin()} style={{ padding: "16px 32px", background: G, color: W, border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(44,95,26,0.3)" }}>Se connecter</button>
          <button onClick={onSignup} style={{ padding: "16px 32px", background: W, color: G, border: `2px solid ${G}`, borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>🌱 Créer un compte</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ═══  MAQUETTE 2 — TABLEAU DE BORD COOPÉRATIVE  ═════════════
   ═══════════════════════════════════════════════════════════════ */
function CoopDashboard({ lots, onSelectLot }) {
  const totalWt = lots.reduce((s, l) => s + l.wt, 0);
  const certCount = lots.filter(l => l.certs.length > 0).length;
  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* 3 stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { val: totalWt.toLocaleString("fr-FR"), unit: "kg", label: "Production" },
          { val: lots.length, unit: "", label: "Batches" },
          { val: certCount, unit: "", label: "Certificats" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: "center", padding: "14px 12px" }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 22, color: "#222", lineHeight: 1 }}>
              {s.val}{s.unit && <small style={{ fontSize: 12, fontWeight: 600, color: "#888" }}> {s.unit}</small>}
            </div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".3px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Lot list */}
      <SectionTitle icon={<Ico.Leaf s={20} />} text="Lots récents" />
      {lots.map(lot => {
        const st = STATUS_MAP[lot.status];
        return (
          <div key={lot.id} onClick={() => onSelectLot(lot)} style={{
            background: W, borderRadius: 14, padding: "14px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "transform .15s",
          }} onMouseDown={e => e.currentTarget.style.transform = "scale(.98)"} onMouseUp={e => e.currentTarget.style.transform = ""} onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {lot.prod === "Cacao" ? "🍫" : "☕"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13 }}>{lot.id}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2, display: "flex", gap: 6 }}>
                <span>{lot.prod} — {lot.sp}</span><span>{lot.wt} kg</span>
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", letterSpacing: ".3px", textTransform: "uppercase", background: st.bg, color: st.color }}>
              {st.label}
            </span>
          </div>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ═══  MAQUETTE 3 — DÉTAIL LOT  ══════════════════════════════
   ═══════════════════════════════════════════════════════════════ */
function LotDetail({ lot, onBack, onCert }) {
  const st = STATUS_MAP[lot.status];
  const currentIdx = STATUS_ORDER.indexOf(lot.status);
  return (
    <div style={{ padding: "0 14px" }}>
      {/* Header */}
      <div style={{ padding: "16px 0 8px" }}>
        <div style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: 24, color: "#222", lineHeight: 1.1 }}>{lot.id}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{lot.prod} — {lot.sp}</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", letterSpacing: ".3px", textTransform: "uppercase", background: st.bg, color: st.color }}>{st.label}</span>
        </div>
      </div>

      {/* Origine */}
      <div className="card">
        <SectionTitle icon={<Ico.Pin />} text="Origine" />
        <RowField label="Coordonnées GPS" value={<span style={{ fontFamily: "monospace", fontSize: 11 }}>{lot.origin.lat.toFixed(4)}° N, {lot.origin.lng.toFixed(4)}° E</span>} />
        <RowField label="Village" value={lot.origin.vil} />
        <RowField label="Région" value={lot.origin.reg} />
        <RowField label="Agriculteur" value={lot.farmer} />
        <RowField label="Date de récolte" value={new Date(lot.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} />
      </div>

      {/* Caractéristiques */}
      <div className="card">
        <SectionTitle icon={<Ico.Scale s={18} />} text="Caractéristiques" />
        <RowField label="Produit" value={lot.prod} />
        <RowField label="Variété" value={lot.sp} />
        <RowField label="Poids déclaré" value={`${lot.wt} kg`} />
        {lot.certs.length > 0 && <RowField label="Certifications" value={lot.certs.join(", ")} />}
      </div>

      {/* Chaîne de custody */}
      <div className="card">
        <SectionTitle icon={<Ico.Route />} text="Chaîne de custody" />
        <div style={{ position: "relative", paddingLeft: 26 }}>
          <div style={{ position: "absolute", left: 8, top: 10, bottom: 10, width: 2, background: "#e0e0e0" }} />
          {TIMELINE_STEPS.map((step, i) => {
            const stepIdx = STATUS_ORDER.indexOf(step.key);
            const done = stepIdx <= currentIdx;
            const now = step.key === lot.status;
            const chainEntry = lot.chain.find((_, ci) => {
              const order = ["ferme", "cooperative", "transformateur", "exportateur"];
              return order[ci] === step.key;
            });
            return (
              <div key={step.key} style={{ position: "relative", paddingBottom: i < TIMELINE_STEPS.length - 1 ? 18 : 0 }}>
                <TlDot done={done} now={now} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{step.label}</div>
                {chainEntry && <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{chainEntry.to} — {chainEntry.loc}</div>}
                {chainEntry && <div style={{ fontSize: 10, color: G, marginTop: 2, fontWeight: 600 }}>{new Date(chainEntry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocs blockchain */}
      <div className="card">
        <SectionTitle icon={<Ico.Cube />} text={`Blocs blockchain (${lot.blocks.length})`} />
        {lot.blocks.map(b => (
          <div key={b.idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: GD, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{b.idx}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.desc}</div>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "#aaa", marginTop: 1 }}>{b.hash}</div>
            </div>
            <div style={{ fontSize: 10, color: "#888", flexShrink: 0 }}>{b.ts}</div>
          </div>
        ))}
      </div>

      {/* QR Code */}
      <div className="card" style={{ textAlign: "center" }}>
        <SectionTitle icon={<Ico.Qr />} text="QR Code" />
        <div style={{ display: "inline-block", padding: 12, background: W, borderRadius: 10, border: "1px solid #e0e0e0" }}>
          <div style={{ width: 130, height: 130, background: "#f5f5f5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#aaa" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 1, background: (Math.sin(i * 7.3) > 0) ? "#222" : "transparent" }} />
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>Scannez pour vérifier la traçabilité</p>
      </div>

      {/* Bouton certificat pour lots exportés */}
      {lot.status === "exportateur" && (
        <button onClick={() => onCert(lot)} style={{ width: "100%", padding: 15, background: G, color: W, border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 15px rgba(44,95,26,.3)", marginBottom: 12 }}>
          <Ico.FileCert s={18} col={W} /> Générer le certificat EUDR
        </button>
      )}
      {lot.status === "exporte" && (
        <button onClick={() => onCert(lot)} style={{ width: "100%", padding: 15, background: "transparent", color: G, border: "2px solid " + G, borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <Ico.FileCert s={18} /> Voir le certificat EUDR
        </button>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ═══  MAQUETTE 4 — CERTIFICAT D'EXPORTATION  ════════════════
   ═══════════════════════════════════════════════════════════════ */
function ExportCertificate({ lot, onBack }) {
  const certBlock = lot.blocks.find(b => b.action === "CERTIFICATION");
  return (
    <div style={{ padding: "16px 14px" }}>
      {/* Success header */}
      <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: GL, margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "3px solid " + G,
        }}>
          <Ico.Check s={36} />
        </div>
        <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: G, margin: 0 }}>Certificat généré</h3>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4, marginBottom: 0 }}>Le lot est conforme au règlement EUDR</p>
      </div>

      {/* Certificate box */}
      <div style={{
        background: W, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden",
        border: "2px solid #C5E1A5",
      }}>
        {/* Double border inner */}
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, bottom: 8, border: "1px solid #C5E1A5", borderRadius: 10, pointerEvents: "none" }} />
        {/* Stamp */}
        <div style={{
          position: "absolute", top: 28, right: 24, width: 68, height: 68,
          border: "3px solid " + G, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: "rotate(-12deg)", fontFamily: "Outfit", fontWeight: 900,
          fontSize: 9, color: G, textAlign: "center", lineHeight: 1.2, opacity: .7,
        }}>CONFORME<br />EUDR</div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 12, borderBottom: "1px dashed #C5E1A5" }}>
          <h4 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 14, color: G, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Ico.Leaf s={20} /> ChainCacao
          </h4>
          <p style={{ fontSize: 10, color: "#888", margin: "2px 0 0" }}>Certificat de traçabilité — Règlement (UE) 2023/1115</p>
        </div>

        {/* Fields */}
        <RowField label="Numéro de lot" value={<span style={{ fontWeight: 800 }}>{lot.id}</span>} />
        <RowField label="Produit" value={`${lot.prod} — ${lot.sp}`} />
        <RowField label="Poids" value={`${lot.wt} kg`} />
        <RowField label="Date récolte" value={new Date(lot.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} />
        <RowField label="Agriculteur" value={lot.farmer} />
        <RowField label="GPS" value={<span style={{ fontFamily: "monospace", fontSize: 10 }}>{lot.origin.lat.toFixed(4)}° N, {lot.origin.lng.toFixed(4)}° E</span>} />
        <RowField label="Village" value={`${lot.origin.vil}, ${lot.origin.reg}`} />
        <RowField label="Coopérative" value={lot.coop || "-"} />
        <RowField label="Exportateur" value={lot.chain[lot.chain.length - 1]?.to || "-"} />

        {/* QR */}
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ display: "inline-block", padding: 12, background: W, borderRadius: 10, border: "1px solid #e0e0e0" }}>
            <div style={{ width: 120, height: 120, background: "#f5f5f5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 1, background: (Math.cos(i * 5.7) > 0) ? "#222" : "transparent" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
          <span style={{ fontSize: 10, color: "#888" }}>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span style={{ fontFamily: "Outfit", fontWeight: 700, fontStyle: "italic", color: G }}>ChainCacao</span>
        </div>

        {/* Blockchain hash */}
        <div style={{ fontSize: 8, fontFamily: "monospace", color: "#888", wordBreak: "break-all", background: GBG, padding: 8, borderRadius: 6, marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <Ico.Pin s={12} /> {certBlock?.hash || "0xA3F28D1C…"}
        </div>
        <div style={{ fontSize: 9, color: "#888", marginTop: 4, textAlign: "center" }}>{lot.blocks.length} blocs sur la chaîne</div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={() => alert("Certificat téléchargé !")} style={{ flex: 1, padding: 15, background: G, color: W, border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Outfit" }}>
          <Ico.Download s={18} col={W} /> Télécharger
        </button>
        <button onClick={() => alert("Certificat partagé !")} style={{ flex: 1, padding: 15, background: "transparent", color: G, border: "2px solid " + G, borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Outfit" }}>
          <Ico.Share s={18} /> Partager
        </button>
      </div>
      <button onClick={onBack} style={{ width: "100%", padding: 15, background: "transparent", color: G, border: "2px solid " + G, borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, fontFamily: "Outfit" }}>
        ← Retour au lot
      </button>
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ═══  VÉRIFICATEUR  ══════════════════════════════════════════
   ═══════════════════════════════════════════════════════════════ */
function VerificateurScreen({ lots, onSelectLot }) {
  const [input, setInput] = useState("");
  const matched = lots.find(l => l.id.toLowerCase() === input.trim().toLowerCase());
  return (
    <div style={{ padding: "16px 14px" }}>
      <div className="card" style={{ borderColor: "#C5E1A5" }}>
        <SectionTitle icon={<Ico.Verif active />} text="Vérifier un lot" />
        <p style={{ fontSize: 12, color: "#888", marginBottom: 14, lineHeight: 1.5 }}>Scannez le QR code ou saisissez l'identifiant du lot</p>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 5 }}>Identifiant du lot</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ex: LOT-TG-2026-04791" style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", textTransform: "uppercase" }} />
        </div>
        <button onClick={() => { if (matched) onSelectLot(matched); else alert("Lot introuvable"); }} disabled={!matched} style={{ width: "100%", padding: 15, background: matched ? G : "#ccc", color: W, border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: matched ? "pointer" : "default", fontFamily: "Outfit" }}>Vérifier</button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontSize: 11, color: "#888" }}>Lots disponibles :</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, justifyContent: "center" }}>
            {lots.map(l => (
              <span key={l.id} onClick={() => { setInput(l.id); onSelectLot(l); }} style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", background: W, border: "1px solid #e0e0e0", borderRadius: 8, cursor: "pointer" }}>{l.id}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ═══  MAIN APP  ═══════════════════════════════════════════════
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ species: null, weight: "", date: new Date().toISOString().slice(0, 10), photo: null, photoURL: null });
  const [syncState, setSyncState] = useState({ status: "idle", hash: null, blockId: null, error: null, queued: false });
  const [offline, setOffline] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('farmer');
  const [selectedLot, setSelectedLot] = useState(null);
  const [certLot, setCertLot] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const gps = useGPS();
  const fileRef = useRef();

  useEffect(() => { if (step === 3 && gps.status === "idle") gps.capture(); }, [step, gps]);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, photo: file, photoURL: URL.createObjectURL(file) }));
  }

  async function handleSubmit() {
    setSyncing(true);
    const record = { ...form, gps: gps.coords, timestamp: Date.now(), farmer: user ? `${user.prenom} ${user.nom}` : "Koffi Mensah", coop: user?.coop || "COOPAC Kloto" };
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

  const canNext = [!!form.species, form.weight && parseFloat(form.weight) > 0, !!form.date, gps.status === "done"];

  // ─── Auth guard ──────────────────────────────────────────────
  if (!user) {
    if (authScreen === 'welcome') return <WelcomeScreen onLogin={() => setAuthScreen('login')} onSignup={() => setAuthScreen('signup')} />;
    if (authScreen === 'login') return <LoginScreen onLogin={(d) => { if (d === 'signup') setAuthScreen('signup'); else setUser(d); }} onBack={() => setAuthScreen('welcome')} />;
    if (authScreen === 'signup') return <SignupScreen onSignup={setUser} onBack={() => setAuthScreen('welcome')} />;
  }

  // ─── Profile Screen ──────────────────────────────────────────
  if (showProfile) {
    return (
      <ProfileScreen 
        user={user} 
        onBack={() => setShowProfile(false)}
        onLogout={() => { setUser(null); setShowProfile(false); }}
        onResetDemo={() => alert("Démo réinitialisée !")}
        onCoopChange={(coop) => setUser({ ...user, coop: coop.name })}
      />
    );
  }

  // ─── Determine header title ─────────────────────────────────
  let headerSub = "Nouvelle récolte";
  let headerTitle = "Enregistrement blockchain";
  let showBack = false;

  if (selectedLot && !certLot) { headerSub = "ChainCacao"; headerTitle = "Détail du lot"; showBack = true; }
  else if (certLot) { headerSub = "ChainCacao"; headerTitle = "Certificat d'exportation"; showBack = true; }
  else if (activeTab === 'cooperative') { headerSub = "COOPAC Kloto"; headerTitle = "Tableau de bord"; }
  else if (activeTab === 'verificateur') { headerSub = "ChainCacao"; headerTitle = "Vérifier un lot"; }
  else if (activeTab === 'exportateur') { headerSub = "ChainCacao"; headerTitle = "Exportation"; }

  // ─── Determine body content ─────────────────────────────────
  let bodyContent = null;

  if (certLot) {
    bodyContent = <ExportCertificate lot={certLot} onBack={() => { setCertLot(null); setSelectedLot(null); }} />;
  } else if (selectedLot) {
    bodyContent = <LotDetail lot={selectedLot} onBack={() => setSelectedLot(null)} onCert={(l) => setCertLot(l)} />;
  } else if (activeTab === 'farmer') {
    // ─── MAQUETTE 1 : Enregistrement blockchain ───────────────
    bodyContent = (
      <div style={{ padding: "16px 14px 0" }}>
        {step < 4 && <Stepper step={step} />}

        {/* STEP 0 — Espèce */}
        {step === 0 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <SectionTitle icon={<Ico.Leaf />} text="Quelle espèce récoltez-vous ?" />
            <div className="card">
              {SPECIES.map(sp => (
                <div key={sp.id} onClick={() => setForm(f => ({ ...f, species: sp }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: form.species?.id === sp.id ? GL : "transparent", border: `1.5px solid ${form.species?.id === sp.id ? G : "transparent"}`, transition: "all .2s" }}>
                  <span style={{ fontSize: 22 }}>{sp.emoji}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: form.species?.id === sp.id ? 700 : 500, fontSize: 14, color: form.species?.id === sp.id ? G : "#222" }}>{sp.label}</div><div style={{ fontSize: 11, color: "#999" }}>Origine : {sp.origin}</div></div>
                  {form.species?.id === sp.id && <Ico.Check s={20} />}
                </div>
              ))}
            </div>
            <Btn disabled={!canNext[0]} onClick={() => setStep(1)}>Suivant →</Btn>
          </div>
        )}

        {/* STEP 1 — Poids */}
        {step === 1 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <SectionTitle icon={<Ico.Scale />} text="Poids de la récolte" />
            <div className="card">
              <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                  <input type="number" min="1" max="9999" placeholder="000" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} style={{ width: 130, fontSize: 52, fontWeight: 800, color: G, border: "none", background: "transparent", textAlign: "right", outline: "none", caretColor: G, fontFamily: "Outfit" }} />
                  <span style={{ fontSize: 24, fontWeight: 600, color: "#666" }}>kg</span>
                </div>
                <div style={{ marginTop: 6, height: 3, background: "#eee", borderRadius: 2 }}>
                  <div style={{ height: "100%", background: G, borderRadius: 2, width: `${Math.min(100, (parseFloat(form.weight) || 0) / 10)}%`, transition: "width .3s" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 6 }}>
                {[15, 100, 200, 500].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, weight: String(n) }))} style={{ padding: "8px 0", borderRadius: 9, border: `1.5px solid ${form.weight === String(n) ? G : "#e0e0e0"}`, background: form.weight === String(n) ? GL : W, color: form.weight === String(n) ? G : "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{n} kg</button>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: "10px 12px", background: "#f8f8f6", borderRadius: 10, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                <span>ℹ</span> Saisissez le poids brut incluant l'emballage.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}><Btn outline onClick={() => setStep(0)} style={{ width: "auto", flex: 0, padding: "15px 20px" }}>← Retour</Btn><Btn disabled={!canNext[1]} onClick={() => setStep(2)}>Suivant →</Btn></div>
          </div>
        )}

        {/* STEP 2 — Date & Photo */}
        {step === 2 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <SectionTitle icon={<Ico.Cal />} text="Date de récolte" />
            <div className="card">
              <input type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%", fontSize: 20, fontWeight: 700, color: G, border: "none", outline: "none", background: "transparent", cursor: "pointer", padding: "6px 0", fontFamily: "'DM Sans',sans-serif" }} />
              <div style={{ height: 1, background: "#eee", margin: "10px 0" }} />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[0, 1, 2, 7].map(d => { const dt = new Date(); dt.setDate(dt.getDate() - d); const iso = dt.toISOString().slice(0, 10); const label = d === 0 ? "Aujourd'hui" : d === 1 ? "Hier" : `Il y a ${d}j`; return (<div key={d} className={`chip ${form.date === iso ? "active" : ""}`} onClick={() => setForm(f => ({ ...f, date: iso }))}>{label}</div>); })}
              </div>
            </div>
            <SectionTitle icon={<Ico.Camera />} text="Photo de la récolte" />
            <div className="card">
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
              {form.photoURL ? (
                <div style={{ position: "relative" }}>
                  <img src={form.photoURL} alt="récolte" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setForm(f => ({ ...f, photo: null, photoURL: null }))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.55)", border: "none", color: W, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>✕ Supprimer</button>
                  <div style={{ marginTop: 8, padding: "7px 10px", background: GL, borderRadius: 8, fontSize: 12, color: G, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Ico.Check s={16} /> Photo capturée</div>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", height: 130, border: `2px dashed ${G}`, borderRadius: 12, background: GL, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                  <Ico.Camera s={32} /><span style={{ fontSize: 14, fontWeight: 600, color: G }}>Prendre une photo</span><span style={{ fontSize: 11, color: "#888" }}>Ou importer depuis la galerie</span>
                </button>
              )}
              <div style={{ marginTop: 10, fontSize: 11, color: "#aaa", textAlign: "center" }}>La photo est optionnelle mais recommandée pour la traçabilité.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}><Btn outline onClick={() => setStep(1)} style={{ width: "auto", flex: 0, padding: "15px 20px" }}>← Retour</Btn><Btn disabled={!canNext[2]} onClick={() => setStep(3)}>Suivant →</Btn></div>
          </div>
        )}

        {/* STEP 3 — Récap + GPS + Submit */}
        {step === 3 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <SectionTitle icon={<Ico.Clipboard />} text="Récapitulatif" />
            <div className="card">
              {[{ l: "Espèce", v: form.species?.label }, { l: "Poids brut", v: `${form.weight} kg` }, { l: "Date", v: new Date(form.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) }, { l: "Producteur", v: user ? `${user.prenom} ${user.nom}` : "Koffi Mensah" }, { l: "Coopérative", v: user?.coop || "COOPAC Kloto" }, { l: "Photo", v: form.photoURL ? "✓ Capturée" : "Non fournie" }].map(({ l, v }) => (
                <RowField key={l} label={l} value={v} />
              ))}
            </div>
            <SectionTitle icon={<Ico.Pin />} text="Localisation GPS" />
            <div className="card">
              {gps.status === "loading" && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", color: "#666", fontSize: 14 }}><Ico.Spinner /> Acquisition du signal GPS…</div>}
              {gps.status === "done" && gps.coords && <>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#2ECC71", flexShrink: 0, animation: "pulse 2s infinite" }} />
                  <div><div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{gps.coords.lat.toFixed(4)}° N, {gps.coords.lng.toFixed(4)}° E</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Région des Plateaux — Kloto • Précision {gps.coords.acc}m</div></div>
                </div>
                <button onClick={gps.capture} style={{ marginTop: 10, background: "none", border: `1px solid ${G}`, color: G, borderRadius: 8, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>↺ Recapturer</button>
              </>}
            </div>
            {offline && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(232,153,10,.1)", border: "1px solid rgba(232,153,10,.35)", marginBottom: 12, fontSize: 12, color: "#8a5e00", display: "flex", gap: 8, alignItems: "flex-start" }}><Ico.Cloud synced={false} /><span>Mode hors-ligne actif. Synchronisation automatique à la reconnexion.</span></div>}
            <div style={{ display: "flex", gap: 10, marginBottom: 4 }}><Btn outline onClick={() => setStep(2)} style={{ width: "auto", flex: 0, padding: "15px 20px" }}>← Retour</Btn><Btn disabled={!canNext[3]} loading={syncing} onClick={handleSubmit}>{offline ? "💾 Enregistrer (offline)" : "Enregistrer sur la blockchain"}</Btn></div>
          </div>
        )}

        {/* STEP 5 — Succès */}
        {step === 5 && (
          <div style={{ animation: "fadeUp .4s ease", textAlign: "center", padding: "20px 0 10px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: syncState.queued ? "rgba(232,153,10,.15)" : GL, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${syncState.queued ? OR : G}` }}>
              {syncState.queued ? <Ico.Cloud synced={false} /> : <Ico.Check s={36} />}
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, color: syncState.queued ? "#7a5500" : G, marginBottom: 6 }}>{syncState.queued ? "Enregistré hors-ligne" : "Blockchain confirmée !"}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 18, lineHeight: 1.6 }}>{syncState.queued ? `Synchronisation automatique au retour du réseau. ${queueCount} récolte(s) en attente.` : "Votre récolte a été inscrite de manière immuable sur la blockchain."}</div>
            {syncState.hash && <div style={{ background: W, borderRadius: 12, padding: "12px 14px", textAlign: "left", marginBottom: 16 }}><RowField label="Hash" value={<span style={{ fontFamily: "monospace", fontSize: 11, color: G, fontWeight: 700 }}>{syncState.hash}</span>} /><RowField label="Block ID" value={<span style={{ fontFamily: "monospace", fontSize: 11, color: "#333" }}>#{syncState.blockId}</span>} /></div>}
            {queueCount > 0 && !syncing && <Btn onClick={drainQueue} style={{ background: OR, marginBottom: 10 }}>↑ Synchroniser {queueCount} récolte(s)</Btn>}
            {syncing && <Btn loading={true} disabled>Synchronisation…</Btn>}
            <Btn outline onClick={reset} style={{ marginTop: 8 }}>+ Nouvelle récolte</Btn>
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    );
  } else if (activeTab === 'cooperative') {
    bodyContent = <CoopDashboard lots={SAMPLE_LOTS} onSelectLot={setSelectedLot} />;
  } else if (activeTab === 'verificateur') {
    bodyContent = <VerificateurScreen lots={SAMPLE_LOTS} onSelectLot={setSelectedLot} />;
  } else if (activeTab === 'exportateur') {
    const exportLots = SAMPLE_LOTS.filter(l => l.status === "exportateur" || l.status === "exporte");
    bodyContent = (
      <div style={{ padding: "16px 14px" }}>
        {exportLots.length === 0
          ? <div style={{ textAlign: "center", padding: 48, color: "#888" }}><div style={{ fontSize: 44, color: "#ddd", marginBottom: 12 }}>📦</div><h4 style={{ fontWeight: 700, fontSize: 15 }}>Aucun lot à certifier</h4></div>
          : exportLots.map(l => {
            const st = STATUS_MAP[l.status];
            return (
              <div key={l.id} className="card" style={{ borderColor: "#C5E1A5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div><div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 14 }}>{l.id}</div><div style={{ fontSize: 12, color: "#888" }}>{l.prod} — {l.sp} — {l.wt} kg</div></div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", letterSpacing: ".3px", textTransform: "uppercase", background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                {l.status === "exportateur"
                  ? <button onClick={() => setCertLot(l)} style={{ width: "100%", padding: 15, background: G, color: W, border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit", boxShadow: "0 4px 15px rgba(44,95,26,.3)" }}><Ico.FileCert s={18} col={W} /> Générer le certificat</button>
                  : <button onClick={() => setCertLot(l)} style={{ width: "100%", padding: 15, background: "transparent", color: G, border: "2px solid " + G, borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit" }}><Ico.FileCert s={18} /> Voir le certificat</button>
                }
              </div>
            );
          })}
        <div style={{ height: 16 }} />
      </div>
    );
  }

  // ─── Bottom nav items ───────────────────────────────────────
  const navItems = [
    { id: "farmer", label: "Agriculteur", icon: <Ico.Farmer active={activeTab === 'farmer' && !selectedLot && !certLot} /> },
    { id: "cooperative", label: "Coopérative", icon: <Ico.Coop active={activeTab === 'cooperative'} /> },
    { plus: true },
    { id: "verificateur", label: "Vérificateur", icon: <Ico.Verif active={activeTab === 'verificateur'} /> },
    { id: "exportateur", label: "Exportateur", icon: <Ico.Export active={activeTab === 'exportateur'} /> },
  ];

  // ─── RETURN ─────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: "#dedad3", padding: "20px 12px", fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,.5)}50%{box-shadow:0 0 0 8px rgba(46,204,113,0)}}
        .card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
        .chip{display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border-radius:10px;border:1.5px solid #e0e0e0;font-size:13px;cursor:pointer;transition:all .2s;background:#fff}
        .chip.active{border-color:${G};background:${GL};color:${G};font-weight:600}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      `}</style>
      <div style={{ width: 375, background: GBG, borderRadius: 38, overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,.28)" }}>
        {/* Status bar */}
        <div style={{ background: GD, padding: "11px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: W, fontWeight: 700, fontSize: 15 }}>9:40</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Ico.Network4G />
            <Ico.Wifi off={offline} />
            <div style={{ width: 22, height: 12, border: `1px solid ${W}`, borderRadius: 3, position: "relative" }}>
              <div style={{ position: "absolute", left: 1, top: 1, right: 1, bottom: 1, background: W, borderRadius: 2 }} />
            </div>
          </div>
        </div>
        {/* Header */}
        <div style={{ background: GD, padding: "8px 18px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginBottom: 2 }}>{headerSub}</div>
            <div style={{ color: W, fontSize: 19, fontWeight: 700 }}>{headerTitle}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {queueCount > 0 && <button onClick={drainQueue} style={{ position: "relative", background: "rgba(232,153,10,.25)", border: "1px solid rgba(232,153,10,.5)", borderRadius: 10, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><Ico.Cloud synced={false} /><span style={{ color: W, fontSize: 11, fontWeight: 700 }}>{queueCount}</span></button>}
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.Bell /></div>
            <div onClick={() => setShowProfile(true)} style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: W, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {user ? `${user.nom?.[0] || ''}${user.prenom?.[0] || ''}`.toUpperCase() : "KM"}
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ background: GBG, padding: "16px 14px 0", minHeight: 520, maxHeight: 520, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {bodyContent}
        </div>
        {/* Bottom nav */}
        <div style={{ background: W, borderTop: "1px solid #ebebeb", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px 18px" }}>
          {navItems.map((item, i) =>
            item.plus
              ? <div key={i} onClick={() => { setActiveTab('farmer'); setSelectedLot(null); setCertLot(null); setStep(0); reset(); }} style={{ width: 48, height: 48, borderRadius: 13, background: G, display: "flex", alignItems: "center", justifyContent: "center", color: W, fontSize: 24, fontWeight: 300, cursor: "pointer", marginTop: -10, boxShadow: "0 4px 14px rgba(44,95,26,.35)" }}>+</div>
              : <div key={i} onClick={() => { setActiveTab(item.id); setSelectedLot(null); setCertLot(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>{item.icon}<span style={{ fontSize: 10, color: activeTab === item.id && !selectedLot && !certLot ? G : "#aaa", fontWeight: activeTab === item.id && !selectedLot && !certLot ? 700 : 400 }}>{item.label}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}