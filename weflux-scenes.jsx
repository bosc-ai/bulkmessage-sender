// weflux-scenes.jsx — All scene components
/* global React */
const { useTime, interpolate, animate, Easing, clamp } = window;
const { WF, SIDEBAR_ITEMS, WefluxLogo, Caption, CaptionFull, Counter, Sidebar,
  IconDashboard, IconInbox, IconContacts, IconCampaigns,
  IconTemplates, IconAutomation, IconAnalytics, IconCrm } = window;

// ── Panel wrapper (content area, right of sidebar) ────────────────────────────
function Panel({ start, end, bg = WF.bg, children }) {
  const t = useTime();
  if (t < start - 0.4 || t > end + 0.4) return null;
  const op = Math.min(
    animate({ from: 0, to: 1, start, end: start + 0.45, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: end - 0.35, end, ease: Easing.easeInQuad })(t)
  );
  return (
    <div style={{ position: 'absolute', left: 260, top: 0, right: 0, bottom: 0, background: bg, opacity: op, overflow: 'hidden' }}>
      {children}
    </div>);

}

// ── Dashboard panel ────────────────────────────────────────────────────────────
function DashPanel() {
  const t = useTime();
  const metrics = [
  ['TOTAL CONTACTS', 2847, '+2 this week', WF.blue],
  ['OPEN CONVERSATIONS', 143, '3 total', WF.green],
  ['MESSAGES SENT', 12450, '+750% vs last week', '#8b5cf6'],
  ['DELIVERED', 9720, '94.2% delivery rate', WF.teal],
  ['READ', 8100, '67% read rate', WF.amber],
  ['FAILED', 48, '0.4% failure rate', WF.red]];

  return (
    <Panel start={9} end={14} bg="#f2f8f2">
      <div style={{ padding: '36px 44px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 34, fontWeight: 700, color: '#192a1a', marginBottom: 5 }}>Good afternoon, BOSC 👋</h2>
          <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 17 }}>Here's what's happening across your WhatsApp channels</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {metrics.map(([label, val, sub, col], i) => {
            const sp = animate({ from: 0, to: 1, start: 9.2 + i * 0.15, end: 9.2 + i * 0.15 + 0.55, ease: Easing.easeOutBack })(t);
            return (
              <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '22px 26px', border: '1px solid #ddeedd', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', opacity: sp, transform: `translateY(${(1 - sp) * 20}px)` }}>
                <div style={{ color: '#8aaa8a', fontSize: 11, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
                <div style={{ color: col, fontFamily: 'Inter,sans-serif', fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}><Counter value={val} start={9.2 + i * 0.15} end={12} /></div>
                <div style={{ color: '#8aaa8a', fontSize: 13, fontFamily: 'Inter,sans-serif', marginTop: 6 }}>{sub}</div>
              </div>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── Inbox panel ────────────────────────────────────────────────────────────────
function InboxPanel() {
  const t = useTime();
  const msgs = [
  ['Prateek', 'Can you attend the scheduled site visit?', '2d ago', '#e74c3c'],
  ['Amit Kumar', 'Yes, sending the proposal today!', '1d ago', '#2ecc71'],
  ['Sarah M.', 'Need pricing for the enterprise plan', '3h ago', '#3498db'],
  ['Rahul P.', 'Follow up on the demo we discussed', '1h ago', '#9b59b6'],
  ['Divya R.', 'Thanks for the quick response ✓', '28m ago', '#f39c12']];

  return (
    <Panel start={14} end={19} bg={WF.sidebar}>
      <div style={{ padding: '36px 44px' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Inbox</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 26 }}>3 conversations need attention</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map(([n, txt, tm, c], i) => {
            const sp = animate({ from: 0, to: 1, start: 14.3 + i * 0.26, end: 14.8 + i * 0.26, ease: Easing.easeOutBack })(t);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)', opacity: sp, transform: `translateX(${(1 - sp) * -35}px)` }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, color: '#fff', fontFamily: 'Inter,sans-serif', flexShrink: 0 }}>{n[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16 }}>{n}</div>
                  <div style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 14, marginTop: 2 }}>{txt}</div>
                </div>
                <div style={{ color: WF.green, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 500, flexShrink: 0, background: 'rgba(37,201,95,0.1)', borderRadius: 12, padding: '3px 10px' }}>{tm}</div>
              </div>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── Contacts panel ────────────────────────────────────────────────────────────
function ContactsPanel() {
  const t = useTime();
  const contacts = ['Prateek', 'Amit K.', 'Sarah M.', 'Rahul P.', 'Divya R.', 'Vikram S.', 'Neha J.', 'Arun T.', 'Pooja M.', 'Sanjay B.', 'Meera K.', 'Dev R.'];
  const colors = ['#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', '#ff5722', '#607d8b', '#795548', '#4caf50', '#2196f3'];
  return (
    <Panel start={19} end={24} bg={WF.bg}>
      <div style={{ padding: '36px 44px' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Contacts</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 36 }}>2,847 customers · every interaction tracked</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 24 }}>
          {contacts.map((name, i) => {
            const sp = animate({ from: 0, to: 1, start: 19.3 + i * 0.11, end: 19.3 + i * 0.11 + 0.5, ease: Easing.easeOutBack })(t);
            const glowAlpha = sp > 0.9 ? (sp - 0.9) / 0.1 : 0;
            return (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: sp, transform: `scale(${0.6 + sp * 0.4})` }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: colors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: 'Inter,sans-serif', boxShadow: glowAlpha > 0 ? `0 0 20px ${colors[i]}80` : 'none' }}>
                  {name.split(' ').map((w) => w[0]).join('')}
                </div>
                <span style={{ color: WF.midText, fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 500 }}>{name}</span>
              </div>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── Campaigns panel ──────────────────────────────────────────────────────────
function CampaignsPanel() {
  const t = useTime();
  const campaigns = [
  { name: 'Summer Sale 2025', status: 'Sent', reach: 1247, pct: '94%', col: WF.green },
  { name: 'Product Launch Wave', status: 'Sent', reach: 3820, pct: '88%', col: WF.blue },
  { name: 'Re-engagement Drive', status: 'Scheduled', reach: 2100, pct: '—', col: WF.amber }];

  // Paper plane that flies
  const planeX = animate({ from: 300, to: 1700, start: 24.8, end: 27.5, ease: Easing.easeInOutCubic })(t);
  const planeY = 320 + Math.sin(interpolate([24.8, 27.5], [0, Math.PI * 2])(t)) * 40;
  const planeOp = Math.min(animate({ from: 0, to: 1, start: 24.6, end: 25.2 })(t), animate({ from: 1, to: 0, start: 27, end: 27.5 })(t));
  return (
    <Panel start={24} end={29} bg={WF.bg}>
      <div style={{ padding: '36px 44px' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Campaigns</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 32 }}>Reach thousands with personalized messages</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {campaigns.map((c, i) => {
            const sp = animate({ from: 0, to: 1, start: 24.3 + i * 0.3, end: 24.3 + i * 0.3 + 0.5, ease: Easing.easeOutBack })(t);
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '18px 22px', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 20, opacity: sp, transform: `translateY(${(1 - sp) * 18}px)` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 18 }}>{c.name}</div>
                  <div style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 14, marginTop: 3 }}>{c.reach.toLocaleString()} contacts · {c.status}</div>
                </div>
                <div style={{ color: c.col, fontFamily: 'Inter,sans-serif', fontSize: 26, fontWeight: 700 }}>{c.pct}</div>
                <div style={{ background: `rgba(37,201,95,0.15)`, color: WF.green, borderRadius: 8, padding: '6px 14px', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600 }}>{c.status}</div>
              </div>);

          })}
        </div>
      </div>
      {/* Flying paper plane */}
      {planeOp > 0.01 &&
      <svg width="40" height="30" viewBox="0 0 40 28" style={{ position: 'absolute', left: planeX, top: planeY, opacity: planeOp, filter: `drop-shadow(0 0 8px ${WF.green})`, cursor: 'pointer' }}>
          <path d="M1 14L39 2 28 26 20 16 1 14z" fill="none" stroke={WF.green} strokeWidth="2" strokeLinejoin="round" />
          <path d="M20 16l8 10" stroke={WF.green} strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
    </Panel>);

}

// ── Templates panel ──────────────────────────────────────────────────────────
function TemplatesPanel() {
  const t = useTime();
  const cards = [
  { title: 'Welcome Message', preview: 'Hi {{name}}! Welcome to Serves India. We\'re here to help you...', tag: 'Onboarding' },
  { title: 'Follow-up Reminder', preview: 'Hey {{name}}, just checking in on your recent inquiry about...', tag: 'Sales' },
  { title: 'Order Confirmation', preview: 'Your order #{{order_id}} has been confirmed! Expected delivery...', tag: 'Transact.' }];

  return (
    <Panel start={29} end={34} bg={WF.sidebar}>
      <div style={{ padding: '36px 44px' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Templates</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 32 }}>Proven messages, instantly scalable</p>
        <div style={{ position: 'relative', height: 480 }}>
          {cards.map((c, i) => {
            const sp = animate({ from: 0, to: 1, start: 29.3 + i * 0.35, end: 29.3 + i * 0.35 + 0.5, ease: Easing.easeOutBack })(t);
            return (
              <div key={i} style={{ position: 'absolute', left: i * 20, top: i * 30, right: 0, background: i === 2 ? '#fff' : i === 1 ? '#f8fcf8' : '#f2f8f2', borderRadius: 16, padding: '22px 26px', border: '1px solid #ddeedd', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', opacity: sp, transform: `translateY(${(1 - sp) * 30}px) rotate(${i === 0 ? -2 : i === 1 ? -1 : 0}deg)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ color: '#1a2a1a', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 18 }}>{c.title}</span>
                  <span style={{ background: 'rgba(37,201,95,0.15)', color: WF.green, fontSize: 12, fontWeight: 600, borderRadius: 6, padding: '3px 10px', fontFamily: 'Inter,sans-serif' }}>{c.tag}</span>
                </div>
                <p style={{ color: '#567060', fontFamily: 'Inter,sans-serif', fontSize: 14, lineHeight: 1.6 }}>{c.preview}</p>
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  {['{{name}}', '{{order_id}}'].filter((v) => c.preview.includes(v)).map((v) =>
                  <span key={v} style={{ background: 'rgba(59,130,246,0.12)', color: WF.blue, fontSize: 12, borderRadius: 4, padding: '2px 8px', fontFamily: 'monospace' }}>{v}</span>
                  )}
                </div>
              </div>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── Automation panel ──────────────────────────────────────────────────────────
function AutomationPanel() {
  const t = useTime();
  const nodes = [
  { label: 'New Lead', sub: 'Trigger', col: WF.green },
  { label: 'Send Welcome', sub: 'Message', col: WF.blue },
  { label: 'Wait 24h', sub: 'Delay', col: WF.amber },
  { label: 'Follow-up', sub: 'Message', col: WF.purple },
  { label: 'Mark Active', sub: 'Action', col: WF.teal }];

  return (
    <Panel start={34} end={39} bg={WF.bg}>
      <div style={{ padding: '36px 44px', height: '100%' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Automation</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 60 }}>Work while you sleep · 0 live workflow blocks</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 20 }}>
          {nodes.map((node, i) => {
            const nOp = animate({ from: 0, to: 1, start: 34.4 + i * 0.32, end: 34.4 + i * 0.32 + 0.4, ease: Easing.easeOutBack })(t);
            const lineProgress = i < nodes.length - 1 ?
            animate({ from: 0, to: 1, start: 34.65 + i * 0.32, end: 34.65 + i * 0.32 + 0.3 })(t) : 1;
            // Dot traveling along the line
            const dotT = t - (34.65 + i * 0.32 + 0.3);
            const dotX = dotT > 0 ? Math.min(dotT / 0.5, 1) : 0;
            return (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: nOp, flexShrink: 0 }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: `rgba(37,201,95,0.06)`, border: `2px solid ${node.col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: nOp > 0.9 ? `0 0 20px ${node.col}40` : 'none' }}>
                    <span style={{ color: node.col, fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{node.label}</span>
                    <span style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 11 }}>{node.sub}</span>
                  </div>
                </div>
                {i < nodes.length - 1 &&
                <div style={{ flex: 1, height: 3, position: 'relative', marginTop: -28 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${lineProgress * 100}%`, background: `linear-gradient(to right,${node.col},${nodes[i + 1].col})`, borderRadius: 2 }} />
                    {dotX > 0 && dotX < 1 &&
                  <div style={{ position: 'absolute', left: `${dotX * 80 + 10}%`, top: -5, width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: `0 0 10px ${node.col}`, transform: 'translateX(-50%)' }} />
                  }
                  </div>
                }
              </React.Fragment>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── Analytics panel ──────────────────────────────────────────────────────────
function AnalyticsPanel() {
  const t = useTime();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const vals = [45, 62, 88, 71, 95, 58, 40];
  const maxV = 95;
  return (
    <Panel start={39} end={44} bg={WF.bg}>
      <div style={{ padding: '36px 44px', height: '100%' }}>
        <h2 style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Analytics</h2>
        <p style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 16, marginBottom: 40 }}>WhatsApp performance · last 7 days</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 380 }}>
          {days.map((day, i) => {
            const targetH = vals[i] / maxV * 340;
            const barH = animate({ from: 0, to: targetH, start: 39.3 + i * 0.14, end: 39.3 + i * 0.14 + 0.65, ease: Easing.easeOutCubic })(t);
            const labelOp = animate({ from: 0, to: 1, start: 39.4 + i * 0.14, end: 39.6 + i * 0.14 })(t);
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ color: WF.green, fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 700, opacity: labelOp }}>{vals[i]}%</div>
                <div style={{ width: '100%', height: barH, background: `linear-gradient(to top,${WF.green},rgba(37,201,95,0.35))`, borderRadius: '6px 6px 0 0', boxShadow: barH > 10 ? `0 0 12px rgba(37,201,95,0.3)` : 'none' }} />
                <div style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 14 }}>{day}</div>
              </div>);

          })}
        </div>
      </div>
    </Panel>);

}

// ── CRM spotlight panel (preview for transition) ──────────────────────────────
function CrmSpotPanel() {
  const t = useTime();
  const glowOp = animate({ from: 0, to: 1, start: 44.5, end: 46, ease: Easing.easeOutQuad })(t);
  return (
    <Panel start={44} end={51} bg={WF.bg}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,rgba(37,201,95,${0.12 * glowOp}),transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ opacity: glowOp, textAlign: 'center' }}>
          <div style={{ color: WF.green, fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>CRM Pipeline</div>
          <div style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, textShadow: `0 0 40px rgba(37,201,95,0.4)` }}>Where Opportunities<br />Become Revenue</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 40, justifyContent: 'center' }}>
            {['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won'].map((stage, i) => {
              const stageOp = animate({ from: 0, to: 1, start: 45 + i * 0.2, end: 45 + i * 0.2 + 0.4, ease: Easing.easeOutBack })(t);
              const cols = [WF.dimText, WF.blue, WF.purple, WF.amber, WF.green];
              return (
                <div key={stage} style={{ padding: '8px 20px', borderRadius: 20, border: `1px solid ${cols[i]}`, color: cols[i], fontFamily: 'Inter,sans-serif', fontSize: 16, fontWeight: 600, opacity: stageOp }}>
                  {stage}
                </div>);

            })}
          </div>
        </div>
      </div>
    </Panel>);

}

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI = Array.from({ length: 50 }, (_, i) => ({
  x: 50 + i * 389 % 1700,
  vy: 180 + i * 67 % 280,
  col: ['#25c95f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#00ff7a', '#ec4899'][i % 7],
  size: 8 + i * 5 % 10,
  del: i * 0.027 % 0.7,
  rot: i * 37 % 360,
  rspd: (i % 2 === 0 ? 1 : -1) * (160 + i * 43 % 220)
}));

function Confetti({ start }) {
  const t = useTime();
  if (t < start || t > start + 4.5) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {CONFETTI.map((p, i) => {
        const el = t - start - p.del;
        if (el < 0) return null;
        const y = el * p.vy;
        const rot = p.rot + el * p.rspd;
        const op = Math.max(0, 1 - el / 3);
        return (
          <div key={i} style={{ position: 'absolute', left: p.x, top: -10, width: p.size, height: p.size, background: p.col, borderRadius: 2, transform: `translateY(${y}px) rotate(${rot}deg)`, opacity: op }} />);

      })}
    </div>);

}

// ── CRM Pipeline data ─────────────────────────────────────────────────────────
const CRM_PIPELINE = [
{ id: 'lead', label: 'Lead', color: '#64748b', bg: '#f8fafc', count: 4, emergeAt: 50.5,
  cards: [['Acme Corp', '$12,000', '#e74c3c', 51.5], ['TechStart', '$8,500', '#3498db', 52.0], ['Innovate Ltd', '$25,000', '#9b59b6', 52.5], ['GlobalCo', '$15,000', '#2ecc71', 53.0]],
  glowStart: 53, glowEnd: 55.5 },
{ id: 'contacted', label: 'Contacted', color: '#3b82f6', bg: '#eff6ff', count: 3, emergeAt: 51.0,
  cards: [['MegaRetail', '$45,000', '#e91e63', 52.5], ['StartupXYZ', '$18,000', '#ff5722', 53.0], ['Enterprise A', '$60,000', '#607d8b', 53.5]],
  glowStart: 55.5, glowEnd: 58 },
{ id: 'proposal', label: 'Proposal', color: '#8b5cf6', bg: '#f5f3ff', count: 2, emergeAt: 51.5,
  cards: [['BigCorp Inc', '$120,000', '#8b5cf6', 53.5], ['MidFirm Ltd', '$35,000', '#7c3aed', 54.0]],
  glowStart: 58, glowEnd: 61 },
{ id: 'negotiation', label: 'Negotiation', color: '#f59e0b', bg: '#fffbeb', count: 2, emergeAt: 52.0,
  cards: [['MegaDeal Co', '$200,000', '#f59e0b', 54.5], ['Premium Ltd', '$85,000', '#d97706', 55.0]],
  glowStart: 61, glowEnd: 64 },
{ id: 'won', label: 'Won ✓', color: '#22c55e', bg: '#f0fdf4', count: 1, emergeAt: 52.5,
  cards: [['TechGiant', '$450,000', '#22c55e', 55.5]],
  glowStart: 64, glowEnd: 68 }];


// ── CRM Column ────────────────────────────────────────────────────────────────
function CrmColumn({ col, t }) {
  if (t < col.emergeAt) return <div style={{ flex: 1 }} />;
  const colY = animate({ from: 700, to: 0, start: col.emergeAt, end: col.emergeAt + 0.9, ease: Easing.easeOutBack })(t);
  const colOp = animate({ from: 0, to: 1, start: col.emergeAt, end: col.emergeAt + 0.5 })(t);
  const isActive = t >= col.glowStart && t < col.glowEnd;
  const gi = isActive ? Math.min(
    animate({ from: 0, to: 1, start: col.glowStart, end: col.glowStart + 0.6 })(t),
    animate({ from: 1, to: 0.5, start: col.glowEnd - 0.5, end: col.glowEnd })(t)
  ) : 0;

  return (
    <div style={{ flex: 1, opacity: colOp, transform: `translateY(${colY}px)`, display: 'flex', flexDirection: 'column', borderRadius: 14, overflow: 'hidden', boxShadow: isActive ? `0 0 ${28 * gi}px ${col.color}60,0 0 ${55 * gi}px ${col.color}28,0 6px 24px rgba(0,0,0,0.18)` : '0 4px 20px rgba(0,0,0,0.15)' }}>
      <div style={{ background: col.color, height: 5, flexShrink: 0 }} />
      <div style={{ background: col.bg, padding: '14px 16px 10px', borderBottom: `1px solid ${col.color}20`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 15, color: '#1a2a1a' }}>{col.label}</span>
          <span style={{ background: `${col.color}22`, color: col.color, borderRadius: 12, padding: '2px 10px', fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>{col.count}</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#f7f9f7', padding: '10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {col.cards.map(([company, value, avatarColor, cardStart], ci) => {
          if (t < cardStart) return null;
          const cardY = animate({ from: -80, to: 0, start: cardStart, end: cardStart + 0.45, ease: Easing.easeOutBack })(t);
          const cardOp = animate({ from: 0, to: 1, start: cardStart, end: cardStart + 0.3 })(t);
          return (
            <div key={ci} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.05)', opacity: cardOp, transform: `translateY(${cardY}px)`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Inter,sans-serif', flexShrink: 0 }}>{company[0]}</div>
                <div>
                  <div style={{ color: '#1a2a1a', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14 }}>{company}</div>
                  <div style={{ color: col.color, fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600 }}>{value}</div>
                </div>
              </div>
            </div>);

        })}
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — Logo Reveal (0–9s)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene1() {
  const t = useTime();
  if (t < 0 || t > 9.5) return null;

  const sceneOp = animate({ from: 1, to: 0, start: 8.5, end: 9.5 })(t);

  // Pulse dot — fully gone by t=1.8, logo starts at t=2.0
  const dotOp = Math.min(
    animate({ from: 0, to: 1, start: 0.8, end: 1.3, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: 1.4, end: 1.85, ease: Easing.easeInQuad })(t)
  );
  const dotScale = animate({ from: 0.4, to: 1, start: 0.8, end: 1.4, ease: Easing.easeOutBack })(t);

  // Expanding rings — both fully gone by t=1.9
  const r1Scale = animate({ from: 1, to: 3.5, start: 1.0, end: 1.8, ease: Easing.easeOutCubic })(t);
  const r1Op = Math.min(
    animate({ from: 0, to: 0.65, start: 1.0, end: 1.15 })(t),
    animate({ from: 0.65, to: 0, start: 1.15, end: 1.8 })(t)
  );
  const r2Scale = animate({ from: 1, to: 4, start: 1.2, end: 1.9, ease: Easing.easeOutCubic })(t);
  const r2Op = Math.min(
    animate({ from: 0, to: 0.45, start: 1.2, end: 1.35 })(t),
    animate({ from: 0.45, to: 0, start: 1.35, end: 1.9 })(t)
  );

  // Logo
  const logoOp = animate({ from: 0, to: 1, start: 2.0, end: 3.5, ease: Easing.easeOutQuad })(t);
  const logoSc = animate({ from: 0.75, to: 1, start: 2.0, end: 3.5, ease: Easing.easeOutBack })(t);
  const logoGlow = animate({ from: 0, to: 1.8, start: 2.0, end: 3.8 })(t) * animate({ from: 1.8, to: 0.6, start: 3.8, end: 6 })(t);

  // Blurry dashboard backdrop
  const dashOp = animate({ from: 0, to: 0.55, start: 3.5, end: 7.0 })(t);
  const dashBlur = animate({ from: 40, to: 8, start: 4.5, end: 8 })(t);
  const dashSc = animate({ from: 0.88, to: 1.06, start: 3.5, end: 8.5, ease: Easing.easeOutSine })(t);

  return (
    <div style={{ position: 'absolute', inset: 0, background: WF.bg, opacity: sceneOp, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Blurry dashboard */}
      <div style={{ position: 'absolute', inset: 0, opacity: dashOp, filter: `blur(${dashBlur}px)`, transform: `scale(${dashSc})`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 220, height: '100%', background: WF.sidebar }} />
        <div style={{ position: 'absolute', left: 220, top: 0, right: 0, bottom: 0, background: '#f2f8f2', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, padding: 40, alignContent: 'start' }}>
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 140, background: '#fff', borderRadius: 16, border: '1px solid #ddeedd' }} />)}
        </div>
      </div>

      {/* Rings */}
      <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: `1.5px solid ${WF.green}`, opacity: r1Op, transform: `scale(${r1Scale})`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: `1.5px solid ${WF.green}`, opacity: r2Op, transform: `scale(${r2Scale})`, pointerEvents: 'none' }} />

      {/* Green pulse dot */}
      <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: WF.greenBright, opacity: dotOp, transform: `scale(${dotScale})`, boxShadow: `0 0 30px 12px rgba(0,255,122,0.4)` }} />

      {/* Logo */}
      <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, transformOrigin: 'center', zIndex: 10 }}>
        <WefluxLogo scale={2.8} glow={logoGlow} origin="center" />
      </div>

    </div>);

}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Sidebar Introduction (8–51s)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene2() {
  const t = useTime();
  if (t < 8 || t > 52) return null;
  const sceneOp = Math.min(
    animate({ from: 0, to: 1, start: 8, end: 9, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: 50.5, end: 52 })(t)
  );

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOp }}>
      <div style={{ position: 'absolute', inset: 0, background: WF.bg }} />
      <DashPanel />
      <InboxPanel />
      <ContactsPanel />
      <CampaignsPanel />
      <TemplatesPanel />
      <AutomationPanel />
      <AnalyticsPanel />
      <CrmSpotPanel />
      <Sidebar />

    </div>);

}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — CRM Board Reveal (49–68s)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene3() {
  const t = useTime();
  if (t < 49 || t > 69) return null;
  const sceneOp = Math.min(
    animate({ from: 0, to: 1, start: 49, end: 51, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: 67.5, end: 69 })(t)
  );

  // Header
  const hOp = animate({ from: 0, to: 1, start: 50, end: 51, ease: Easing.easeOutQuad })(t);
  const hY = animate({ from: -30, to: 0, start: 50, end: 51, ease: Easing.easeOutCubic })(t);

  // Green sweep for Won
  const sweepX = animate({ from: -500, to: 2200, start: 64, end: 65.5, ease: Easing.easeInOutCubic })(t);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0f0a', opacity: sceneOp }}>
      {/* Ambient radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1200px 600px at 50% 30%,rgba(37,201,95,0.05),transparent)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 36, opacity: hOp, transform: `translateY(${hY}px)`, textAlign: 'center' }}>
        <div style={{ color: WF.green, fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>CRM Pipeline</div>
        <div style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em' }}>Track Every Opportunity</div>
      </div>

      {/* Columns */}
      <div style={{ position: 'absolute', left: 24, right: 24, top: 148, bottom: 36, display: 'flex', gap: 14 }}>
        {CRM_PIPELINE.map((col) => <CrmColumn key={col.id} col={col} t={t} />)}
      </div>

      {/* Green light sweep for Won */}
      {t >= 64 && t <= 65.8 &&
      <div style={{ position: 'absolute', left: sweepX, top: 0, width: 380, height: 1080, background: 'linear-gradient(to right,transparent,rgba(37,201,95,0.18),transparent)', pointerEvents: 'none' }} />
      }

      <Confetti start={65} />

    </div>);

}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — Metrics (66–77s)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene4() {
  const t = useTime();
  if (t < 66 || t > 78) return null;
  const sceneOp = Math.min(
    animate({ from: 0, to: 1, start: 66, end: 68, ease: Easing.easeOutQuad })(t),
    animate({ from: 1, to: 0, start: 76, end: 78 })(t)
  );

  const cards = [
  { label: 'Total Deals', val: 247, fmt: (v) => String(Math.round(v)), col: WF.blue, start: 67 },
  { label: 'Pipeline Value', val: 1.2, fmt: (v) => `$${v.toFixed(1)}M`, col: WF.green, start: 68 },
  { label: 'Won Value', val: 340, fmt: (v) => `$${Math.round(v)}K`, col: WF.amber, start: 68.5 },
  { label: 'Win Rate', val: 68, fmt: (v) => `${Math.round(v)}%`, col: WF.purple, start: 69 }];


  // Win rate gauge
  const circumference = 2 * Math.PI * 72;
  const gaugeProgress = animate({ from: 0, to: 1, start: 69.5, end: 72, ease: Easing.easeOutCubic })(t);
  const dashOff = circumference * (1 - 0.68 * gaugeProgress);

  const hOp = animate({ from: 0, to: 1, start: 66.5, end: 67.5 })(t);
  const hY = animate({ from: 20, to: 0, start: 66.5, end: 67.5, ease: Easing.easeOutCubic })(t);

  return (
    <div style={{ position: 'absolute', inset: 0, background: WF.bg, opacity: sceneOp }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 900px 500px at 50% 40%,rgba(37,201,95,0.04),transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 56 }}>
        <div style={{ textAlign: 'center', opacity: hOp, transform: `translateY(${hY}px)` }}>
          <div style={{ color: WF.green, fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Live Performance</div>
          <div style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em' }}>Your Pipeline at a Glance</div>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
          {cards.map((card, i) => {
            const sp = animate({ from: 0, to: 1, start: card.start, end: card.start + 0.65, ease: Easing.easeOutBack })(t);
            const p  = animate({ from: 0, to: card.val, start: card.start, end: card.start + 2.5, ease: Easing.easeOutCubic })(t);
            const isGauge = card.label === 'Win Rate';
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 52px', textAlign: 'center', opacity: sp, transform: `translateY(${(1 - sp) * 30}px)`, minWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <div style={{ color: WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</div>
                {isGauge ? (
                  <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                      <circle cx="80" cy="80" r="72" fill="none" stroke={card.col} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={dashOff} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ filter: `drop-shadow(0 0 8px ${card.col})` }}/>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.col, fontFamily: 'Inter,sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em' }}>
                      {card.fmt(p)}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: card.col, fontFamily: 'Inter,sans-serif', fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{card.fmt(p)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════════════════════════
// FINALE — Grand Finale (75–90s)
// ═══════════════════════════════════════════════════════════════════════════════
function Finale() {
  const t = useTime();
  if (t < 75) return null;
  const sceneOp = animate({ from: 0, to: 1, start: 75, end: 77, ease: Easing.easeOutQuad })(t);

  const ambI = animate({ from: 0, to: 1, start: 75, end: 79 })(t);
  const logoOp = animate({ from: 0, to: 1, start: 80, end: 82.5, ease: Easing.easeOutQuad })(t);
  const logoSc = animate({ from: 0.55, to: 1, start: 80, end: 82.5, ease: Easing.easeOutBack })(t);
  const logoGl = animate({ from: 0, to: 2, start: 80, end: 83 })(t);
  const tagOp = animate({ from: 0, to: 1, start: 83, end: 84.5 })(t);
  const endOp = animate({ from: 0, to: 1, start: 85, end: 86.5 })(t);

  const sidebarIcons = [
  { id: 'dashboard', Icon: IconDashboard, label: 'Dashboard' },
  { id: 'inbox', Icon: IconInbox, label: 'Inbox' },
  { id: 'contacts', Icon: IconContacts, label: 'Contacts' },
  { id: 'campaigns', Icon: IconCampaigns, label: 'Campaigns' },
  { id: 'templates', Icon: IconTemplates, label: 'Templates' },
  { id: 'automation', Icon: IconAutomation, label: 'Automation' },
  { id: 'analytics', Icon: IconAnalytics, label: 'Analytics' },
  { id: 'crm', Icon: IconCrm, label: 'CRM' }];


  return (
    <div style={{ position: 'absolute', inset: 0, background: WF.bg, opacity: sceneOp }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 1000px 700px at 60% 50%,rgba(37,201,95,${0.07 * ambI}),transparent)`, pointerEvents: 'none' }} />

      {/* Illuminated sidebar */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 260, height: 1080, background: WF.sidebar, borderRight: '1px solid rgba(37,201,95,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
          <WefluxLogo scale={0.9} glow={logoGl * 0.25} />
        </div>
        <div style={{ padding: '8px 10px', flex: 1, marginTop: 8 }}>
          {sidebarIcons.map((item, i) => {
            const gi = animate({ from: 0, to: 1, start: 75.4 + i * 0.38, end: 75.4 + i * 0.38 + 0.5, ease: Easing.easeOutBack })(t);
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2, background: `rgba(37,201,95,${0.08 * gi})`, boxShadow: gi > 0.1 ? `inset 0 0 20px rgba(37,201,95,${0.05 * gi})` : 'none' }}>
                <div style={{ opacity: 0.35 + 0.65 * gi, transform: `scale(${1 + 0.12 * gi})`, transformOrigin: 'center', flexShrink: 0 }}>
                  <item.Icon active={gi > 0.5} />
                </div>
                <span style={{ color: gi > 0.5 ? WF.white : WF.dimText, fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: gi > 0.5 ? 500 : 400, opacity: 0.4 + 0.6 * gi }}>{item.label}</span>
                {gi > 0.9 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: WF.green, marginLeft: 'auto', boxShadow: `0 0 6px ${WF.green}`, flexShrink: 0 }} />}
              </div>);

          })}
        </div>
      </div>

      {/* Center content — each block has explicit size so flex gap is accurate */}
      <div style={{ position: 'absolute', left: 260, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 44 }}>

        {/* Large logo — rendered at real pixel size, entry scale uses center origin */}
        <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, transformOrigin: 'center center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <img src="uploads/weflux.png" alt="Weflux" style={{ width: 130, height: 130, borderRadius: 28, flexShrink: 0, objectFit: 'cover', boxShadow: logoGl > 0 ? `0 0 ${Math.round(logoGl * 50)}px rgba(37,201,95,0.6),0 0 ${Math.round(logoGl * 100)}px rgba(37,201,95,0.3)` : 'none' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ color: WF.white, fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 58, letterSpacing: '-0.025em', lineHeight: 1 }}>Weflux</span>
                <span style={{ color: WF.green, fontSize: 20, fontWeight: 600, background: 'rgba(37,201,95,0.12)', border: '1px solid rgba(37,201,95,0.28)', borderRadius: 6, padding: '4px 13px', letterSpacing: '0.06em', fontFamily: 'Inter,sans-serif', alignSelf: 'center' }}>BETA</span>
              </div>
              <div style={{ color: WF.dimText, fontSize: 22, fontFamily: 'Inter,sans-serif', marginTop: 6 }}>WhatsApp Business CRM</div>
            </div>
          </div>
        </div>



      </div>
    </div>);

}

Object.assign(window, { Scene1, Scene2, Scene3, Scene4, Finale });