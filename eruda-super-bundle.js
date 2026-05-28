/* ============================================================
   ⚡ INS IT Developer Tools v6.0 — Standalone Super Bundle
   Full UI Rombak | Random IP | Complete Headers | HAR Export
   ============================================================ */
(function () {
  'use strict';
  const W = window, D = document;
  const CDN = 'https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.min.js';

  // ─── STATE ───
  W.__INS_STATE__ = W.__INS_STATE__ || {
    logs: [],
    console: [],
    filter: '',
    live: true,
    pick: false,
    randomIP: false,
    randomIPMode: 'ipv4',
    maxLogs: 500,
    theme: 'dark'
  };

  const S = () => W.__INS_STATE__;

  // ─── UTILS ───
  const $ = s => D.querySelector(s);
  const $$ = s => [...D.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const copy = t => navigator.clipboard?.writeText(String(t)).then(() => toast('Disalin!')).catch(() => prompt('Copy:', t));
  const toast = msg => { const el = D.createElement('div'); el.innerHTML = `<div style="position:fixed;top:16px;right:16px;z-index:2147483647;background:#10b981;color:#fff;padding:10px 16px;border-radius:12px;font:13px sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.4);animation:insToast .3s ease">${esc(msg)}</div>`; D.body.appendChild(el); setTimeout(() => el.remove(), 2000); };

  const headersToObj = h => {
    const o = {};
    try {
      if (!h) return o;
      if (h instanceof Headers) h.forEach((v, k) => o[k] = v);
      else if (Array.isArray(h)) h.forEach(x => { if (Array.isArray(x) && x.length === 2) o[x[0]] = x[1]; });
      else if (typeof h === 'object') Object.assign(o, h);
    } catch (_) {}
    return o;
  };

  // ─── RANDOM IP GENERATOR ───
  const randomIP = {
    ipv4: () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.'),
    ipv6: () => Array(8).fill(0).map(() => Math.floor(Math.random() * 65536).toString(16)).join(':'),
    mixed: () => Math.random() > 0.5 ? randomIP.ipv4() : randomIP.ipv6(),
    get: () => {
      const mode = S().randomIPMode;
      return randomIP[mode] ? randomIP[mode]() : randomIP.ipv4();
    }
  };

  // ─── LOAD ERUDA ───
  const load = u => new Promise((ok, no) => {
    const s = D.createElement('script');
    s.src = u;
    s.onload = ok;
    s.onerror = no;
    (D.head || D.documentElement).appendChild(s);
  });

  (async () => {
    if (!W.eruda) await load(CDN);

    try {
      eruda.init({ useShadowDom: false, tool: ['console', 'elements', 'network', 'resources', 'sources', 'info'] });
    } catch (_) {}

    // ─── CSS ───
    const css = `
<style>
@keyframes insToast{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes insFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes insPulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes insSlideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}

.ins-wrap{box-sizing:border-box;padding:12px;font:12px/1.5 'Segoe UI',system-ui,-apple-system,sans-serif;color:#e2e8f0;background:#0b0f19;min-height:420px;max-height:78vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-width:thin;scrollbar-color:#1e293b #0b0f19}
.ins-wrap::-webkit-scrollbar{width:6px}
.ins-wrap::-webkit-scrollbar-track{background:#0b0f19}
.ins-wrap::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}

.ins-head{background:linear-gradient(180deg,#0b0f19 0%,rgba(11,15,25,.95) 100%);padding-bottom:10px;position:sticky;top:0;z-index:20;backdrop-filter:blur(10px)}
.ins-title{font-size:20px;font-weight:900;margin:0 0 10px;color:#f8fafc;display:flex;align-items:center;gap:8px;letter-spacing:-.5px}
.ins-title::before{content:"⚡";font-size:22px;filter:drop-shadow(0 0 8px rgba(59,130,246,.5))}

.ins-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ins-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ins-grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}

.ins-btn{padding:9px 12px;margin:2px 0;border:0;border-radius:10px;background:#1e293b;color:#f1f5f9;font-weight:700;cursor:pointer;user-select:none;transition:all .15s ease;font-size:11px;display:inline-flex;align-items:center;justify-content:center;gap:4px;border:1px solid #334155}
.ins-btn:active{transform:scale(.96)}
.ins-btn:hover{background:#334155;transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.3)}
.ins-blue{background:#1d4ed8;border-color:#2563eb;color:#dbeafe}
.ins-blue:hover{background:#2563eb}
.ins-green{background:#065f46;border-color:#059669;color:#d1fae5}
.ins-green:hover{background:#059669}
.ins-red{background:#7f1d1d;border-color:#dc2626;color:#fee2e2}
.ins-red:hover{background:#991b1b}
.ins-purple{background:#581c87;border-color:#7c3aed;color:#ede9fe}
.ins-purple:hover{background:#6d28d9}
.ins-orange{background:#7c2d12;border-color:#ea580c;color:#ffedd5}
.ins-orange:hover{background:#9a3412}
.ins-teal{background:#115e59;border-color:#0d9488;color:#ccfbf1}
.ins-teal:hover{background:#134e4a}
.ins-gray{background:#1e293b;border-color:#475569;color:#94a3b8}
.ins-gray:hover{background:#334155}

.ins-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid #334155;background:#020617;color:#f8fafc;margin:6px 0;font-size:12px;outline:none;transition:.15s}
.ins-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
.ins-input::placeholder{color:#475569}

.ins-select{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:11px;outline:none;cursor:pointer}

.ins-scroll{max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-bottom:80px}

.ins-card{background:linear-gradient(145deg,#111827,#0f172a);border:1px solid #1e293b;border-radius:14px;padding:14px;margin:10px 0;word-break:break-all;animation:insFadeIn .35s ease;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.ins-card:hover{border-color:#334155}

.ins-pre{white-space:pre-wrap;background:#020617;border-radius:10px;padding:12px;max-height:260px;overflow:auto;-webkit-overflow-scrolling:touch;color:#cbd5e1;font-family:'JetBrains Mono','Fira Code',Consolas,monospace;font-size:11px;border:1px solid #1e293b;line-height:1.6}
.ins-pre::-webkit-scrollbar{width:5px}
.ins-pre::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}

.ins-small{color:#64748b;font-size:11px;margin-top:4px;line-height:1.5}
.ins-url{color:#60a5fa;font-weight:600;font-size:12px;word-break:break-all}
.ins-url:hover{color:#93c5fd;text-decoration:underline;cursor:pointer}

.ins-pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;background:#1e293b;margin:2px;font-size:11px;font-weight:700;border:1px solid #334155;gap:4px}
.ins-pill.m-get{background:#064e3b;color:#34d399;border-color:#065f46}
.ins-pill.m-post{background:#1e3a8a;color:#60a5fa;border-color:#1e40af}
.ins-pill.m-put{background:#713f12;color:#fbbf24;border-color:#854d0e}
.ins-pill.m-delete{background:#7f1d1d;color:#f87171;border-color:#991b1b}
.ins-pill.m-patch{background:#581c87;color:#c4b5fd;border-color:#7c3aed}
.ins-pill.m-options{background:#374151;color:#d1d5db;border-color:#4b5563}
.ins-pill.ok{background:#064e3b;color:#34d399}
.ins-pill.err{background:#7f1d1d;color:#f87171}
.ins-pill.warn{background:#713f12;color:#fbbf24}
.ins-pill.info{background:#1e3a8a;color:#60a5fa}

.ins-row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.ins-stat{background:linear-gradient(145deg,#111827,#0f172a);border:1px solid #1e293b;border-radius:10px;padding:10px;text-align:center;transition:.15s}
.ins-stat:hover{border-color:#334155}
.ins-stat-val{font-size:18px;font-weight:900;color:#60a5fa;line-height:1.2}
.ins-stat-label{font-size:10px;color:#475569;margin-top:4px;text-transform:uppercase;letter-spacing:.5px}

.ins-detector{display:flex;align-items:center;gap:12px;background:linear-gradient(145deg,#111827,#0f172a);border:1px solid #1e293b;border-radius:12px;padding:12px;margin-bottom:8px;animation:insSlideIn .3s ease;transition:.15s}
.ins-detector:hover{border-color:#334155;transform:translateX(2px)}
.ins-detector-icon{font-size:22px;filter:grayscale(.3)}
.ins-detector-info{flex:1;min-width:0}
.ins-detector-name{font-weight:800;color:#e2e8f0;font-size:13px;margin-bottom:2px}
.ins-detector-val{color:#94a3b8;font-size:11px;word-break:break-all;font-family:'JetBrains Mono',monospace;background:#020617;padding:4px 8px;border-radius:6px;border:1px solid #1e293b}

.ins-footer{display:flex;justify-content:space-between;align-items:center;padding:10px 0;color:#475569;font-size:10px;border-top:1px solid #1e293b;margin-top:12px;letter-spacing:.3px}
.ins-footer a{color:#60a5fa;text-decoration:none;font-weight:700}
.ins-footer a:hover{color:#93c5fd}

.ins-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:#1e293b;color:#94a3b8;font-size:10px;font-weight:700;margin-left:6px;border:1px solid #334155}

.ins-empty{text-align:center;padding:40px 20px;color:#475569;font-size:13px}
.ins-empty::before{content:"📭";display:block;font-size:32px;margin-bottom:8px;opacity:.5}

.ins-toggle{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#111827;border-radius:10px;border:1px solid #1e293b;margin:4px 0;cursor:pointer;transition:.15s}
.ins-toggle:hover{background:#1e293b}
.ins-toggle-switch{width:36px;height:20px;background:#334155;border-radius:999px;position:relative;transition:.2s;flex-shrink:0}
.ins-toggle-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;background:#94a3b8;border-radius:50%;transition:.2s}
.ins-toggle.active .ins-toggle-switch{background:#059669}
.ins-toggle.active .ins-toggle-switch::after{left:18px;background:#fff}
.ins-toggle-label{font-size:12px;font-weight:700;color:#e2e8f0}
.ins-toggle-desc{font-size:10px;color:#64748b}

.ins-section-title{font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px;padding-bottom:4px;border-bottom:1px solid #1e293b}

.ins-timing-bar{display:flex;height:6px;border-radius:3px;overflow:hidden;background:#1e293b;margin:6px 0}
.ins-timing-segment{height:100%}
.ins-timing-legend{display:flex;flex-wrap:wrap;gap:8px;font-size:10px;margin-top:4px}
.ins-timing-legend span{display:flex;align-items:center;gap:3px}
.ins-timing-dot{width:8px;height:8px;border-radius:2px;display:inline-block}

.ins-accordion{border:1px solid #1e293b;border-radius:10px;overflow:hidden;margin:6px 0;background:#0f172a}
.ins-accordion-head{padding:8px 12px;background:#111827;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:#94a3b8;transition:.15s}
.ins-accordion-head:hover{background:#1e293b;color:#e2e8f0}
.ins-accordion-body{padding:10px 12px;display:none;background:#020617}
.ins-accordion.open .ins-accordion-body{display:block}
.ins-accordion-head::after{content:"▸";font-size:14px;transition:.2s}
.ins-accordion.open .ins-accordion-head::after{transform:rotate(90deg)}

.ins-console-line{padding:6px 10px;border-radius:6px;margin-bottom:3px;font-size:12px;display:flex;gap:8px;border-left:3px solid transparent;animation:insFadeIn .2s ease}
.ins-console-line.log{border-left-color:#475569}
.ins-console-line.warn{border-left-color:#eab308;background:rgba(234,179,8,.06)}
.ins-console-line.error{border-left-color:#ef4444;background:rgba(239,68,68,.08)}
.ins-console-line.info{border-left-color:#3b82f6;background:rgba(59,130,246,.06)}
.ins-console-time{color:#475569;font-family:'JetBrains Mono',monospace;font-size:10px;flex-shrink:0;padding-top:1px}
.ins-console-msg{flex:1;word-break:break-all;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5}
.ins-console-msg .json-key{color:#93c5fd}
.ins-console-msg .json-string{color:#a5f3fc}
.ins-console-msg .json-number{color:#fcd34d}
.ins-console-msg .json-boolean{color:#f472b6}
.ins-console-msg .json-null{color:#94a3b8}

.ins-sponsor{background:linear-gradient(135deg,#111827,#0f172a);border-color:#2563eb!important}
.ins-sponsor .ins-title{color:#60a5fa}

.ins-live-indicator{display:inline-flex;align-items:center;gap:6px}
.ins-live-indicator::before{content:"";width:6px;height:6px;border-radius:50%;background:#10b981;animation:insPulse 2s infinite}
.ins-live-indicator.off::before{background:#ef4444;animation:none}

.ins-drag-handle{cursor:grab;padding:8px;background:#111827;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px;color:#475569;font-size:11px;font-weight:700;border:1px dashed #334155}
.ins-drag-handle:active{cursor:grabbing}
</style>`;

    // ─── HELPERS ───
    function showEruda() {
      const e = D.getElementById('eruda');
      if (e) { e.style.display = 'block'; e.style.zIndex = '2147483647'; }
      try { eruda.show(); } catch (_) {}
    }

    function selector(el) {
      if (!el) return '';
      if (el.id) return '#' + CSS.escape(el.id);
      const out = [];
      while (el && el.nodeType === 1 && el !== D.body) {
        let s = el.tagName.toLowerCase();
        if (el.className && typeof el.className === 'string') {
          s += '.' + el.className.trim().split(/\s+/).slice(0, 2).map(x => CSS.escape(x)).join('.');
        }
        const n = [...el.parentNode.children].filter(x => x.tagName === el.tagName).indexOf(el) + 1;
        s += `:nth-of-type(${n})`;
        out.unshift(s);
        el = el.parentElement;
      }
      return out.join(' > ');
    }

    function detectSecrets(text) {
      const found = [];
      const patterns = [
        { name: 'JWT Token', icon: '🔐', regex: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g },
        { name: 'Bearer Token', icon: '🛡️', regex: /Bearer\s+[a-zA-Z0-9_\-\.]+/gi },
        { name: 'AWS Access Key', icon: '☁️', regex: /AKIA[0-9A-Z]{16}/g },
        { name: 'AWS Secret Key', icon: '🔑', regex: /[A-Za-z0-9/+=]{40}/g },
        { name: 'GitHub Token', icon: '🐙', regex: /ghp_[a-zA-Z0-9]{36}/g },
        { name: 'GitHub Gist', icon: '📝', regex: /gho_[a-zA-Z0-9]{36}/g },
        { name: 'Firebase Key', icon: '🔥', regex: /AIza[0-9A-Za-z_-]{35}/g },
        { name: 'Google API Key', icon: '🔍', regex: /AIza[0-9A-Za-z_-]{35}/g },
        { name: 'Private Key', icon: '🔒', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },
        { name: 'Stripe Key', icon: '💳', regex: /sk_(live|test)_[0-9a-zA-Z]{24,}/g },
        { name: 'Stripe Publishable', icon: '💳', regex: /pk_(live|test)_[0-9a-zA-Z]{24,}/g },
        { name: 'Slack Token', icon: '💬', regex: /xox[baprs]-[0-9a-zA-Z-]+/g },
        { name: 'Slack Webhook', icon: '🔗', regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g },
        { name: 'Telegram Bot', icon: '🤖', regex: /[0-9]+:[A-Za-z0-9_-]{35}/g },
        { name: 'Mailgun API', icon: '📧', regex: /key-[0-9a-f]{32}/g },
        { name: 'SendGrid API', icon: '📨', regex: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g },
        { name: 'Twilio SID', icon: '📞', regex: /AC[a-zA-Z0-9]{32}/g },
        { name: 'Twilio Auth', icon: '🔐', regex: /[a-zA-Z0-9]{32}/g },
        { name: 'Heroku API', icon: '🚀', regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g },
        { name: 'Facebook Token', icon: '👤', regex: /EAACEdEose0cBA[0-9A-Za-z]+/g },
        { name: 'Twitter Bearer', icon: '🐦', regex: /AAAA[0-9A-Za-z%\-]+/g },
        { name: 'Instagram Token', icon: '📸', regex: /IGQW[0-9A-Za-z\-_]+/g },
        { name: 'LinkedIn Token', icon: '💼', regex: /AQV[0-9A-Za-z\-_]+/g },
        { name: 'Dropbox Token', icon: '📦', regex: /sl\.[a-zA-Z0-9_-]+/g },
        { name: 'PayPal Token', icon: '💰', regex: /access_token\$production\$[0-9a-z]{32}\$[0-9a-f]{32}/g },
        { name: 'Square Token', icon: '💵', regex: /sq0atp-[0-9A-Za-z_-]{22}/g },
        { name: 'Shopify Token', icon: '🛒', regex: /shpat_[a-fA-F0-9]{32}/g },
        { name: 'GitLab Token', icon: '🦊', regex: /glpat-[0-9a-zA-Z_-]{20}/g },
        { name: 'NPM Token', icon: '📦', regex: /npm_[0-9A-Za-z]{36}/g },
        { name: 'Docker Token', icon: '🐳', regex: /dckr_pat_[0-9A-Za-z_-]{43}/g },
        { name: 'OpenAI API', icon: '🧠', regex: /sk-[a-zA-Z0-9]{48}/g },
        { name: 'Anthropic API', icon: '🤖', regex: /sk-ant-[a-zA-Z0-9_-]{32,}/g },
        { name: 'Mapbox Token', icon: '🗺️', regex: /pk\.eyJ1Ijoi[0-9A-Za-z_-]+/g },
        { name: 'Algolia Key', icon: '🔍', regex: /[0-9a-f]{32}/g },
        { name: 'API Key Generic', icon: '🔑', regex: /[a-zA-Z0-9_-]{32,64}/g },
        { name: 'Password/Secret', icon: '🗝️', regex: /(password|secret|token|api[_-]?key|auth[_-]?token|bearer)\s*[:=]\s*["\'][^"\']{8,}["\']/gi },
        { name: 'Authorization Header', icon: '📋', regex: /Authorization\s*:\s*[^\r\n]+/gi },
        { name: 'Cookie Session', icon: '🍪', regex: /session=[a-zA-Z0-9%_-]{20,}/g },
        { name: 'CSRF Token', icon: '🛡️', regex: /csrf[_-]?token["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{10,}/gi },
        { name: 'IP Address', icon: '🌐', regex: /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g },
        { name: 'Email', icon: '📧', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
        { name: 'URL Endpoint', icon: '🔗', regex: /https?:\/\/[^\s"]+/g },
        { name: 'Base64 String', icon: '📜', regex: /[A-Za-z0-9+/]{40,}={0,2}/g },
        { name: 'Hex String', icon: '🔢', regex: /\b[a-f0-9]{32,}\b/gi }
      ];
      patterns.forEach(p => {
        const matches = text.match(p.regex) || [];
        matches.forEach(m => { if (m.length > 5 && !found.some(f => f.value === m)) found.push({ ...p, value: m }); });
      });
      return found;
    }

    // ─── PATCH CONSOLE ───
    if (!W.__INS_PATCHED__) {
      W.__INS_PATCHED__ = true;

      ['log','warn','error','info','debug'].forEach(method => {
        const orig = console[method];
        console[method] = (...args) => {
          const msg = args.map(a => {
            if (a === null) return 'null';
            if (a === undefined) return 'undefined';
            if (typeof a === 'object') {
              try { return JSON.stringify(a); } catch (_) { return String(a); }
            }
            return String(a);
          }).join(' ');
          S().console.push({ type: method === 'log' ? 'log' : method, msg, time: new Date().toLocaleTimeString('id-ID', {hour12:false}) });
          if (S().console.length > 300) S().console.shift();
          orig.apply(console, args);
        };
      });

      // ─── PATCH FETCH ───
      const oldFetch = W.fetch;
      W.fetch = async (...args) => {
        const started = performance.now();
        const input = args[0];
        const opt = args[1] || {};
        const url = String(input?.url || input);
        const method = opt.method || input?.method || 'GET';
        let reqHeaders = { ...headersToObj(input?.headers), ...headersToObj(opt.headers) };
        const reqBody = opt.body ? String(opt.body).slice(0, 8000) : '';

        // Inject Random IP if enabled
        if (S().randomIP) {
          const ip = randomIP.get();
          reqHeaders['X-Forwarded-For'] = ip;
          reqHeaders['X-Real-IP'] = ip;
          reqHeaders['CF-Connecting-IP'] = ip;
          reqHeaders['True-Client-IP'] = ip;
          opt.headers = reqHeaders;
        }

        // Resource timing
        let timing = { dns: 0, tcp: 0, ssl: 0, ttfb: 0, download: 0, total: 0 };
        const perfEntryName = url.split('?')[0];

        try {
          const res = await oldFetch(...args);
          try {
            const c = res.clone();
            const ct = c.headers.get('content-type') || '';
            const body = await c.text();
            const resHeaders = {};
            c.headers.forEach((v, k) => resHeaders[k] = v);

            // Get timing from Performance API
            setTimeout(() => {
              const entries = performance.getEntriesByName(perfEntryName, 'resource');
              const entry = entries[entries.length - 1];
              if (entry) {
                timing = {
                  dns: Math.round(entry.domainLookupEnd - entry.domainLookupStart),
                  tcp: Math.round(entry.connectEnd - entry.connectStart),
                  ssl: Math.round(entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0),
                  ttfb: Math.round(entry.responseStart - entry.startTime),
                  download: Math.round(entry.responseEnd - entry.responseStart),
                  total: Math.round(entry.duration)
                };
              }
            }, 100);

            const logEntry = {
              id: Date.now() + Math.random(),
              type: 'fetch',
              url,
              method,
              status: res.status,
              ok: res.ok,
              ct,
              time: new Date().toLocaleTimeString('id-ID', {hour12:false}),
              duration: Math.round(performance.now() - started),
              requestHeaders: reqHeaders,
              responseHeaders: resHeaders,
              requestBody: reqBody,
              body: body.slice(0, 15000),
              bodySize: body.length,
              requestSize: reqBody.length,
              timing
            };
            S().logs.push(logEntry);
            if (S().logs.length > S().maxLogs) S().logs.shift();
          } catch (_) {}
          return res;
        } catch (err) {
          S().logs.push({
            id: Date.now() + Math.random(),
            type: 'fetch',
            url,
            method,
            status: 0,
            ok: false,
            ct: '',
            time: new Date().toLocaleTimeString('id-ID', {hour12:false}),
            duration: Math.round(performance.now() - started),
            requestHeaders: reqHeaders,
            responseHeaders: {},
            requestBody: reqBody,
            body: 'Error: ' + err.message,
            bodySize: 0,
            requestSize: reqBody.length,
            timing: { dns: 0, tcp: 0, ssl: 0, ttfb: 0, download: 0, total: 0 }
          });
          throw err;
        }
      };

      // ─── PATCH XHR ───
      const xo = XMLHttpRequest.prototype.open;
      const xs = XMLHttpRequest.prototype.send;
      const xh = XMLHttpRequest.prototype.setRequestHeader;

      XMLHttpRequest.prototype.open = function (m, u) {
        this.__ins_m = m;
        this.__ins_u = u;
        this.__ins_headers = {};
        this.__ins_started = performance.now();
        return xo.apply(this, arguments);
      };

      XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
        try { this.__ins_headers[k] = v; } catch (_) {}
        return xh.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function (body) {
        // Inject Random IP if enabled
        if (S().randomIP) {
          const ip = randomIP.get();
          try {
            xh.call(this, 'X-Forwarded-For', ip);
            xh.call(this, 'X-Real-IP', ip);
          } catch (_) {}
        }

        this.addEventListener('loadend', () => {
          try {
            const raw = this.getAllResponseHeaders() || '';
            const responseHeaders = {};
            raw.trim().split(/[\r\n]+/).forEach(line => {
              const i = line.indexOf(':');
              if (i > -1) responseHeaders[line.slice(0, i).trim()] = line.slice(i + 1).trim();
            });

            const resBody = String(this.responseText || '');
            const reqBody = body ? String(body).slice(0, 8000) : '';

            S().logs.push({
              id: Date.now() + Math.random(),
              type: 'xhr',
              url: this.__ins_u,
              method: this.__ins_m,
              status: this.status,
              ok: this.status >= 200 && this.status < 300,
              ct: this.getResponseHeader('content-type') || '',
              time: new Date().toLocaleTimeString('id-ID', {hour12:false}),
              duration: Math.round(performance.now() - this.__ins_started),
              requestHeaders: this.__ins_headers || {},
              responseHeaders,
              requestBody: reqBody,
              body: resBody.slice(0, 15000),
              bodySize: resBody.length,
              requestSize: reqBody.length,
              timing: { dns: 0, tcp: 0, ssl: 0, ttfb: 0, download: 0, total: 0 }
            });
            if (S().logs.length > S().maxLogs) S().logs.shift();
          } catch (_) {}
        });
        return xs.apply(this, arguments);
      };

      // ─── ELEMENT PICKER ───
      D.addEventListener('click', e => {
        if (!S().pick) return;
        e.preventDefault();
        e.stopPropagation();
        const s = selector(e.target);
        S().pick = false;
        copy(s);
        showEruda();
        console.log('[INS] Selector:', s);
      }, true);
    }

    // ─── TOOL FACTORY ───
    function addTool(name, render, realtime) {
      class T extends eruda.Tool {
        constructor() { super(); this.name = name; this.timer = null; }
        init($el) { super.init($el); this._$el = $el; this.refresh(); }
        show() { super.show(); this.refresh(); if (realtime && !this.timer) this.timer = setInterval(() => { if (S().live) this.refresh(); }, 800); }
        hide() { super.hide(); if (this.timer) { clearInterval(this.timer); this.timer = null; } }
        refresh() { if (this._$el) this._$el.html(render()); }
      }
      try { eruda.add(new T()); } catch (_) {}
    }

    // ─── GLOBAL ACTIONS ───
    W.__INS_SET_FILTER__ = v => { S().filter = v || ''; try { eruda.get('network').refresh(); } catch (_) {} };
    W.__INS_TOGGLE_LIVE__ = () => { S().live = !S().live; try { eruda.get('network').refresh(); } catch (_) {} };
    W.__INS_TOGGLE_IP__ = () => { S().randomIP = !S().randomIP; try { eruda.get('network').refresh(); } catch (_) {} };
    W.__INS_SET_IP_MODE__ = m => { S().randomIPMode = m; };
    W.__INS_CLEAR_LOGS__ = () => { S().logs = []; try { eruda.get('network').refresh(); } catch (_) {} };
    W.__INS_COPY__ = copy;
    W.__INS_TOAST__ = toast;

    // ─── CODE GENERATORS ───
    W.__INS_FETCH_CODE__ = i => {
      const x = S().logs[i]; if (!x) return;
      copy(`fetch(${JSON.stringify(x.url)}, {\n  method: ${JSON.stringify(x.method)},\n  headers: ${JSON.stringify(x.requestHeaders || {}, null, 2)}${x.requestBody ? `,\n  body: ${JSON.stringify(x.requestBody)}` : ''}\n})\n.then(r => r.text())\n.then(console.log);`);
    };

    W.__INS_AXIOS_CODE__ = i => {
      const x = S().logs[i]; if (!x) return;
      copy(`import axios from 'axios';\n\naxios({\n  method: ${JSON.stringify(String(x.method).toLowerCase())},\n  url: ${JSON.stringify(x.url)},\n  headers: ${JSON.stringify(x.requestHeaders || {}, null, 2)}${x.requestBody ? `,\n  data: ${JSON.stringify(x.requestBody)}` : ''}\n}).then(r => console.log(r.data));`);
    };

    W.__INS_CURL_CODE__ = i => {
      const x = S().logs[i]; if (!x) return;
      const hs = Object.entries(x.requestHeaders || {}).map(([k, v]) => ` \\n  -H ${JSON.stringify(k + ': ' + v)}`).join('');
      copy(`curl -L ${JSON.stringify(x.url)} \\n  -X ${JSON.stringify(x.method)}${hs}${x.requestBody ? ` \\n  --data-raw ${JSON.stringify(x.requestBody)}` : ''}`);
    };

    W.__INS_PYTHON_CODE__ = i => {
      const x = S().logs[i]; if (!x) return;
      copy(`import requests\n\nresponse = requests.${String(x.method).toLowerCase()}(\n    ${JSON.stringify(x.url)},\n    headers=${JSON.stringify(x.requestHeaders || {}, null, 4)}${x.requestBody ? `,\n    data=${JSON.stringify(x.requestBody)}` : ''}\n)\nprint(response.text)`);
    };

    W.__INS_POWERSHELL_CODE__ = i => {
      const x = S().logs[i]; if (!x) return;
      const hs = Object.entries(x.requestHeaders || {}).map(([k, v]) => `\\n    -Headers @{'${k}'='${v}'}`).join('');
      copy(`Invoke-WebRequest -Uri ${JSON.stringify(x.url)} -Method ${x.method}${hs}${x.requestBody ? `\\n    -Body ${JSON.stringify(x.requestBody)}` : ''}`);
    };

    W.__INS_EXPORT_HAR__ = () => {
      const har = {
        log: {
          version: '1.2',
          creator: { name: 'INS IT Developer Tools', version: '6.0' },
          entries: S().logs.map(x => ({
            startedDateTime: new Date().toISOString(),
            time: x.duration,
            request: {
              method: x.method,
              url: x.url,
              headers: Object.entries(x.requestHeaders || {}).map(([name, value]) => ({ name, value })),
              postData: x.requestBody ? { mimeType: x.ct || 'application/octet-stream', text: x.requestBody } : undefined
            },
            response: {
              status: x.status,
              statusText: x.ok ? 'OK' : 'Error',
              headers: Object.entries(x.responseHeaders || {}).map(([name, value]) => ({ name, value })),
              content: { size: x.bodySize, mimeType: x.ct || 'text/plain', text: x.body }
            },
            timings: {
              dns: x.timing?.dns || -1,
              connect: x.timing?.tcp || -1,
              ssl: x.timing?.ssl || -1,
              wait: x.timing?.ttfb || -1,
              receive: x.timing?.download || -1
            }
          }))
        }
      };
      copy(JSON.stringify(har, null, 2));
      toast('HAR exported to clipboard!');
    };

    // ─── TOOL 1: SCRAPER ───
    addTool('scraper', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🔧 INS Scraper</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-blue" onclick="S().pick=true;document.getElementById('eruda').style.display='none';__INS_TOAST__('Tap elemen target')">🎯 Pick Selector</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY__([...document.querySelectorAll('a')].map(a=>a.href).filter(Boolean).join('\\n'))">🔗 All Links</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY__([...document.images].map(i=>i.src).filter(Boolean).join('\\n'))">🖼 All Images</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(document.documentElement.outerHTML)">📄 Full HTML</button>
      <button class="ins-btn ins-teal" onclick="__INS_COPY__([...document.querySelectorAll('script')].map(s=>s.src).filter(Boolean).join('\\n'))">📜 Ext Scripts</button>
      <button class="ins-btn ins-gray" onclick="__INS_COPY__([...document.querySelectorAll('link[rel=stylesheet]').map(l=>l.href).filter(Boolean).join('\\n'))">🎨 Ext CSS</button>
    </div>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">📄 Page Info</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
      <div><span style="color:#64748b">Title:</span> <span style="color:#e2e8f0;font-weight:600">${esc(D.title)}</span></div>
      <div><span style="color:#64748b">URL:</span> <span class="ins-url">${esc(location.href)}</span></div>
      <div><span style="color:#64748b">Origin:</span> <span style="color:#e2e8f0">${esc(location.origin)}</span></div>
      <div><span style="color:#64748b">Viewport:</span> <span style="color:#e2e8f0">${esc(W.innerWidth + 'x' + W.innerHeight)}</span></div>
      <div><span style="color:#64748b">Referrer:</span> <span style="color:#e2e8f0">${esc(D.referrer || 'none')}</span></div>
      <div><span style="color:#64748b">Charset:</span> <span style="color:#e2e8f0">${esc(D.characterSet)}</span></div>
    </div>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">📊 DOM Statistics</div>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('*')].length)}</div><div class="ins-stat-label">Elements</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.scripts].length)}</div><div class="ins-stat-label">Scripts</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('style,link[rel=stylesheet]').length)}</div><div class="ins-stat-label">Styles</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.images].length)}</div><div class="ins-stat-label">Images</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('a').length)}</div><div class="ins-stat-label">Links</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('iframe').length)}</div><div class="ins-stat-label">Iframes</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('video').length)}</div><div class="ins-stat-label">Videos</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('audio').length)}</div><div class="ins-stat-label">Audio</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('canvas').length)}</div><div class="ins-stat-label">Canvas</div></div>
    </div>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">📝 Forms</div>
    ${[...D.querySelectorAll('form')].map((f, i) => `
      <div style="padding:8px;border-bottom:1px solid #1e293b;font-size:12px">
        <span style="color:#60a5fa;font-weight:700">#${i}</span>
        <span style="color:#94a3b8">${esc(f.method || 'GET')}</span> →
        <span class="ins-url">${esc(f.action || location.href)}</span>
        <div style="color:#475569;font-size:10px;margin-top:2px">${esc([...f.querySelectorAll('input,textarea,select')].map(el => el.name || el.id || el.tagName.toLowerCase()).join(', '))}</div>
      </div>
    `).join('') || '<div class="ins-empty">No forms detected</div>'}
  </div>
  <div class="ins-card">
    <div class="ins-section-title">📜 JSON-LD / Structured Data</div>
    ${[...D.querySelectorAll('script[type="application/ld+json"]')].map((s, i) => `
      <div class="ins-accordion">
        <div class="ins-accordion-head" onclick="this.parentElement.classList.toggle('open')">Script #${i} — ${s.textContent.length} chars</div>
        <div class="ins-accordion-body"><pre class="ins-pre">${esc(s.textContent.slice(0, 1000))}</pre></div>
      </div>
    `).join('') || '<div class="ins-empty">No structured data</div>'}
  </div>
</div>`);

    // ─── TOOL 2: NETWORK (Complete Headers + Timing + Random IP) ───
    addTool('network', () => {
      const q = (S().filter || '').toLowerCase();
      const logs = S().logs
        .map((x, i) => ({ ...x, i }))
        .filter(x => !q || [
          x.url, x.method, x.status, x.ct, x.body, x.type,
          JSON.stringify(x.requestHeaders || {}),
          JSON.stringify(x.responseHeaders || {})
        ].join(' ').toLowerCase().includes(q))
        .slice(-150)
        .reverse();

      const formatSize = b => {
        if (!b || b === 0) return '0 B';
        if (b < 1024) return b + ' B';
        if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
        return (b / (1024 * 1024)).toFixed(2) + ' MB';
      };

      const timingBar = t => {
        if (!t || t.total === 0) return '';
        const total = Math.max(t.total, 1);
        const dnsPct = Math.max((t.dns / total) * 100, 0);
        const tcpPct = Math.max((t.tcp / total) * 100, 0);
        const sslPct = Math.max((t.ssl / total) * 100, 0);
        const ttfbPct = Math.max((t.ttfb / total) * 100, 0);
        const dlPct = Math.max((t.download / total) * 100, 0);
        return `
          <div class="ins-timing-bar">
            <div class="ins-timing-segment" style="width:${dnsPct}%;background:#3b82f6"></div>
            <div class="ins-timing-segment" style="width:${tcpPct}%;background:#10b981"></div>
            <div class="ins-timing-segment" style="width:${sslPct}%;background:#f59e0b"></div>
            <div class="ins-timing-segment" style="width:${ttfbPct}%;background:#8b5cf6"></div>
            <div class="ins-timing-segment" style="width:${dlPct}%;background:#ef4444"></div>
          </div>
          <div class="ins-timing-legend">
            <span><span class="ins-timing-dot" style="background:#3b82f6"></span>DNS ${t.dns}ms</span>
            <span><span class="ins-timing-dot" style="background:#10b981"></span>TCP ${t.tcp}ms</span>
            <span><span class="ins-timing-dot" style="background:#f59e0b"></span>SSL ${t.ssl}ms</span>
            <span><span class="ins-timing-dot" style="background:#8b5cf6"></span>TTFB ${t.ttfb}ms</span>
            <span><span class="ins-timing-dot" style="background:#ef4444"></span>DL ${t.download}ms</span>
          </div>
        `;
      };

      const headerSection = (title, headers) => {
        const entries = Object.entries(headers || {});
        if (!entries.length) return '';
        return `
          <div class="ins-accordion">
            <div class="ins-accordion-head" onclick="this.parentElement.classList.toggle('open')">${esc(title)} (${entries.length})</div>
            <div class="ins-accordion-body">
              <table style="width:100%;border-collapse:collapse;font-size:11px">
                ${entries.map(([k, v]) => `
                  <tr style="border-bottom:1px solid #1e293b">
                    <td style="padding:6px 8px;color:#93c5fd;font-weight:600;vertical-align:top;white-space:nowrap">${esc(k)}</td>
                    <td style="padding:6px 8px;color:#e2e8f0;word-break:break-all">${esc(v)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        `;
      };

      return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🌐 Network Monitor</h2>

    <div class="ins-toggle ${S().randomIP ? 'active' : ''}" onclick="__INS_TOGGLE_IP__();this.classList.toggle('active')">
      <div class="ins-toggle-switch"></div>
      <div>
        <div class="ins-toggle-label">🎲 Random IP ${S().randomIP ? 'ON' : 'OFF'}</div>
        <div class="ins-toggle-desc">Inject X-Forwarded-For, X-Real-IP, CF-Connecting-IP</div>
      </div>
    </div>

    ${S().randomIP ? `
    <div style="margin:6px 0">
      <select class="ins-select" onchange="__INS_SET_IP_MODE__(this.value)">
        <option value="ipv4" ${S().randomIPMode === 'ipv4' ? 'selected' : ''}>🌐 IPv4 Only</option>
        <option value="ipv6" ${S().randomIPMode === 'ipv6' ? 'selected' : ''}>🌐 IPv6 Only</option>
        <option value="mixed" ${S().randomIPMode === 'mixed' ? 'selected' : ''}>🌐 Mixed (IPv4/IPv6)</option>
      </select>
      <div class="ins-small">Current IP: ${esc(randomIP.get())}</div>
    </div>
    ` : ''}

    <input class="ins-input" placeholder="Search: api, json, xhr, fetch, mp4, m3u8, auth, token, header..." value="${esc(S().filter)}" oninput="__INS_SET_FILTER__(this.value)">

    <div class="ins-grid">
      <button class="ins-btn ${S().live ? 'ins-green' : 'ins-red'}" onclick="__INS_TOGGLE_LIVE__()">
        <span class="ins-live-indicator ${S().live ? '' : 'off'}"></span> ${S().live ? 'Live' : 'Paused'}
      </button>
      <button class="ins-btn ins-purple" onclick="__INS_EXPORT_HAR__()">📋 Export HAR</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(JSON.stringify(S().logs,null,2))">📄 Export JSON</button>
      <button class="ins-btn ins-red" onclick="__INS_CLEAR_LOGS__()">🧹 Clear</button>
    </div>

    <div class="ins-small" style="display:flex;gap:12px;margin-top:6px">
      <span>Total: <b>${S().logs.length}</b></span>
      <span>Shown: <b>${logs.length}</b></span>
      <span>Max: <b>${S().maxLogs}</b></span>
    </div>
  </div>

  <div class="ins-scroll">
    ${logs.map(x => `
      <div class="ins-card">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
          <span class="ins-pill m-${esc(x.method.toLowerCase())}">${esc(x.method)}</span>
          <span class="ins-pill ${x.ok ? 'ok' : 'err'}">${esc(x.status)}</span>
          <span class="ins-pill">${esc(x.type)}</span>
          <span class="ins-pill">${esc(x.duration)}ms</span>
          <span class="ins-pill">↑${esc(formatSize(x.requestSize))}</span>
          <span class="ins-pill">↓${esc(formatSize(x.bodySize))}</span>
          <span class="ins-pill">${esc(x.time)}</span>
        </div>

        <div class="ins-url">${esc(x.url)}</div>
        <div class="ins-small">${esc(x.ct || '')}</div>

        ${timingBar(x.timing)}

        <div class="ins-row">
          <button class="ins-btn ins-blue" onclick="__INS_FETCH_CODE__(${x.i})">JS fetch</button>
          <button class="ins-btn ins-purple" onclick="__INS_AXIOS_CODE__(${x.i})">Axios</button>
          <button class="ins-btn ins-orange" onclick="__INS_CURL_CODE__(${x.i})">cURL</button>
          <button class="ins-btn ins-teal" onclick="__INS_PYTHON_CODE__(${x.i})">Python</button>
          <button class="ins-btn ins-gray" onclick="__INS_POWERSHELL_CODE__(${x.i})">PowerShell</button>
          <button class="ins-btn ins-green" onclick="__INS_COPY__(${JSON.stringify(x.body)})">Copy Body</button>
        </div>

        ${headerSection('📤 Request Headers', x.requestHeaders)}
        ${headerSection('📥 Response Headers', x.responseHeaders)}

        ${x.requestBody ? `
        <div class="ins-accordion">
          <div class="ins-accordion-head" onclick="this.parentElement.classList.toggle('open')">📦 Request Body (${esc(formatSize(x.requestSize))})</div>
          <div class="ins-accordion-body"><pre class="ins-pre">${esc(x.requestBody)}</pre></div>
        </div>
        ` : ''}

        <div class="ins-accordion">
          <div class="ins-accordion-head" onclick="this.parentElement.classList.toggle('open')">📦 Response Body (${esc(formatSize(x.bodySize))})</div>
          <div class="ins-accordion-body"><pre class="ins-pre">${esc(x.body).slice(0, 2500)}${x.body.length > 2500 ? '...' : ''}</pre></div>
        </div>
      </div>
    `).join('') || '<div class="ins-empty">Belum ada request. Klik Reload atau navigasi halaman.</div>'}
  </div>
</div>`;
    }, true);

    // ─── TOOL 3: STORAGE ───
    addTool('storage', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">💾 Storage Inspector</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-orange" onclick="__INS_COPY__(document.cookie)">🍪 Copy Cookies</button>
      <button class="ins-btn ins-blue" onclick="__INS_COPY__(JSON.stringify(localStorage,null,2))">💾 LocalStorage</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY__(JSON.stringify(sessionStorage,null,2))">📂 SessionStorage</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(JSON.stringify({indexedDB: 'Use DevTools > Application > IndexedDB'},null,2))">🗄 IndexedDB</button>
    </div>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">🍪 Cookies (${esc((D.cookie || '').split(';').filter(Boolean).length)})</div>
    <pre class="ins-pre">${esc(D.cookie || 'none')}</pre>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">💾 LocalStorage (${esc(Object.keys(localStorage).length)} items)</div>
    <pre class="ins-pre">${esc(JSON.stringify({...localStorage}, null, 2))}</pre>
  </div>
  <div class="ins-card">
    <div class="ins-section-title">📂 SessionStorage (${esc(Object.keys(sessionStorage).length)} items)</div>
    <pre class="ins-pre">${esc(JSON.stringify({...sessionStorage}, null, 2))}</pre>
  </div>
</div>`);

    // ─── TOOL 4: EXTRACTOR ───
    addTool('extractor', () => {
      const urls = [...D.querySelectorAll('script,img,video,audio,source,link,a,iframe')]
        .map(x => x.src || x.href)
        .filter(Boolean);
      const js = urls.filter(u => /\.js(\?|$)/i.test(u));
      const css = urls.filter(u => /\.css(\?|$)/i.test(u));
      const media = urls.filter(u => /\.(mp4|m3u8|mp3|webm|ogg|wav|jpg|jpeg|png|webp|gif|svg|ico)(\?|$)/i.test(u));
      const json = urls.filter(u => /\.json(\?|$)/i.test(u));
      const fonts = urls.filter(u => /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(u));

      return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">📥 Resource Extractor</h2>
    <div class="ins-grid4">
      <button class="ins-btn ins-green" onclick="__INS_COPY__(${JSON.stringify(urls.join('\n'))})">All ${urls.length}</button>
      <button class="ins-btn ins-blue" onclick="__INS_COPY__(${JSON.stringify(js.join('\n'))})">JS ${js.length}</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY__(${JSON.stringify(css.join('\n'))})">CSS ${css.length}</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(${JSON.stringify(media.join('\n'))})">Media ${media.length}</button>
    </div>
    <div class="ins-grid4" style="margin-top:6px">
      <button class="ins-btn ins-teal" onclick="__INS_COPY__(${JSON.stringify(json.join('\n'))})">JSON ${json.length}</button>
      <button class="ins-btn ins-gray" onclick="__INS_COPY__(${JSON.stringify(fonts.join('\n'))})">Fonts ${fonts.length}</button>
    </div>
  </div>
  <div class="ins-scroll">
    <div class="ins-card">
      <div class="ins-section-title">🔗 All URLs (${urls.length})</div>
      ${urls.slice(0, 500).map(u => `
        <div style="padding:7px;border-bottom:1px solid #1e293b;word-break:break-all;font-size:12px;display:flex;align-items:center;gap:8px">
          <span style="color:#60a5fa;font-size:10px;font-weight:700;min-width:40px">${esc(u.split('.').pop().split('?')[0].toUpperCase())}</span>
          <span style="color:#94a3b8">${esc(u)}</span>
        </div>
      `).join('') || '<div class="ins-empty">No URL found</div>'}
    </div>
  </div>
</div>`;
    }, true);

    // ─── TOOL 5: SECRETS ───
    addTool('secrets', () => {
      const allText = S().logs.map(x => [
        JSON.stringify(x.requestHeaders), JSON.stringify(x.responseHeaders),
        x.body, x.url, x.requestBody
      ].join(' ')).join(' ') + ' ' + D.documentElement.outerHTML;
      const secrets = detectSecrets(allText);

      return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🔐 Secret Detector</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-blue" onclick="try{eruda.get('secrets').refresh()}catch(_){}">🔍 Rescan</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(${JSON.stringify(secrets.map(s => s.name + ': ' + s.value).join('\n'))})">📋 Copy All</button>
      <button class="ins-btn ins-red" onclick="__INS_COPY__(${JSON.stringify(secrets.map(s => s.value).join('\n'))})">📋 Copy Values</button>
    </div>
    <div class="ins-small">Scanning: Network logs + DOM HTML + Headers</div>
  </div>
  <div class="ins-scroll">
    ${secrets.length ? `
      <div style="margin-bottom:12px">
        <span class="ins-badge">${secrets.length} found</span>
      </div>
      ${secrets.map(s => `
        <div class="ins-detector">
          <div class="ins-detector-icon">${esc(s.icon)}</div>
          <div class="ins-detector-info">
            <div class="ins-detector-name">${esc(s.name)}</div>
            <div class="ins-detector-val">${esc(s.value)}</div>
          </div>
          <button class="ins-btn ins-blue" style="flex-shrink:0" onclick="__INS_COPY__(${JSON.stringify(s.value)})">Copy</button>
        </div>
      `).join('')}
    ` : '<div class="ins-empty">Tidak ada secret terdeteksi.<br>Coba navigasi halaman lalu klik Rescan.</div>'}
  </div>
</div>`;
    }, true);

    // ─── TOOL 6: INFO ───
    addTool('info', () => {
      const nav = navigator;
      const perf = performance?.timing || {};
      const memory = performance?.memory || {};
      return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">📊 System Info</h2>
    <button class="ins-btn ins-blue" onclick="location.reload()">🔄 Reload</button>
  </div>

  <div class="ins-card">
    <div class="ins-section-title">🌐 Browser</div>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.userAgent?.match(/\b(Chrome|Firefox|Safari|Edge)\b/i)?.[0] || 'Unknown')}</div><div class="ins-stat-label">Browser</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.platform)}</div><div class="ins-stat-label">Platform</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.language)}</div><div class="ins-stat-label">Language</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.hardwareConcurrency || '?')}</div><div class="ins-stat-label">Cores</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(screen.width + 'x' + screen.height)}</div><div class="ins-stat-label">Resolution</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(W.innerWidth + 'x' + W.innerHeight)}</div><div class="ins-stat-label">Viewport</div></div>
    </div>
    <div class="ins-small" style="margin-top:10px;word-break:break-all">${esc(nav.userAgent)}</div>
  </div>

  <div class="ins-card">
    <div class="ins-section-title">⚡ Performance</div>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc(perf.loadEventEnd && perf.navigationStart ? (perf.loadEventEnd - perf.navigationStart) + 'ms' : 'N/A')}</div><div class="ins-stat-label">Load Time</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(perf.domContentLoadedEventEnd && perf.navigationStart ? (perf.domContentLoadedEventEnd - perf.navigationStart) + 'ms' : 'N/A')}</div><div class="ins-stat-label">DOM Ready</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(memory.usedJSHeapSize ? (memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB' : 'N/A')}</div><div class="ins-stat-label">JS Heap</div></div>
    </div>
  </div>

  <div class="ins-card">
    <div class="ins-section-title">🔧 Features</div>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.onLine ? '✅' : '❌')}</div><div class="ins-stat-label">Online</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.cookieEnabled ? '✅' : '❌')}</div><div class="ins-stat-label">Cookies</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc('serviceWorker' in nav ? '✅' : '❌')}</div><div class="ins-stat-label">ServiceWorker</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc('geolocation' in nav ? '✅' : '❌')}</div><div class="ins-stat-label">Geolocation</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc('webdriver' in nav ? '⚠️' : '✅')}</div><div class="ins-stat-label">WebDriver</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.maxTouchPoints || 0)}</div><div class="ins-stat-label">Touch Points</div></div>
    </div>
  </div>

  <div class="ins-card ins-sponsor">
    <div class="ins-title" style="font-size:16px">⚡ INS IT Developer Tools v6.0</div>
    <div class="ins-small" style="margin-bottom:10px">Proyek open-source untuk debugging web mobile & desktop. Dukungan Anda membantu pengembangan fitur baru.</div>
    <div class="ins-grid">
      <a class="ins-btn ins-blue" href="https://insitdeveloper.com" target="_blank" style="text-decoration:none;text-align:center">🌐 Website</a>
      <a class="ins-btn ins-orange" href="https://github.com/insitdeveloper" target="_blank" style="text-decoration:none;text-align:center">🐙 GitHub</a>
    </div>
  </div>

  <div class="ins-footer">
    <span>INS IT Developer Tools v6.0</span>
    <span>Built for developers, by developers</span>
  </div>
</div>`;
    });

    // ─── TOOL 7: INS CONSOLE ───
    addTool('ins-console', () => {
      const logs = S().console.slice(-100).reverse();
      return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🖥️ Captured Console</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-red" onclick="S().console=[];try{eruda.get('ins-console').refresh()}catch(_){}">🧹 Clear</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(JSON.stringify(S().console,null,2))">📋 Export</button>
    </div>
  </div>
  <div class="ins-scroll">
    ${logs.length ? logs.map(l => `
      <div class="ins-console-line ${esc(l.type)}">
        <span class="ins-console-time">${esc(l.time)}</span>
        <span class="ins-console-msg">${esc(l.msg)}</span>
      </div>
    `).join('') : '<div class="ins-empty">Belum ada log. Console log akan muncul di sini secara real-time.</div>'}
  </div>
</div>`;
    }, true);

    showEruda();
    console.log('[INS] ⚡ INS IT Developer Tools v6.0 aktif!');
  })();
})();
