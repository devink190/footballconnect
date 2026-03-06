import { useState, useEffect, useRef } from "react";

const FORMATS = {
  "6v6":   { players: 12, label: "6v6" },
  "7v7":   { players: 14, label: "7v7" },
  "10v10": { players: 20, label: "10v10" },
  "11v11": { players: 22, label: "11v11" },
};

const ADMIN_PASS = "admin123";
const REVOLUT_LINK = "https://revolut.me/devinacyt";
const REVOLUT_TAG = "@devinacyt";

const CANCEL_REASONS = [
  { id: "players", icon: "👥", label: "Not enough players signed up" },
  { id: "pitch",   icon: "🏟️", label: "Difficulty getting the pitch" },
  { id: "weather", icon: "🌧️", label: "Bad weather / pitch unplayable" },
  { id: "other",   icon: "📋", label: "Other reason" },
];

function hoursUntilGame(date, time) {
  if (!date || !time) return 999;
  return (new Date(`${date}T${time}`) - new Date()) / 3600000;
}
function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}
function Sheet({ open, onClose, children, title }) {
  const ref = useRef();
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(4px)" }} onClick={onClose} />
      <div ref={ref} style={{
        position:"relative", background:"#111", borderRadius:"20px 20px 0 0",
        maxHeight:"92vh", overflowY:"auto", padding:"0 0 calc(env(safe-area-inset-bottom) + 16px)",
        animation:"sheetUp 0.3s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"12px 0 0" }}>
          <div style={{ width:40,height:4,background:"#333",borderRadius:2 }} />
        </div>
        {title && (
          <div style={{ padding:"12px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"#fff" }}>{title}</span>
            <button onClick={onClose} style={{ background:"#1a1a1a",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
          </div>
        )}
        <div style={{ padding:"16px 20px" }}>{children}</div>
      </div>
    </div>
  );
}

function FullModal({ open, onClose, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:400,background:"#0a0a0a",
      overflowY:"auto",animation:"fadeSlideIn 0.28s ease",
      paddingBottom:"calc(env(safe-area-inset-bottom) + 80px)"
    }}>
      <div style={{ position:"sticky",top:0,zIndex:10,background:"rgba(10,10,10,0.95)",backdropFilter:"blur(10px)",padding:"calc(env(safe-area-inset-top) + 12px) 20px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #1a1a1a" }}>
        <button onClick={onClose} style={{ background:"#1a1a1a",border:"none",color:"#fff",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>←</button>
      </div>
      <div style={{ padding:"20px" }}>{children}</div>
    </div>
  );
}
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
  @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 80%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { font-size: 16px; }
  body { background: #0a0a0a; color: #f0f0f0; font-family: 'Barlow', sans-serif; overscroll-behavior: none; }
  .app-wrap { max-width: 430px; margin: 0 auto; min-height: 100vh; position: relative; background: #0a0a0a; }
  .topbar { position: sticky; top: 0; z-index: 100; background: rgba(10,10,10,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid #1a1a1a; padding: calc(env(safe-area-inset-top) + 10px) 20px 10px; display: flex; align-items: center; justify-content: space-between; }
  .topbar-logo { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 3px; color: #fff; }
  .topbar-logo span { color: #1cff72; }
  .topbar-credit { display: flex; align-items: center; gap: 6px; background: rgba(28,255,114,0.1); border: 1px solid rgba(28,255,114,0.25); padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; color: #1cff72; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; z-index: 200; background: rgba(10,10,10,0.97); backdrop-filter: blur(16px); border-top: 1px solid #1a1a1a; display: flex; align-items: stretch; padding-bottom: env(safe-area-inset-bottom); }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 0; border: none; background: none; cursor: pointer; gap: 3px; min-height: 56px; }
  .nav-item-icon { font-size: 22px; line-height: 1; }
  .nav-item-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #444; transition: color 0.15s; }
  .nav-item.active .nav-item-label { color: #1cff72; }
  .nav-item.active .nav-item-icon { filter: drop-shadow(0 0 6px rgba(28,255,114,0.6)); }
  .page { padding: 0 0 80px; }
  .mobile-hero { padding: 28px 20px 24px; background: linear-gradient(160deg, #0a0a0a, #0d1f0e, #0a0a0a); position: relative; overflow: hidden; }
  .mobile-hero::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 50% at 50% 0%, rgba(28,255,114,0.1) 0%, transparent 70%); pointer-events:none; }
  .mobile-hero-pill { display:inline-flex; align-items:center; gap:6px; background:rgba(28,255,114,0.08); border:1px solid rgba(28,255,114,0.2); padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#1cff72; margin-bottom:16px; }
  .mobile-hero-dot { width:6px; height:6px; background:#1cff72; border-radius:50%; animation:pulse 2s infinite; }
  .mobile-hero h1 { font-family:'Bebas Neue',sans-serif; font-size:54px; line-height:0.95; letter-spacing:2px; color:#fff; margin-bottom:10px; }
  .mobile-hero h1 span { color:#1cff72; }
  .mobile-hero p { font-size:14px; color:#666; line-height:1.5; }
  .section-label { padding: 20px 20px 12px; display:flex; align-items:center; justify-content:space-between; }
  .section-label-text { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:#fff; }
  .section-label-text span { color:#1cff72; }
  .game-list { display: flex; flex-direction: column; gap: 12px; padding: 0 16px; }
  .game-card { background: #111; border: 1px solid #1e1e1e; border-radius: 16px; overflow: hidden; }
  .game-card:active { transform: scale(0.985); }
  .game-card-head { background: linear-gradient(135deg, #172317, #0e180e); padding: 16px 16px 12px; }
  .game-card-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px; }
  .game-card-title { font-weight:700; font-size:17px; color:#fff; line-height:1.2; }
  .game-card-body { padding: 14px 16px; }
  .status-pill { font-size:10px; font-weight:800; padding:3px 9px; border-radius:20px; text-transform:uppercase; letter-spacing:1px; flex-shrink:0; }
  .s-open { background:rgba(28,255,114,0.12); color:#1cff72; border:1px solid rgba(28,255,114,0.3); }
  .s-full { background:rgba(255,80,80,0.12); color:#ff5050; border:1px solid rgba(255,80,80,0.3); }
  .s-cancelled { background:rgba(255,80,80,0.08); color:#ff5050; border:1px solid rgba(255,80,80,0.2); }
  .fmt-chip { display:inline-block; background:rgba(28,255,114,0.08); border:1px solid rgba(28,255,114,0.2); padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700; color:#1cff72; letter-spacing:1px; }
  .game-info-rows { display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
  .game-info-row { font-size:13px; color:#777; display:flex; align-items:center; gap:6px; }
  .prog-wrap { margin-bottom:12px; }
  .prog-nums { display:flex; justify-content:space-between; font-size:11px; color:#555; margin-bottom:5px; }
  .prog-track { height:4px; background:#1e1e1e; border-radius:2px; overflow:hidden; }
  .prog-bar { height:100%; border-radius:2px; transition:width 0.5s; }
  .prog-green { background:#1cff72; }
  .prog-red { background:#ff5050; }
  .btn { width:100%; padding:14px; border-radius:12px; border:none; cursor:pointer; font-family:'Barlow',sans-serif; font-weight:700; font-size:15px; transition:all 0.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .btn:active { transform:scale(0.97); }
  .btn-green { background:#1cff72; color:#0a0a0a; }
  .btn-green:disabled { background:#1a2a1a; color:#2a4a2a; }
  .btn-outline { background:transparent; color:#888; border:1px solid #2a2a2a; }
  .btn-red-outline { background:rgba(255,80,80,0.08); color:#ff5050; border:1px solid rgba(255,80,80,0.3); }
  .btn-red-solid { background:#ff5050; color:#fff; border:none; }
  .btn-revolut { background:linear-gradient(135deg,#191cff,#5b5fff); color:#fff; border:none; box-shadow:0 4px 20px rgba(91,95,255,0.4); }
  .btn-credit-full { background:linear-gradient(135deg,#0f2a1a,#1a4a2a); color:#1cff72; border:1px solid rgba(28,255,114,0.3); }
  .btn-sm { padding:9px 16px; width:auto; font-size:13px; border-radius:8px; }
  .form-group { margin-bottom:16px; }
  .form-label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#555; margin-bottom:7px; }
  .form-input { width:100%; padding:14px; background:#181818; border:1px solid #252525; border-radius:12px; color:#fff; font-family:'Barlow',sans-serif; font-size:16px; outline:none; transition:border-color 0.2s; -webkit-appearance:none; }
  .form-input:focus { border-color:#1cff72; }
  .form-select { width:100%; padding:14px; background:#181818; border:1px solid #252525; border-radius:12px; color:#fff; font-family:'Barlow',sans-serif; font-size:16px; outline:none; -webkit-appearance:none; }
  .euro-input-wrap { position:relative; }
  .euro-sym { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#1cff72; font-weight:700; pointer-events:none; font-size:16px; }
  .euro-input-wrap .form-input { padding-left:28px; }
  .notice { border-radius:12px; padding:14px; font-size:13px; line-height:1.6; margin-bottom:16px; }
  .notice strong { display:block; font-size:13px; margin-bottom:3px; }
  .notice-orange { background:rgba(255,140,0,0.07); border:1px solid rgba(255,140,0,0.2); color:#ffa040; }
  .notice-green { background:rgba(28,255,114,0.07); border:1px solid rgba(28,255,114,0.2); color:#1cff72; }
  .notice-red { background:rgba(255,80,80,0.07); border:1px solid rgba(255,80,80,0.2); color:#ff7070; }
  .steps-row { display:flex; align-items:center; margin-bottom:24px; }
  .step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
  .step-dot.on { background:#1cff72; color:#0a0a0a; box-shadow:0 0 0 3px rgba(28,255,114,0.2); }
  .step-dot.off { background:#181818; color:#444; border:1px solid #252525; }
  .step-text { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
  .step-text.on { color:#fff; }
  .step-text.off { color:#333; }
  .step-line { flex:1; height:1px; background:#1e1e1e; margin:0 8px; }
  .revolut-card { background:linear-gradient(160deg,#191c2a,#0d0f1a); border-radius:20px; padding:24px; margin-bottom:20px; text-align:center; border:1px solid #1a1d2a; }
  .revolut-logo-row { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:20px; }
  .revolut-icon { width:38px; height:38px; background:#191c2a; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; border:1px solid #2a2d3a; }
  .revolut-wordmark { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:3px; color:#fff; }
  .revolut-amount { font-family:'Bebas Neue',sans-serif; font-size:56px; color:#fff; line-height:1; }
  .revolut-sub { font-size:12px; color:#444; margin-bottom:4px; }
  .revolut-credit-tag { display:inline-block; background:rgba(28,255,114,0.1); border-radius:6px; padding:3px 10px; font-size:12px; color:#1cff72; font-weight:700; margin-bottom:16px; }
  .revolut-recipient { background:rgba(0,0,0,0.3); border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px; text-align:left; margin-top:4px; }
  .revolut-avatar { width:38px; height:38px; background:linear-gradient(135deg,#1cff72,#00b4d8); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:15px; color:#0a0a0a; flex-shrink:0; }
  .revolut-name { font-weight:700; font-size:14px; color:#fff; }
  .revolut-handle { font-size:12px; color:#555; }
  .info-box { background:#0d0d0d; border:1px solid #1a1a1a; border-radius:12px; padding:14px; margin-bottom:16px; }
  .info-row { display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:6px; }
  .info-row:last-child { margin-bottom:0; }
  .info-row span:last-child { color:#ccc; font-weight:600; }
  .info-row.green span:last-child { color:#1cff72; }
  .success-wrap { text-align:center; padding:20px 0; }
  .success-emoji { font-size:64px; animation:popIn 0.4s ease; margin-bottom:16px; }
  .success-title { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:2px; color:#1cff72; margin-bottom:8px; }
  .success-sub { font-size:14px; color:#666; line-height:1.6; margin-bottom:24px; }
  .ticket { background:#0d0d0d; border:1px solid rgba(28,255,114,0.2); border-radius:16px; padding:20px; text-align:left; margin-bottom:20px; }
  .ticket-row { display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:8px; }
  .ticket-row:last-child { margin-bottom:0; }
  .ticket-row span:last-child { color:#fff; font-weight:600; }
  .ticket-hr { border:none; border-top:1px dashed #1e1e1e; margin:10px 0; }
  .ticket-paid { font-size:13px; color:#1cff72; font-weight:700; text-align:center; margin-top:10px; }
  .wallet-card { margin:0 16px 16px; background:linear-gradient(135deg,#0f2a1a,#0a1f10); border:1px solid rgba(28,255,114,0.3); border-radius:16px; padding:18px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .wallet-left { display:flex; align-items:center; gap:12px; }
  .wallet-emoji { font-size:28px; }
  .wallet-label { font-size:10px; color:#555; text-transform:uppercase; letter-spacing:2px; margin-bottom:3px; }
  .wallet-amount { font-family:'Bebas Neue',sans-serif; font-size:34px; color:#1cff72; line-height:1; }
  .wallet-expiry { font-size:11px; color:#3a5a3a; margin-top:2px; }
  .wallet-badge { background:rgba(28,255,114,0.08); border:1px solid rgba(28,255,114,0.15); border-radius:8px; padding:6px 10px; font-size:11px; color:#1cff72; font-weight:700; letter-spacing:1px; white-space:nowrap; }
  .booked-status { padding:10px 14px; background:rgba(28,255,114,0.07); border-radius:10px; border:1px solid rgba(28,255,114,0.15); font-size:13px; color:#1cff72; font-weight:700; margin-bottom:8px; }
  .cancelled-status { padding:10px 14px; background:rgba(255,80,80,0.07); border-radius:10px; border:1px solid rgba(255,80,80,0.15); font-size:13px; color:#ff7070; margin-bottom:8px; line-height:1.5; }
  .admin-page { padding:0 16px 80px; }
  .admin-header { padding:16px 0 20px; display:flex; align-items:center; gap:12px; }
  .admin-title { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:2px; }
  .admin-badge { background:#1cff72; color:#0a0a0a; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; }
  .stats-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
  .stat-tile { background:#111; border:1px solid #1e1e1e; border-radius:14px; padding:16px; }
  .stat-tile-label { font-size:11px; color:#444; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:6px; }
  .stat-tile-val { font-family:'Bebas Neue',sans-serif; font-size:34px; color:#1cff72; line-height:1; }
  .stat-tile-sub { font-size:11px; color:#333; margin-top:3px; }
  .admin-game-card { background:#111; border:1px solid #1e1e1e; border-radius:14px; padding:16px; margin-bottom:10px; }
  .admin-game-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:8px; gap:8px; }
  .admin-game-name { font-weight:700; font-size:16px; color:#fff; }
  .admin-game-meta { font-size:12px; color:#444; margin-bottom:12px; line-height:1.6; }
  .admin-game-stats { display:flex; gap:16px; margin-bottom:12px; }
  .admin-stat { text-align:center; }
  .admin-stat-val { font-family:'Bebas Neue',sans-serif; font-size:24px; color:#1cff72; }
  .admin-stat-label { font-size:10px; color:#444; text-transform:uppercase; letter-spacing:1px; }
  .admin-btns { display:flex; gap:8px; }
  .player-row { background:#0d0d0d; border:1px solid #1a1a1a; border-radius:10px; padding:12px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; }
  .player-name { font-weight:700; font-size:14px; }
  .player-email { font-size:12px; color:#555; }
  .player-tag { font-size:11px; font-weight:700; padding:2px 8px; border-radius:20px; }
  .tag-credit { color:#1cff72; background:rgba(28,255,114,0.1); }
  .tag-cancelled { color:#ff5050; background:rgba(255,80,80,0.1); }
  .reason-btn { width:100%; padding:14px 16px; margin-bottom:10px; background:#181818; border:1px solid #252525; border-radius:12px; cursor:pointer; font-family:'Barlow',sans-serif; font-size:14px; font-weight:600; color:#888; text-align:left; display:flex; align-items:center; gap:12px; transition:all 0.15s; }
  .reason-btn:active { transform:scale(0.98); }
  .reason-btn.sel { border-color:#ff5050; color:#ff5050; background:rgba(255,80,80,0.07); }
  .profit-box { background:#0d1a0d; border:1px solid rgba(28,255,114,0.2); border-radius:12px; padding:14px; margin:8px 0 16px; }
  .profit-title { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3a5a3a; margin-bottom:10px; }
  .profit-row { display:flex; justify-content:space-between; font-size:13px; color:#555; margin-bottom:5px; }
  .profit-row.total { border-top:1px solid #1e1e1e; padding-top:10px; margin-top:4px; font-weight:700; font-size:15px; color:#fff; }
  .empty { text-align:center; padding:60px 20px; }
  .empty-emoji { font-size:48px; margin-bottom:14px; }
  .empty-title { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:2px; color:#222; margin-bottom:6px; }
  .empty-sub { font-size:14px; color:#333; }
  .fab { position:fixed; bottom:calc(env(safe-area-inset-bottom) + 70px); right:20px; z-index:150; background:#1cff72; color:#0a0a0a; border:none; border-radius:50px; padding:14px 22px; font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; cursor:pointer; box-shadow:0 4px 20px rgba(28,255,114,0.4); }
  .fab:active { transform:scale(0.95); }
  .toast { position:fixed; bottom:calc(env(safe-area-inset-bottom) + 80px); left:50%; transform:translateX(-50%); z-index:500; background:#1cff72; color:#0a0a0a; padding:12px 24px; border-radius:10px; font-weight:700; font-size:14px; white-space:nowrap; box-shadow:0 4px 20px rgba(28,255,114,0.4); animation:popIn 0.3s ease; }
  .login-page { padding:60px 20px 80px; }
  .login-icon { font-size:48px; margin-bottom:20px; }
  .login-title { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:2px; margin-bottom:4px; }
  .login-sub { font-size:14px; color:#555; margin-bottom:32px; }
  .cancel-game-head { text-align:center; padding:8px 0 20px; }
  .cancel-game-emoji { font-size:44px; margin-bottom:12px; }
  .cancel-game-title { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; color:#ff5050; margin-bottom:4px; }
  .cancel-game-sub { font-size:13px; color:#555; }
`;

function RevolutScreen({ game, playerName, credit, onPaid, onBack }) {
  const creditUsed = Math.min(credit, game.pricePerPlayer);
  const amountDue = Math.max(0, game.pricePerPlayer - creditUsed);
  const fullCredit = amountDue === 0;
  return (
    <div>
      <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, color:"#fff", marginBottom:20 }}>PAY <span style={{ color:"#1cff72" }}>REVOLUT</span></p>
      <div className="revolut-card">
        <div className="revolut-logo-row"><div className="revolut-icon">🔵</div><div className="revolut-wordmark">Revolut</div></div>
        <div className="revolut-amount">€{amountDue.toFixed(2)}</div>
        <div className="revolut-sub">Spot fee · no refunds if you don't show</div>
        {creditUsed > 0 && <div className="revolut-credit-tag">🎟️ €{creditUsed.toFixed(2)} credit applied</div>}
        {!fullCredit && (<div className="revolut-recipient"><div className="revolut-avatar">D</div><div><div className="revolut-name">Football Connect</div><div className="revolut-handle">{REVOLUT_TAG}</div></div></div>)}
      </div>
      <div className="info-box">
        <div className="info-row"><span>Game</span><span>{game.title}</span></div>
        <div className="info-row"><span>📍</span><span>{game.location}</span></div>
        <div className="info-row"><span>📅</span><span>{game.date} at {game.time}</span></div>
        <div className="info-row"><span>Player</span><span>{playerName}</span></div>
        {creditUsed > 0 && <div className="info-row green"><span>🎟️ Credit used</span><span>−€{creditUsed.toFixed(2)}</span></div>}
        <div className="info-row"><span>Total due</span><span>€{amountDue.toFixed(2)}</span></div>
      </div>
      <div className="notice notice-orange"><strong>⚠️ Cancellation Policy</strong>Cancel 6+ hrs before → full credit (30 days). Under 6 hrs → no refund.</div>
      {fullCredit ? (
        <button className="btn btn-credit-full" style={{ marginBottom:12 }} onClick={() => onPaid(creditUsed)}>🎟️ Confirm with Full Credit — €0 due</button>
      ) : (
        <a href={REVOLUT_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block", marginBottom:12 }}>
          <button className="btn btn-revolut" onClick={() => onPaid(creditUsed)}>Pay €{amountDue.toFixed(2)} via Revolut</button>
        </a>
      )}
      <button className="btn btn-outline" onClick={onBack}>← Back</button>
    </div>
  );
}

function BookingFlow({ game, credit, onClose, onConfirm }) {
  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({ name:"", email:"" });
  const valid = details.name.trim() && /\S+@\S+\.\S+/.test(details.email);
  const creditUsed = Math.min(credit, game.pricePerPlayer);
  const amountDue = Math.max(0, game.pricePerPlayer - credit);
  const handlePaid = (cu) => { onConfirm(details, cu); setStep("success"); };
  return (
    <FullModal open onClose={step === "success" ? onClose : (step === "pay" ? () => setStep("details") : onClose)}>
      {step === "success" && (
        <div className="success-wrap">
          <div className="success-emoji">🎉</div>
          <div className="success-title">You're Booked!</div>
          <div className="success-sub">Spot confirmed. See the cancellation policy in My Games.</div>
          <div className="ticket">
            <div className="ticket-row"><span>Game</span><span>{game.title}</span></div>
            <div className="ticket-row"><span>Location</span><span>{game.location}</span></div>
            <div className="ticket-row"><span>Date</span><span>{game.date} at {game.time}</span></div>
            <div className="ticket-row"><span>Format</span><span>{game.format}</span></div>
            <hr className="ticket-hr" />
            <div className="ticket-row"><span>Name</span><span>{details.name}</span></div>
            <div className="ticket-row"><span>Email</span><span>{details.email}</span></div>
            {creditUsed > 0 && <div className="ticket-row"><span>🎟️ Credit used</span><span>€{creditUsed.toFixed(2)}</span></div>}
            <div className="ticket-paid">✓ Spot secured via Revolut</div>
          </div>
          <button className="btn btn-green" onClick={onClose}>Done</button>
        </div>
      )}
      {step === "details" && (
        <div>
          <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, color:"#fff", marginBottom:4 }}>BOOK <span style={{ color:"#1cff72" }}>SPOT</span></p>
          <p style={{ fontSize:13, color:"#555", marginBottom:20 }}>{game.title} · {game.date} at {game.time}</p>
          <div className="steps-row">
            <div className="step-dot on">1</div><span className="step-text on" style={{ marginLeft:8 }}>Your Info</span>
            <div className="step-line" />
            <div className="step-dot off">2</div><span className="step-text off" style={{ marginLeft:8 }}>Payment</span>
          </div>
          {credit > 0 && (<div className="notice notice-green" style={{ marginBottom:16 }}>🎟️ <strong style={{ display:"inline" }}>€{creditUsed.toFixed(2)} credit</strong> will be applied — {amountDue === 0 ? "fully covered!" : `€${amountDue.toFixed(2)} due via Revolut`}</div>)}
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="John Smith" value={details.name} onChange={e => setDetails(p => ({ ...p, name:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="john@email.com" value={details.email} onChange={e => setDetails(p => ({ ...p, email:e.target.value }))} /></div>
          <div className="notice notice-orange"><strong>⚠️ No Refund Policy</strong>Cancel 6+ hrs before → credit. Under 6 hrs → no refund, spot released.</div>
          <button className="btn btn-green" disabled={!valid} onClick={() => setStep("pay")} style={{ marginBottom:10 }}>Next — {amountDue === 0 ? "Use Credit" : `Pay €${amountDue.toFixed(2)}`} →</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      )}
      {step === "pay" && (<RevolutScreen game={game} playerName={details.name} credit={credit} onPaid={handlePaid} onBack={() => setStep("details")} />)}
    </FullModal>
  );
}

function CantMakeItSheet({ game, open, onClose, onConfirm }) {
  const hours = hoursUntilGame(game?.date, game?.time);
  const getsCredit = hours >= 6;
  if (!game) return null;
  return (
    <Sheet open={open} onClose={onClose} title="Can't Make It?">
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:40, marginBottom:12 }}>{getsCredit ? "🎟️" : "😔"}</div>
        <p style={{ fontSize:14, color:"#666", lineHeight:1.6 }}><strong style={{ color:"#fff" }}>{game.title}</strong><br />{game.date} at {game.time}</p>
      </div>
      <div className={`notice ${getsCredit ? "notice-green" : "notice-red"}`} style={{ marginBottom:16 }}>
        {getsCredit ? (<><strong>✅ You'll get full credit!</strong>Cancelling {Math.floor(hours)}h before kick-off → €{game.pricePerPlayer} credit added (valid 30 days). Spot reopened for others.</>) : (<><strong>⚠️ Under 6 hours — no refund</strong>Your €{game.pricePerPlayer} payment is not refunded. Spot will be reopened.</>)}
      </div>
      <button className={`btn ${getsCredit ? "btn-credit-full" : "btn-red-outline"}`} style={{ marginBottom:10 }} onClick={() => onConfirm(getsCredit)}>{getsCredit ? `Yes, cancel & get €${game.pricePerPlayer} credit` : "Yes, cancel — release my spot"}</button>
      <button className="btn btn-green" onClick={onClose}>⚽ Actually, I'll be there!</button>
    </Sheet>
  );
}

function CancelGameSheet({ game, open, onClose, onConfirm }) {
  const [reason, setReason] = useState(null);
  if (!game) return null;
  const bookedCount = (game.bookings || []).filter(b => !b.cancelled).length;
  return (
    <Sheet open={open} onClose={() => { setReason(null); onClose(); }}>
      <div className="cancel-game-head"><div className="cancel-game-emoji">🚫</div><div className="cancel-game-title">Cancel Game</div><div className="cancel-game-sub">{game.title} · {game.date} at {game.time}</div></div>
      <div className="form-label" style={{ marginBottom:10 }}>Why are you cancelling?</div>
      {CANCEL_REASONS.map(r => (<button key={r.id} className={`reason-btn ${reason === r.id ? "sel" : ""}`} onClick={() => setReason(r.id)}><span style={{ fontSize:20 }}>{r.icon}</span><span>{r.label}</span></button>))}
      {bookedCount > 0 && (<div className="notice notice-green" style={{ marginTop:4 }}><strong>🎟️ All {bookedCount} player{bookedCount > 1 ? "s" : ""} get full credit</strong>Each receives €{game.pricePerPlayer} credit valid 30 days.</div>)}
      <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:10 }}>
        <button className="btn btn-red-solid" disabled={!reason} onClick={() => { onConfirm(reason); setReason(null); }}>🚫 Cancel This Game</button>
        <button className="btn btn-outline" onClick={() => { setReason(null); onClose(); }}>Keep Game Active</button>
      </div>
    </Sheet>
  );
}

function CreateGameSheet({ open, onClose, onCreate }) {
  const [g, setG] = useState({ title:"", location:"", date:"", time:"", format:"7v7", pricePerPlayer:"", pitchCost:"" });
  const pp = FORMATS[g.format]?.players || 0;
  const rev = pp * (parseFloat(g.pricePerPlayer) || 0);
  const pc = parseFloat(g.pitchCost) || 0;
  const canCreate = g.title && g.location && g.date && g.time && g.pricePerPlayer && g.pitchCost;
  return (
    <Sheet open={open} onClose={onClose} title="Create Game">
      <div className="form-group"><label className="form-label">Game Title</label><input className="form-input" placeholder="e.g. Saturday Kickabout" value={g.title} onChange={e => setG(p => ({ ...p, title:e.target.value }))} /></div>
      <div className="form-group"><label className="form-label">Location</label><input className="form-input" placeholder="Pitch name & area" value={g.location} onChange={e => setG(p => ({ ...p, location:e.target.value }))} /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={g.date} onChange={e => setG(p => ({ ...p, date:e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Time</label><input className="form-input" type="time" value={g.time} onChange={e => setG(p => ({ ...p, time:e.target.value }))} /></div>
      </div>
      <div className="form-group"><label className="form-label">Format</label><select className="form-select" value={g.format} onChange={e => setG(p => ({ ...p, format:e.target.value }))}>{Object.keys(FORMATS).map(f => <option key={f} value={f}>{FORMATS[f].label} — {FORMATS[f].players} players</option>)}</select></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div className="form-group"><label className="form-label">Price / Player (€)</label><div className="euro-input-wrap"><span className="euro-sym">€</span><input className="form-input" type="number" min="1" placeholder="8" value={g.pricePerPlayer} onChange={e => setG(p => ({ ...p, pricePerPlayer:e.target.value }))} /></div></div>
        <div className="form-group"><label className="form-label">Pitch Cost (€)</label><div className="euro-input-wrap"><span className="euro-sym">€</span><input className="form-input" type="number" min="1" placeholder="62" value={g.pitchCost} onChange={e => setG(p => ({ ...p, pitchCost:e.target.value }))} /></div></div>
      </div>
      {(g.pricePerPlayer || g.pitchCost) && (<div className="profit-box"><div className="profit-title">💰 Profit Preview — When Full</div><div className="profit-row"><span>{pp} players × €{g.pricePerPlayer || 0}</span><span>€{rev.toFixed(0)}</span></div><div className="profit-row"><span>Pitch cost</span><span>−€{pc.toFixed(0)}</span></div><div className="profit-row total"><span>Your profit</span><span style={{ color:(rev-pc)>=0?"#1cff72":"#ff5050" }}>€{(rev-pc).toFixed(0)}</span></div></div>)}
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button className="btn btn-outline" onClick={onClose} style={{ flex:1 }}>Cancel</button>
        <button className="btn btn-green" disabled={!canCreate} style={{ flex:2 }} onClick={() => { onCreate(g); onClose(); setG({ title:"", location:"", date:"", time:"", format:"7v7", pricePerPlayer:"", pitchCost:"" }); }}>Create Game ⚽</button>
      </div>
    </Sheet>
  );
}

export default function App() {
  const [tab, setTab] = useState("browse");
  const [games, setGames] = useState([]);
  const [myBookings, setMyBookings] = useState({});
  const [credit, setCredit] = useState({ amount:0, expiry:null });
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [expandedGame, setExpandedGame] = useState(null);
  const [toast, setToast] = useState("");
  const [bookingGame, setBookingGame] = useState(null);
  const [cantMakeGame, setCantMakeGame] = useState(null);
  const [cancelGameTarget, setCancelGameTarget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [secretTaps, setSecretTaps] = useState(0);
  const secretTimer = useRef(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };
  const validCredit = credit.amount > 0 && credit.expiry && new Date(credit.expiry) > new Date() ? credit.amount : 0;

  const handleLogoTap = () => {
    const next = secretTaps + 1;
    setSecretTaps(next);
    clearTimeout(secretTimer.current);
    if (next >= 5) { setSecretTaps(0); setTab("admin"); showToast("🔐 Admin access unlocked"); }
    else { secretTimer.current = setTimeout(() => setSecretTaps(0), 2000); }
  };

  const handleConfirmBooking = (game, details, creditUsed) => {
    const bid = Date.now();
    setGames(prev => prev.map(g => {
      if (g.id !== game.id) return g;
      const max = FORMATS[g.format].players;
      const nj = Math.min(g.joined + 1, max);
      return { ...g, joined:nj, status: nj >= max ? "full" : "open", bookings:[...(g.bookings||[]), { ...details, paid:game.pricePerPlayer, id:bid, cancelled:false, creditUsed:creditUsed||0 }] };
    }));
    setMyBookings(prev => ({ ...prev, [game.id]: bid }));
    if (creditUsed > 0) {
      setCredit(prev => ({ ...prev, amount: Math.max(0, prev.amount - creditUsed) }));
      showToast(creditUsed >= game.pricePerPlayer ? "🎟️ Booked using full credit!" : `🎟️ €${creditUsed.toFixed(2)} credit applied!`);
    } else { showToast("✅ Spot booked!"); }
    setBookingGame(null);
  };

  const handleCantMakeIt = (getsCredit) => {
    const { gameId, bookingId, pricePerPlayer } = cantMakeGame;
    setGames(prev => prev.map(g => {
      if (g.id !== gameId) return g;
      const nj = Math.max(0, g.joined - 1);
      return { ...g, joined:nj, status: nj < FORMATS[g.format].players ? "open" : "full", bookings:(g.bookings||[]).map(b => b.id === bookingId ? { ...b, cancelled:true, gotCredit:getsCredit } : b) };
    }));
    setMyBookings(prev => { const n = { ...prev }; delete n[gameId]; return n; });
    if (getsCredit) { setCredit({ amount:(credit.amount||0) + pricePerPlayer, expiry:addDays(30) }); showToast(`🎟️ €${pricePerPlayer} credit added! Valid 30 days`); }
    else { showToast("😔 Spot released — no refund under 6 hrs"); }
    setCantMakeGame(null);
  };

  const handleCreateGame = data => {
    setGames(prev => [...prev, { id:Date.now(), ...data, pricePerPlayer:parseFloat(data.pricePerPlayer), pitchCost:parseFloat(data.pitchCost), joined:0, status:"open", bookings:[] }]);
    showToast("✅ Game created!");
  };

  const handleDeleteGame = id => { setGames(prev => prev.filter(g => g.id !== id)); showToast("🗑️ Removed"); };

  const handleCancelGame = reason => {
    const game = cancelGameTarget;
    const bookedCount = (game.bookings||[]).filter(b => !b.cancelled).length;
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, status:"cancelled", cancelReason:reason, bookings:(g.bookings||[]).map(b => !b.cancelled ? { ...b, gotCredit:true, cancelledByOwner:true } : b) } : g));
    if (myBookings[game.id] && bookedCount > 0) setCredit({ amount:(credit.amount||0) + game.pricePerPlayer, expiry:addDays(30) });
    setMyBookings(prev => { const n = { ...prev }; delete n[game.id]; return n; });
    setCancelGameTarget(null);
    showToast(`🚫 Cancelled — ${bookedCount > 0 ? `credit issued to ${bookedCount} player${bookedCount>1?"s":""}` : "no players affected"}`);
  };

  const totalRevenue = games.reduce((s,g) => s + (g.bookings||[]).filter(b=>!b.cancelled).length * g.pricePerPlayer, 0);
  const totalProfit = games.reduce((s,g) => s + Math.max(0, (g.bookings||[]).filter(b=>!b.cancelled).length * g.pricePerPlayer - g.pitchCost), 0);
  const totalPlayers = games.reduce((s,g) => s + g.joined, 0);
  const myBookedGames = games.filter(g => myBookings[g.id]);

  return (
    <>
      <style>{css}</style>
      <div className="app-wrap">
        <div className="topbar">
          <div className="topbar-logo" onClick={handleLogoTap} style={{ cursor:"default", userSelect:"none" }}>
            FC <span>CONNECT</span>
            {secretTaps > 0 && secretTaps < 5 && (<span style={{ marginLeft:8, fontSize:10, color:"rgba(28,255,114,0.4)", fontFamily:"Barlow,sans-serif", letterSpacing:1 }}>{"●".repeat(secretTaps)}{"○".repeat(5-secretTaps)}</span>)}
          </div>
          {validCredit > 0 && <div className="topbar-credit"><span>🎟️</span><span>€{validCredit.toFixed(2)}</span></div>}
        </div>

        {tab === "browse" && (
          <div className="page">
            <div className="mobile-hero">
              <div className="mobile-hero-pill"><div className="mobile-hero-dot" />Live in Ireland</div>
              <h1>PLAY<br /><span>LOCAL.</span></h1>
              <p>Find a game, pay via Revolut, show up & play.</p>
            </div>
            {validCredit > 0 && (<div className="wallet-card"><div className="wallet-left"><div className="wallet-emoji">🎟️</div><div><div className="wallet-label">Your Credit</div><div className="wallet-amount">€{validCredit.toFixed(2)}</div><div className="wallet-expiry">Expires {credit.expiry}</div></div></div><div className="wallet-badge">Auto-applied</div></div>)}
            <div className="section-label"><span className="section-label-text">UPCOMING <span>GAMES</span></span></div>
            {games.filter(g => g.status !== "cancelled").length === 0 ? (
              <div className="empty"><div className="empty-emoji">🏟️</div><div className="empty-title">No Games Yet</div><div className="empty-sub">Check back soon — games will appear here.</div></div>
            ) : (
              <div className="game-list">
                {games.filter(g => g.status !== "cancelled").map(game => {
                  const fmt = FORMATS[game.format];
                  const pct = Math.round((game.joined / fmt.players) * 100);
                  const isBooked = !!myBookings[game.id];
                  const cu = Math.min(validCredit, game.pricePerPlayer);
                  const due = Math.max(0, game.pricePerPlayer - cu);
                  return (
                    <div key={game.id} className="game-card">
                      <div className="game-card-head">
                        <div className="game-card-row"><div className="game-card-title">{game.title}</div><div className={`status-pill ${game.status === "full" ? "s-full" : "s-open"}`}>{game.status}</div></div>
                        <span className="fmt-chip">{fmt.label}</span>
                      </div>
                      <div className="game-card-body">
                        <div className="game-info-rows">
                          <div className="game-info-row">📍 {game.location}</div>
                          <div className="game-info-row">📅 {game.date} at {game.time}</div>
                          <div className="game-info-row">👥 {fmt.players} players needed</div>
                        </div>
                        <div className="prog-wrap">
                          <div className="prog-nums"><span>{game.joined}/{fmt.players} booked</span><span>{pct}%</span></div>
                          <div className="prog-track"><div className={`prog-bar ${game.status === "full" ? "prog-red" : "prog-green"}`} style={{ width:`${pct}%` }} /></div>
                        </div>
                        <button className={`btn ${isBooked ? "btn-outline" : game.status === "full" ? "btn-outline" : "btn-green"}`} style={isBooked ? { color:"#1cff72", borderColor:"rgba(28,255,114,0.4)" } : {}} disabled={isBooked || game.status === "full"} onClick={() => !isBooked && game.status === "open" && setBookingGame(game)}>
                          {isBooked ? "✓ Booked & Paid" : game.status === "full" ? "Game Full" : validCredit > 0 ? `Book — €${due.toFixed(2)}${cu > 0 ? " + 🎟️" : ""}` : `Book Now — €${game.pricePerPlayer}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "mygames" && (
          <div className="page">
            <div className="section-label"><span className="section-label-text">MY <span>GAMES</span></span></div>
            {validCredit > 0 && (<div className="wallet-card"><div className="wallet-left"><div className="wallet-emoji">🎟️</div><div><div className="wallet-label">Credit Balance</div><div className="wallet-amount">€{validCredit.toFixed(2)}</div><div className="wallet-expiry">Expires {credit.expiry}</div></div></div><div className="wallet-badge">Use on next booking</div></div>)}
            {myBookedGames.length === 0 ? (
              <div className="empty"><div className="empty-emoji">👟</div><div className="empty-title">No Bookings Yet</div><div className="empty-sub">Browse games and lock in your spot!</div></div>
            ) : (
              <div className="game-list">
                {myBookedGames.map(game => {
                  const hours = hoursUntilGame(game.date, game.time);
                  const isCancelled = game.status === "cancelled";
                  return (
                    <div key={game.id} className="game-card">
                      <div className="game-card-head">
                        <div className="game-card-row"><div className="game-card-title">{game.title}</div><div className={`status-pill ${isCancelled ? "s-cancelled" : "s-open"}`}>{isCancelled ? "Cancelled" : "Booked ✓"}</div></div>
                        <span className="fmt-chip">{game.format}</span>
                      </div>
                      <div className="game-card-body">
                        <div className="game-info-rows">
                          <div className="game-info-row">📍 {game.location}</div>
                          <div className="game-info-row">📅 {game.date} at {game.time}</div>
                          {!isCancelled && (<div className="game-info-row" style={{ color: hours >= 6 ? "#1cff72" : "#ffa040" }}>⏰ {hours >= 6 ? `${Math.floor(hours)}h away — cancel for credit` : "Under 6h — no refund if cancelled"}</div>)}
                        </div>
                        {isCancelled ? (
                          <div className="cancelled-status">🚫 Game cancelled by owner<br /><span style={{ color:"#1cff72", fontWeight:700 }}>🎟️ €{game.pricePerPlayer} credit added to your wallet</span></div>
                        ) : (
                          <>
                            <div className="booked-status">✓ €{game.pricePerPlayer} paid via Revolut — See you there!</div>
                            <button className="btn btn-red-outline" style={{ fontSize:14 }} onClick={() => setCantMakeGame({ gameId:game.id, bookingId:myBookings[game.id], pricePerPlayer:game.pricePerPlayer, date:game.date, time:game.time })}>😔 Can't make it anymore</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "admin" && !adminMode && (
          <div className="login-page">
            <div className="login-icon">🔐</div>
            <div className="login-title">Owner Login</div>
            <div className="login-sub">Enter your admin password to manage games.</div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Enter password" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { adminPass === ADMIN_PASS ? (setAdminMode(true), setAdminErr("")) : setAdminErr("Incorrect password"); } }} />{adminErr && <p style={{ color:"#ff5050", fontSize:13, marginTop:8 }}>{adminErr}</p>}</div>
            <button className="btn btn-green" onClick={() => { adminPass === ADMIN_PASS ? (setAdminMode(true), setAdminErr("")) : setAdminErr("Incorrect password"); }}>Login</button>
            <p style={{ color:"#333", fontSize:12, marginTop:12, textAlign:"center" }}>Password: admin123</p>
          </div>
        )}

        {tab === "admin" && adminMode && (
          <div className="admin-page">
            <div className="admin-header"><div className="admin-title">Dashboard</div><div className="admin-badge">Owner</div><button className="btn btn-outline btn-sm" style={{ marginLeft:"auto" }} onClick={() => { setAdminMode(false); setAdminPass(""); setTab("browse"); }}>✕ Exit</button></div>
            <div className="stats-row">
              <div className="stat-tile"><div className="stat-tile-label">Games</div><div className="stat-tile-val">{games.length}</div></div>
              <div className="stat-tile"><div className="stat-tile-label">Players</div><div className="stat-tile-val">{totalPlayers}</div></div>
              <div className="stat-tile"><div className="stat-tile-label">Revenue</div><div className="stat-tile-val">€{totalRevenue.toFixed(0)}</div><div className="stat-tile-sub">Via Revolut</div></div>
              <div className="stat-tile"><div className="stat-tile-label">Profit</div><div className="stat-tile-val">€{totalProfit.toFixed(0)}</div><div className="stat-tile-sub">After pitch costs</div></div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:2 }}>ALL <span style={{ color:"#1cff72" }}>GAMES</span></span>
              <button className="btn btn-green btn-sm" onClick={() => setShowCreate(true)}>+ New Game</button>
            </div>
            {games.length === 0 ? (
              <div className="empty"><div className="empty-emoji">📋</div><div className="empty-title">No Games Yet</div><div className="empty-sub">Tap + New Game to get started.</div></div>
            ) : (
              games.map(game => {
                const fmt = FORMATS[game.format];
                const active = (game.bookings||[]).filter(b => !b.cancelled);
                const revenue = active.length * game.pricePerPlayer;
                const profit = revenue - game.pitchCost;
                const isExp = expandedGame === game.id;
                const cancelled = (game.bookings||[]).filter(b => b.cancelled);
                return (
                  <div key={game.id} className="admin-game-card">
                    <div className="admin-game-top">
                      <div>
                        <div className="admin-game-name">{game.title}{game.status === "cancelled" && <span style={{ marginLeft:8, fontSize:11, color:"#ff5050", background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.2)", borderRadius:5, padding:"1px 6px", fontWeight:700 }}>CANCELLED</span>}</div>
                        <div className="admin-game-meta">{game.location} · {game.date} {game.time}<br />{game.format} · €{game.pricePerPlayer}/player{game.status === "cancelled" && <span style={{ color:"#ff5050" }}> · {game.cancelReason === "players" ? "Not enough players" : game.cancelReason === "pitch" ? "Pitch unavailable" : game.cancelReason === "weather" ? "Bad weather" : "Other"}</span>}{game.status !== "cancelled" && cancelled.length > 0 && <span style={{ color:"#ff5050" }}> · {cancelled.length} cancelled</span>}</div>
                      </div>
                    </div>
                    <div className="admin-game-stats">
                      <div className="admin-stat"><div className="admin-stat-val">{game.joined}/{fmt.players}</div><div className="admin-stat-label">Players</div></div>
                      <div className="admin-stat"><div className="admin-stat-val" style={{ color:"#1cff72" }}>€{revenue.toFixed(0)}</div><div className="admin-stat-label">Revenue</div></div>
                      <div className="admin-stat"><div className="admin-stat-val" style={{ color: profit >= 0 ? "#1cff72" : "#ff5050" }}>€{profit.toFixed(0)}</div><div className="admin-stat-label">Profit</div></div>
                    </div>
                    <div className="admin-btns">
                      {(game.bookings||[]).length > 0 && (<button className="btn btn-outline btn-sm" onClick={() => setExpandedGame(isExp ? null : game.id)}>{isExp ? "Hide" : `Players (${(game.bookings||[]).length})`}</button>)}
                      {game.status !== "cancelled" && (<button className="btn btn-red-outline btn-sm" onClick={() => setCancelGameTarget(game)}>🚫 Cancel</button>)}
                      <button className="btn btn-sm" style={{ background:"rgba(255,80,80,0.05)", color:"#ff5050", border:"1px solid rgba(255,80,80,0.2)" }} onClick={() => handleDeleteGame(game.id)}>Remove</button>
                    </div>
                    {isExp && (<div style={{ marginTop:12 }}>{(game.bookings||[]).map(b => (<div key={b.id} className="player-row" style={{ opacity: b.cancelled ? 0.4 : 1 }}><div><div className="player-name">{b.name}</div><div className="player-email">{b.email}</div></div><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:13, color:"#1cff72", fontWeight:700 }}>€{b.paid}</span>{b.cancelled && <span className={`player-tag ${b.gotCredit ? "tag-credit" : "tag-cancelled"}`}>{b.gotCredit ? "Credit" : "Cancelled"}</span>}</div></div>))}</div>)}
                  </div>
                );
              })
            )}
            <button className="fab" onClick={() => setShowCreate(true)}>⚽ New Game</button>
          </div>
        )}

        {tab !== "admin" && (
          <div className="bottom-nav">
            {[
              { id:"browse", icon:"⚽", label:"Games" },
              { id:"mygames", icon:"🎟️", label:`My Games${myBookedGames.length > 0 ? ` (${myBookedGames.length})` : ""}` },
            ].map(n => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="nav-item-icon">{n.icon}</span>
                <span className="nav-item-label">{n.label}</span>
              </button>
            ))}
          </div>
        )}

        {bookingGame && (<BookingFlow game={bookingGame} credit={validCredit} onClose={() => setBookingGame(null)} onConfirm={(details, cu) => handleConfirmBooking(bookingGame, details, cu)} />)}
        <CantMakeItSheet game={games.find(g => g.id === cantMakeGame?.gameId)} open={!!cantMakeGame} onClose={() => setCantMakeGame(null)} onConfirm={handleCantMakeIt} />
        <CancelGameSheet game={cancelGameTarget} open={!!cancelGameTarget} onClose={() => setCancelGameTarget(null)} onConfirm={handleCancelGame} />
        <CreateGameSheet open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreateGame} />
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
