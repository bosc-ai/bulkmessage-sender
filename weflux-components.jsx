// weflux-components.jsx — Brand constants, icons, sidebar, UI primitives
/* global React */
const { useTime, interpolate, animate, Easing, clamp } = window;

// ── Brand ─────────────────────────────────────────────────────────────────────
const WF = {
  bg: '#060d06',
  sidebar: '#0c1a0c',
  sidebarActive: '#1b3a1b',
  green: '#25c95f',
  greenBright: '#00ff7a',
  white: '#edfaef',
  dimText: '#567060',
  midText: '#98bf9e',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  blue: '#3b82f6',
  red: '#ef4444',
  teal: '#14b8a6',
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconDashboard({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" fill={c}/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" fill={c} opacity="0.65"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" fill={c} opacity="0.65"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" fill={c} opacity="0.4"/>
  </svg>;
}

function IconInbox({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1.5" y="4" width="15" height="11" rx="2" stroke={c} strokeWidth="1.5"/>
    <path d="M1.5 8.5l6.5 3.5a2 2 0 001 0l6.5-3.5" stroke={c} strokeWidth="1.5"/>
  </svg>;
}

function IconContacts({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="7" cy="6" r="3" stroke={c} strokeWidth="1.5"/>
    <path d="M1 16c0-3 2.5-5.5 6-5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="13" cy="7.5" r="2.5" stroke={c} strokeWidth="1.3" opacity="0.6"/>
    <path d="M12.5 13c1.5 0 4 1.3 4 3" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
  </svg>;
}

function IconCampaigns({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 9L14 4v11L2 9z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 11l1.5 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}

function IconTemplates({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2.5" y="1.5" width="13" height="15" rx="2" stroke={c} strokeWidth="1.5"/>
    <line x1="5.5" y1="6" x2="12.5" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5.5" y1="9.5" x2="12.5" y2="9.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5.5" y1="13" x2="9.5" y2="13" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}

function IconAutomation({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M10 2L5 9h5L7 16l8-9h-5l2-5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>;
}

function IconAnalytics({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="9.5" width="3.5" height="6.5" rx="1" fill={c}/>
    <rect x="7.25" y="5.5" width="3.5" height="10.5" rx="1" fill={c} opacity="0.75"/>
    <rect x="12.5" y="2" width="3.5" height="14" rx="1" fill={c} opacity="0.5"/>
  </svg>;
}

function IconCrm({ active }) {
  const c = active ? WF.green : WF.dimText;
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1.5L16 5.5v7L9 16.5 2 12.5v-7z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="9" cy="9" r="2.5" fill={c} opacity="0.85"/>
  </svg>;
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function WefluxLogo({ scale = 1, glow = 0, origin = 'left center' }) {
  const g = Math.round(glow * 28);
  const shadow = glow > 0 ? `0 0 ${g}px ${WF.greenBright}, 0 0 ${g * 2}px rgba(37,201,95,0.35)` : 'none';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${scale})`, transformOrigin: origin }}>
      <img src="uploads/whatsapp-style.png" alt="Weflux" style={{ width: 44, height: 44, borderRadius: 10, boxShadow: shadow, flexShrink: 0, objectFit: 'cover', display: 'block' }}/>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>Weflux</span>
          <span style={{ color: WF.green, fontSize: 11, fontWeight: 600, background: 'rgba(37,201,95,0.12)', border: '1px solid rgba(37,201,95,0.25)', borderRadius: 4, padding: '1px 6px', letterSpacing: '0.05em', fontFamily: 'Inter,sans-serif' }}>BETA</span>
        </div>
        <div style={{ color: WF.dimText, fontSize: 12, fontFamily: 'Inter,sans-serif', marginTop: 2 }}>WhatsApp Business CRM</div>
      </div>
    </div>
  );
}

// ── Captions ──────────────────────────────────────────────────────────────────
function Caption({ text, start, end }) {
  const t = useTime();
  if (t < start - 0.5 || t > end + 0.5) return null;
  const op = Math.min(
    animate({ from: 0, to: 1, start, end: start + 0.5, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: end - 0.45, end, ease: Easing.easeInQuad })(t)
  );
  return (
    <div style={{ position: 'absolute', bottom: 56, left: 260, right: 0, display: 'flex', justifyContent: 'center', opacity: op, zIndex: 200, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(6,13,6,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(37,201,95,0.16)', borderRadius: 12, padding: '14px 32px', maxWidth: 1100 }}>
        <p style={{ color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 26, fontWeight: 400, lineHeight: 1.45, textAlign: 'center', textWrap: 'pretty' }}>{text}</p>
      </div>
    </div>
  );
}

function CaptionFull({ text, start, end }) {
  const t = useTime();
  if (t < start - 0.5 || t > end + 0.5) return null;
  const op = Math.min(
    animate({ from: 0, to: 1, start, end: start + 0.5, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: end - 0.45, end, ease: Easing.easeInQuad })(t)
  );
  return (
    <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op, zIndex: 200, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(6,13,6,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(37,201,95,0.16)', borderRadius: 12, padding: '14px 32px', maxWidth: 1200 }}>
        <p style={{ color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 26, fontWeight: 400, lineHeight: 1.45, textAlign: 'center', textWrap: 'pretty' }}>{text}</p>
      </div>
    </div>
  );
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ value, start, end, prefix = '', suffix = '' }) {
  const t = useTime();
  const p = animate({ from: 0, to: 1, start, end, ease: Easing.easeOutCubic })(t);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{prefix}{Math.round(value * p).toLocaleString()}{suffix}</span>;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  Icon: IconDashboard,  appearAt: 9  },
  { id: 'inbox',      label: 'Inbox',       Icon: IconInbox,      appearAt: 14 },
  { id: 'contacts',   label: 'Contacts',    Icon: IconContacts,   appearAt: 19 },
  { id: 'campaigns',  label: 'Campaigns',   Icon: IconCampaigns,  appearAt: 24 },
  { id: 'templates',  label: 'Templates',   Icon: IconTemplates,  appearAt: 29 },
  { id: 'automation', label: 'Automation',  Icon: IconAutomation, appearAt: 34 },
  { id: 'analytics',  label: 'Analytics',   Icon: IconAnalytics,  appearAt: 39 },
  { id: 'crm',        label: 'CRM',         Icon: IconCrm,        appearAt: 44 },
];

function Sidebar() {
  const t = useTime();
  const activeItem = [...SIDEBAR_ITEMS].reverse().find(item => t >= item.appearAt);

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 260, height: 1080, background: WF.sidebar, borderRight: '1px solid rgba(37,201,95,0.07)', display: 'flex', flexDirection: 'column', zIndex: 10, overflow: 'hidden' }}>
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <WefluxLogo scale={0.9}/>
      </div>
      <div style={{ padding: '10px 18px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <div style={{ color: WF.midText, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Serves India</div>
        <div style={{ color: WF.dimText, fontSize: 11, fontFamily: 'Inter,sans-serif', marginTop: 2 }}>+916360101966</div>
      </div>
      <div style={{ padding: '8px 10px', flex: 1 }}>
        {SIDEBAR_ITEMS.map((item) => {
          if (t < item.appearAt) return null;
          const sp   = animate({ from: 0, to: 1, start: item.appearAt, end: item.appearAt + 0.5, ease: Easing.easeOutCubic })(t);
          const pop  = t < item.appearAt + 0.9
            ? animate({ from: 1, to: 1.1, start: item.appearAt + 0.45, end: item.appearAt + 0.72, ease: Easing.easeOutBack })(t)
            : 1;
          const trailOp = t < item.appearAt + 0.8
            ? interpolate([item.appearAt, item.appearAt + 0.25, item.appearAt + 0.8], [0.7, 0.5, 0])(t) : 0;
          const trailW = interpolate([item.appearAt, item.appearAt + 0.5], [100, 0])(t);
          const isActive = activeItem?.id === item.id;

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2, background: isActive ? WF.sidebarActive : 'transparent', opacity: sp, transform: `translateX(${-40 * (1 - sp)}px)`, position: 'relative', overflow: 'hidden', boxShadow: isActive ? 'inset 0 0 24px rgba(37,201,95,0.07)' : 'none' }}>
              {trailOp > 0.01 && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: trailW, background: `linear-gradient(to right,rgba(37,201,95,${trailOp.toFixed(2)}),transparent)`, pointerEvents: 'none' }}/>
              )}
              <div style={{ transform: `scale(${pop})`, transformOrigin: 'center', flexShrink: 0 }}>
                <item.Icon active={isActive}/>
              </div>
              <span style={{ color: isActive ? WF.white : WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: WF.green, marginLeft: 'auto', boxShadow: `0 0 8px ${WF.green}`, flexShrink: 0 }}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  WF, SIDEBAR_ITEMS, WefluxLogo, Caption, CaptionFull, Counter, Sidebar,
  IconDashboard, IconInbox, IconContacts, IconCampaigns,
  IconTemplates, IconAutomation, IconAnalytics, IconCrm,
});
