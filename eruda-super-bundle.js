/* ============================================================
   ⚡ INS IT Developer Tools v5.3 — Eruda Addon
   Upgraded from original script. Keeps Eruda architecture.
   ============================================================ */
(async function () {
  const W = window, D = document;
  const CDN = 'https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.min.js';

  const load = u => new Promise((ok, no) => {
    const s = D.createElement('script');
    s.src = u;
    s.onload = ok;
    s.onerror = no;
    (D.head || D.documentElement).appendChild(s);
  });

  if (!W.eruda) await load(CDN);

  try {
    eruda.init({
      useShadowDom: false,
      tool: ['console', 'elements', 'network', 'resources', 'sources', 'info']
    });
  } catch (_) {}

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));

  const headersToObj = h => {
    const o = {};
    try {
      if (!h) return o;
      if (h instanceof Headers) h.forEach((v, k) => o[k] = v);
      else if (Array.isArray(h)) h.forEach(x => o[x[0]] = x[1]);
      else if (typeof h === 'object') Object.assign(o, h);
    } catch (_) {}
    return o;
  };

  W.__INS_LOGS__ = W.__INS_LOGS__ || [];
  W.__INS_FILTER__ = W.__INS_FILTER__ || '';
  W.__INS_LIVE__ = W.__INS_LIVE__ ?? true;
  W.__INS_PICK__ = false;
  W.__INS_CONSOLE__ = W.__INS_CONSOLE__ || [];

  W.__INS_COPY__ = t =>
    navigator.clipboard?.writeText(String(t))
      .then(() => alert('✅ Disalin ke clipboard'))
      .catch(() => prompt('Copy:', t));

  const css = `
<style>
.ins-wrap{box-sizing:border-box;padding:10px;font:12px/1.5 'Segoe UI',Roboto,Arial,monospace;color:#e7e7e7;background:#0d0f14;min-height:420px;max-height:78vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.ins-head{background:#0d0f14;padding-bottom:8px;position:sticky;top:0;z-index:10}
.ins-title{font-size:18px;font-weight:900;margin:0 0 8px;color:#fff;display:flex;align-items:center;gap:6px}
.ins-title::before{content:"⚡";font-size:20px}
.ins-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ins-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ins-btn{padding:10px;margin:3px 0;border:0;border-radius:12px;background:#1e2330;color:#fff;font-weight:800;cursor:pointer;user-select:none;transition:.15s;font-size:12px}
.ins-btn:active{transform:scale(.97)}
.ins-btn:hover{opacity:.9}
.ins-blue{background:#2563eb}.ins-green{background:#16a34a}.ins-red{background:#dc2626}.ins-purple{background:#7c3aed}.ins-orange{background:#ea580c}.ins-teal{background:#0d9488}
.ins-input{width:100%;box-sizing:border-box;padding:10px;border-radius:12px;border:1px solid #303747;background:#080a0f;color:#fff;margin:6px 0;font-size:12px;outline:none}
.ins-input:focus{border-color:#2563eb}
.ins-scroll{max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-bottom:70px}
.ins-card{background:#151821;border:1px solid #252b3a;border-radius:14px;padding:12px;margin:10px 0;word-break:break-all;animation:insFadeIn .3s ease}
@keyframes insFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.ins-pre{white-space:pre-wrap;background:#090b10;border-radius:10px;padding:10px;max-height:220px;overflow:auto;-webkit-overflow-scrolling:touch;color:#ddd;font-family:'Fira Code',Consolas,monospace;font-size:11px;border:1px solid #1e2330}
.ins-small{color:#94a3b8;font-size:11px;margin-top:4px}.ins-url{color:#60a5fa;font-weight:500}
.ins-pill{display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;background:#1e2330;margin:2px;font-size:11px;font-weight:700;border:1px solid #303747}
.ins-pill.m-get{background:#064e3b;color:#34d399;border-color:#065f46}
.ins-pill.m-post{background:#1e3a8a;color:#60a5fa;border-color:#1e40af}
.ins-pill.m-put{background:#713f12;color:#fbbf24;border-color:#854d0e}
.ins-pill.m-delete{background:#7f1d1d;color:#f87171;border-color:#991b1b}
.ins-pill.ok{background:#064e3b;color:#34d399}
.ins-pill.err{background:#7f1d1d;color:#f87171}
.ins-row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.ins-stat{background:#151821;border:1px solid #252b3a;border-radius:10px;padding:10px;text-align:center}
.ins-stat-val{font-size:16px;font-weight:800;color:#60a5fa}
.ins-stat-label{font-size:11px;color:#64748b;margin-top:2px}
.ins-detector{display:flex;align-items:center;gap:10px;background:#151821;border:1px solid #252b3a;border-radius:12px;padding:10px;margin-bottom:6px;animation:insFadeIn .3s ease}
.ins-detector-icon{font-size:20px}
.ins-detector-info{flex:1}
.ins-detector-name{font-weight:700;color:#e2e8f0;font-size:13px}
.ins-detector-val{color:#94a3b8;font-size:11px;word-break:break-all;margin-top:2px}
.ins-sponsor{background:linear-gradient(135deg,#151821,#0d0f14);border-color:#2563eb!important}
.ins-sponsor .ins-title{color:#60a5fa}
.ins-footer{display:flex;justify-content:space-between;align-items:center;padding:8px 0;color:#64748b;font-size:11px;border-top:1px solid #252b3a;margin-top:10px}
.ins-footer a{color:#60a5fa;text-decoration:none;font-weight:700}
.ins-footer a:hover{text-decoration:underline}
.ins-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:#1e2330;color:#94a3b8;font-size:11px;font-weight:600;margin-left:6px}
</style>`;

  function showEruda() {
    const e = D.getElementById('eruda');
    if (e) {
      e.style.display = 'block';
      e.style.zIndex = '2147483647';
    }
    try { eruda.show(); } catch (_) {}
  }

  function selector(el) {
    if (!el) return '';
    if (el.id) return '#' + CSS.escape(el.id);
    const out = [];
    while (el && el.nodeType === 1 && el !== D.body) {
      let s = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        s += '.' + el.className.trim().split(/\s+/).slice(0, 3).map(x => CSS.escape(x)).join('.');
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
      { name: 'GitHub Token', icon: '🐙', regex: /ghp_[a-zA-Z0-9]{36}/g },
      { name: 'Firebase Key', icon: '🔥', regex: /AIza[0-9A-Za-z_-]{35}/g },
      { name: 'Private Key', icon: '🔒', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
      { name: 'Stripe Key', icon: '💳', regex: /sk_(live|test)_[0-9a-zA-Z]{24,}/g },
      { name: 'Slack Token', icon: '💬', regex: /xox[baprs]-[0-9a-zA-Z-]+/g },
      { name: 'API Key', icon: '🔑', regex: /[a-zA-Z0-9_-]{32,64}/g },
      { name: 'Password/Secret', icon: '🗝️', regex: /(password|secret|token|api[_-]?key)\s*[:=]\s*["'][^"']{8,}["']/gi }
    ];
    patterns.forEach(p => {
      const matches = text.match(p.regex) || [];
      matches.forEach(m => { if (!found.some(f => f.value === m)) found.push({ ...p, value: m }); });
    });
    return found;
  }

  if (!W.__INS_PATCHED__) {
    W.__INS_PATCHED__ = true;

    // Console interceptor
    ['log','warn','error','info','debug'].forEach(method => {
      const orig = console[method];
      console[method] = (...args) => {
        W.__INS_CONSOLE__.push({
          type: method === 'log' ? 'log' : method,
          msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
          time: new Date().toLocaleTimeString('id-ID', {hour12:false})
        });
        if (W.__INS_CONSOLE__.length > 300) W.__INS_CONSOLE__.shift();
        orig.apply(console, args);
      };
    });

    const oldFetch = W.fetch;
    W.fetch = async (...args) => {
      const started = performance.now();
      const input = args[0];
      const opt = args[1] || {};
      const url = String(input?.url || input);
      const method = opt.method || input?.method || 'GET';
      const reqHeaders = { ...headersToObj(input?.headers), ...headersToObj(opt.headers) };
      const reqBody = opt.body ? String(opt.body).slice(0, 4000) : '';

      try {
        const res = await oldFetch(...args);
        try {
          const c = res.clone();
          const ct = c.headers.get('content-type') || '';
          const body = await c.text();
          const resHeaders = {};
          c.headers.forEach((v, k) => resHeaders[k] = v);

          W.__INS_LOGS__.push({
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
            body: body.slice(0, 12000)
          });
        } catch (_) {}
        return res;
      } catch (err) {
        W.__INS_LOGS__.push({
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
          body: 'Error: ' + err.message
        });
        throw err;
      }
    };

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
      this.addEventListener('loadend', () => {
        try {
          const raw = this.getAllResponseHeaders() || '';
          const responseHeaders = {};
          raw.trim().split(/[\r\n]+/).forEach(line => {
            const i = line.indexOf(':');
            if (i > -1) responseHeaders[line.slice(0, i).trim()] = line.slice(i + 1).trim();
          });

          W.__INS_LOGS__.push({
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
            requestBody: body ? String(body).slice(0, 4000) : '',
            body: String(this.responseText || '').slice(0, 12000)
          });
        } catch (_) {}
      });
      return xs.apply(this, arguments);
    };

    D.addEventListener('click', e => {
      if (!W.__INS_PICK__) return;
      e.preventDefault();
      e.stopPropagation();
      const s = selector(e.target);
      W.__INS_PICK__ = false;
      W.__INS_COPY__(s);
      showEruda();
      console.log('[INS selector]', s);
    }, true);
  }

  function addTool(name, render, realtime) {
    class T extends eruda.Tool {
      constructor() {
        super();
        this.name = name;
        this.timer = null;
      }
      init($el) {
        super.init($el);
        this._$el = $el;
        this.refresh();
      }
      show() {
        super.show();
        this.refresh();
        if (realtime && !this.timer) {
          this.timer = setInterval(() => {
            if (W.__INS_LIVE__) this.refresh();
          }, 1000);
        }
      }
      hide() {
        super.hide();
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
      }
      refresh() {
        if (this._$el) this._$el.html(render());
      }
    }
    try { eruda.add(new T()); } catch (_) {}
  }

  W.__INS_SET_FILTER__ = v => {
    W.__INS_FILTER__ = v || '';
    try { eruda.get('api').refresh(); } catch (_) {}
  };

  W.__INS_TOGGLE_LIVE__ = () => {
    W.__INS_LIVE__ = !W.__INS_LIVE__;
    try { eruda.get('api').refresh(); } catch (_) {}
  };

  W.__INS_FETCH_CODE__ = i => {
    const x = W.__INS_LOGS__[i];
    if (!x) return;
    W.__INS_COPY__(
`fetch(${JSON.stringify(x.url)}, {
  method: ${JSON.stringify(x.method)},
  headers: ${JSON.stringify(x.requestHeaders || {}, null, 2)}${x.requestBody ? `,
  body: ${JSON.stringify(x.requestBody)}` : ''}
})
.then(r => r.text())
.then(console.log);`
    );
  };

  W.__INS_AXIOS_CODE__ = i => {
    const x = W.__INS_LOGS__[i];
    if (!x) return;
    W.__INS_COPY__(
`const axios = require('axios');

axios({
  method: ${JSON.stringify(String(x.method).toLowerCase())},
  url: ${JSON.stringify(x.url)},
  headers: ${JSON.stringify(x.requestHeaders || {}, null, 2)}${x.requestBody ? `,
  data: ${JSON.stringify(x.requestBody)}` : ''}
}).then(r => console.log(r.data));`
    );
  };

  W.__INS_COPY_CURL__ = i => {
    const x = W.__INS_LOGS__[i];
    if (!x) return;
    const hs = Object.entries(x.requestHeaders || {})
      .map(([k, v]) => ` \
  -H ${JSON.stringify(k + ': ' + v)}`).join('');
    W.__INS_COPY__(
`curl -L ${JSON.stringify(x.url)} \
  -X ${JSON.stringify(x.method)}${hs}${x.requestBody ? ` \
  --data-raw ${JSON.stringify(x.requestBody)}` : ''}`
    );
  };

  // ─── TOOL 1: SCRAPER (Elements + Picker) ───
  addTool('scraper', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🔧 INS Scraper</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-blue" onclick="window.__INS_PICK__=true;document.getElementById('eruda').style.display='none';alert('Tap elemen target')">🎯 Pick Selector</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY__([...document.querySelectorAll('a')].map(a=>a.href).filter(Boolean).join('\n'))">🔗 Copy Links</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY__([...document.images].map(i=>i.src).filter(Boolean).join('\n'))">🖼 Images</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(document.documentElement.outerHTML)">📄 HTML</button>
    </div>
  </div>
  <div class="ins-card"><b>Title</b><br>${esc(D.title)}<br><br><b>URL</b><br><span class="ins-url">${esc(location.href)}</span><br><br><b>Viewport</b><br>${esc(W.innerWidth + 'x' + W.innerHeight)}</div>
  <div class="ins-card">
    <b>📊 DOM Stats</b>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('*')].length)}</div><div class="ins-stat-label">Elements</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.scripts].length)}</div><div class="ins-stat-label">Scripts</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('style,link[rel=stylesheet]')].length)}</div><div class="ins-stat-label">Styles</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.images].length)}</div><div class="ins-stat-label">Images</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('a')].length)}</div><div class="ins-stat-label">Links</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc([...D.querySelectorAll('iframe')].length)}</div><div class="ins-stat-label">Iframes</div></div>
    </div>
  </div>
  <div class="ins-card"><b>📝 Forms</b><br>${
    [...D.querySelectorAll('form')].map((f, i) => `<div class="ins-small">#${i} ${esc(f.method || 'GET')} → ${esc(f.action || location.href)}</div>`).join('') || '<span class="ins-small">No forms</span>'
  }</div>
  <div class="ins-card"><b>📜 JSON Scripts</b><br>${
    [...D.scripts].map((s, i) => s.textContent.includes('{') ? `<div class="ins-small">#${i} — ${s.textContent.length} chars</div>` : null).filter(Boolean).slice(0, 100).join('') || '<span class="ins-small">none</span>'
  }</div>
</div>`);

  // ─── TOOL 2: API (Network Monitor) ───
  addTool('api', () => {
    const q = (W.__INS_FILTER__ || '').toLowerCase();
    const logs = W.__INS_LOGS__
      .map((x, i) => ({ ...x, i }))
      .filter(x => !q || [
        x.url, x.method, x.status, x.ct, x.body, x.type,
        JSON.stringify(x.requestHeaders || {}),
        JSON.stringify(x.responseHeaders || {})
      ].join(' ').toLowerCase().includes(q))
      .slice(-150)
      .reverse();

    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🌐 Live Network</h2>
    <input class="ins-input" placeholder="Search: api, json, xhr, fetch, mp4, m3u8, auth, token..." value="${esc(W.__INS_FILTER__)}" oninput="__INS_SET_FILTER__(this.value)">
    <div class="ins-grid">
      <button class="ins-btn ${W.__INS_LIVE__ ? 'ins-green' : 'ins-red'}" onclick="__INS_TOGGLE_LIVE__()">${W.__INS_LIVE__ ? '🟢 Live ON' : '🔴 Live OFF'}</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(JSON.stringify(window.__INS_LOGS__,null,2))">📋 Export JSON</button>
      <button class="ins-btn ins-red" onclick="window.__INS_LOGS__=[];alert('cleared')">🧹 Clear</button>
      <button class="ins-btn ins-blue" onclick="location.reload()">🔄 Reload</button>
    </div>
    <div class="ins-small">Total: ${W.__INS_LOGS__.length} | Shown: ${logs.length}</div>
  </div>
  <div class="ins-scroll">
    ${logs.map(x => `
      <div class="ins-card">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
          <span class="ins-pill m-${esc(x.method.toLowerCase())}">${esc(x.method)}</span>
          <span class="ins-pill ${x.ok ? 'ok' : 'err'}">${esc(x.status)}</span>
          <span class="ins-pill">${esc(x.type)}</span>
          <span class="ins-pill">${esc(x.duration)}ms</span>
          <span class="ins-pill">${esc(x.time)}</span>
        </div>
        <div class="ins-url">${esc(x.url)}</div>
        <div class="ins-small">${esc(x.ct || '')}</div>
        <div class="ins-row">
          <button class="ins-btn ins-blue" onclick="__INS_FETCH_CODE__(${x.i})">fetch()</button>
          <button class="ins-btn ins-purple" onclick="__INS_AXIOS_CODE__(${x.i})">Axios</button>
          <button class="ins-btn ins-orange" onclick="__INS_COPY_CURL__(${x.i})">cURL</button>
          <button class="ins-btn ins-teal" onclick="__INS_COPY__(${JSON.stringify(x.body)})">Copy Body</button>
        </div>
        <b style="color:#94a3b8;font-size:11px;display:block;margin-top:10px">Request Headers</b>
        <pre class="ins-pre">${esc(JSON.stringify(x.requestHeaders || {}, null, 2))}</pre>
        <b style="color:#94a3b8;font-size:11px;display:block;margin-top:8px">Response Headers</b>
        <pre class="ins-pre">${esc(JSON.stringify(x.responseHeaders || {}, null, 2))}</pre>
        ${x.requestBody ? `<b style="color:#94a3b8;font-size:11px;display:block;margin-top:8px">Request Body</b><pre class="ins-pre">${esc(x.requestBody)}</pre>` : ''}
        <b style="color:#94a3b8;font-size:11px;display:block;margin-top:8px">Response Body</b>
        <pre class="ins-pre">${esc(x.body).slice(0, 2200)}${x.body.length > 2200 ? '...' : ''}</pre>
      </div>
    `).join('') || '<div class="ins-card ins-empty">Belum ada request. Klik Reload atau navigasi halaman.</div>'}
  </div>
</div>`;
  }, true);

  // ─── TOOL 3: STORE (Storage) ───
  addTool('store', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">💾 Storage</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-orange" onclick="__INS_COPY__(document.cookie)">🍪 Cookies</button>
      <button class="ins-btn ins-blue" onclick="__INS_COPY__(JSON.stringify(localStorage,null,2))">LocalStorage</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY__(JSON.stringify(sessionStorage,null,2))">SessionStorage</button>
    </div>
  </div>
  <div class="ins-card"><b>Cookies</b><pre class="ins-pre">${esc(D.cookie || 'none')}</pre></div>
  <div class="ins-card"><b>LocalStorage</b><pre class="ins-pre">${esc(JSON.stringify({...localStorage}, null, 2))}</pre></div>
  <div class="ins-card"><b>SessionStorage</b><pre class="ins-pre">${esc(JSON.stringify({...sessionStorage}, null, 2))}</pre></div>
</div>`);

  // ─── TOOL 4: EXTRACT (Resources) ───
  addTool('extract', () => {
    const urls = [...D.querySelectorAll('script,img,video,audio,source,link,a,iframe')]
      .map(x => x.src || x.href)
      .filter(Boolean);
    const js = urls.filter(u => /\.js(\?|$)/i.test(u));
    const css = urls.filter(u => /\.css(\?|$)/i.test(u));
    const media = urls.filter(u => /\.(mp4|m3u8|mp3|webm|ogg|wav|jpg|jpeg|png|webp|gif|svg|ico)(\?|$)/i.test(u));
    const json = urls.filter(u => /\.json(\?|$)/i.test(u));

    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">📥 Extractor</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-green" onclick="__INS_COPY__(${JSON.stringify(urls.join('\n'))})">All ${urls.length}</button>
      <button class="ins-btn ins-blue" onclick="__INS_COPY__(${JSON.stringify(js.join('\n'))})">JS ${js.length}</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY__(${JSON.stringify(css.join('\n'))})">CSS ${css.length}</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(${JSON.stringify(media.join('\n'))})">Media ${media.length}</button>
    </div>
    <div class="ins-grid" style="margin-top:6px">
      <button class="ins-btn ins-teal" onclick="__INS_COPY__(${JSON.stringify(json.join('\n'))})">JSON ${json.length}</button>
    </div>
  </div>
  <div class="ins-scroll">
    <div class="ins-card">
      ${urls.slice(0, 500).map(u => `<div style="padding:7px;border-bottom:1px solid #2b3342;word-break:break-all;font-size:12px;color:#94a3b8"><span style="color:#60a5fa">${esc(u)}</span></div>`).join('') || '<div class="ins-empty">No URL</div>'}
    </div>
  </div>
</div>`;
  }, true);

  // ─── TOOL 5: SECRETS (Key Detector) ───
  addTool('secrets', () => {
    const allText = W.__INS_LOGS__.map(x => [
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
    </div>
    <div class="ins-small">Scanning: Network logs + DOM HTML</div>
  </div>
  <div class="ins-scroll">
    ${secrets.length ? secrets.map(s => `
      <div class="ins-detector">
        <div class="ins-detector-icon">${esc(s.icon)}</div>
        <div class="ins-detector-info">
          <div class="ins-detector-name">${esc(s.name)}</div>
          <div class="ins-detector-val">${esc(s.value)}</div>
        </div>
        <button class="ins-btn ins-blue" onclick="__INS_COPY__(${JSON.stringify(s.value)})">Copy</button>
      </div>
    `).join('') : '<div class="ins-card ins-empty">Tidak ada secret terdeteksi. Coba navigasi halaman lalu klik Rescan.</div>'}
  </div>
</div>`;
  }, true);

  // ─── TOOL 6: INFO (System + Sponsor) ───
  addTool('info', () => {
    const nav = navigator;
    const perf = performance?.timing || {};
    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">📊 System Info</h2>
    <button class="ins-btn ins-blue" onclick="location.reload()">🔄 Reload</button>
  </div>
  <div class="ins-card">
    <b>🌐 Browser</b>
    <div class="ins-grid3" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.userAgent?.match(/(Chrome|Firefox|Safari|Edge)/i)?.[0] || 'Unknown')}</div><div class="ins-stat-label">Browser</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.platform)}</div><div class="ins-stat-label">Platform</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.language)}</div><div class="ins-stat-label">Language</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(nav.hardwareConcurrency || '?')}</div><div class="ins-stat-label">Cores</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(screen.width + 'x' + screen.height)}</div><div class="ins-stat-label">Resolution</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(W.innerWidth + 'x' + W.innerHeight)}</div><div class="ins-stat-label">Viewport</div></div>
    </div>
    <div class="ins-small" style="margin-top:10px;word-break:break-all">${esc(nav.userAgent)}</div>
  </div>
  <div class="ins-card">
    <b>⚡ Performance</b>
    <div class="ins-grid" style="margin-top:8px">
      <div class="ins-stat"><div class="ins-stat-val">${esc(perf.loadEventEnd && perf.navigationStart ? (perf.loadEventEnd - perf.navigationStart) + 'ms' : 'N/A')}</div><div class="ins-stat-label">Load Time</div></div>
      <div class="ins-stat"><div class="ins-stat-val">${esc(perf.domContentLoadedEventEnd && perf.navigationStart ? (perf.domContentLoadedEventEnd - perf.navigationStart) + 'ms' : 'N/A')}</div><div class="ins-stat-label">DOM Ready</div></div>
    </div>
  </div>
  <div class="ins-card ins-sponsor">
    <div class="ins-title" style="font-size:16px">💖 Dukung INS IT Developer Tools</div>
    <div class="ins-small" style="margin-bottom:10px">Proyek open-source untuk debugging web mobile & desktop. Dukungan Anda membantu pengembangan fitur baru.</div>
    <div class="ins-grid">
      <a class="ins-btn ins-blue" href="https://opencollective.com/insitdeveloper" target="_blank" style="text-decoration:none;text-align:center">🌐 Open Collective</a>
      <a class="ins-btn ins-orange" href="https://ko-fi.com/insitdeveloper" target="_blank" style="text-decoration:none;text-align:center">☕ Ko-fi</a>
    </div>
    <div class="ins-grid" style="margin-top:8px">
      <a class="ins-btn ins-green" href="https://insitdeveloper.com/donate" target="_blank" style="text-decoration:none;text-align:center">💳 Donasi</a>
    </div>
  </div>
  <div class="ins-footer">
    <span>INS IT Developer Tools v5.3</span>
    <span>Built for developers, by developers</span>
  </div>
</div>`;
  });

  // ─── TOOL 7: INS Console (Captured Logs) ───
  addTool('ins-console', () => {
    const logs = W.__INS_CONSOLE__.slice(-100).reverse();
    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🖥️ INS Console</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-red" onclick="window.__INS_CONSOLE__=[];try{eruda.get('ins-console').refresh()}catch(_){}">🧹 Clear</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY__(JSON.stringify(window.__INS_CONSOLE__,null,2))">📋 Export</button>
    </div>
  </div>
  <div class="ins-scroll">
    ${logs.length ? logs.map(l => `
      <div style="padding:6px 8px;border-radius:8px;margin-bottom:4px;font-size:12px;display:flex;gap:8px;border-left:2px solid ${
        l.type === 'error' ? '#ef4444' : l.type === 'warn' ? '#eab308' : l.type === 'info' ? '#3b82f6' : '#374151'
      };background:${
        l.type === 'error' ? 'rgba(239,68,68,.08)' : l.type === 'warn' ? 'rgba(234,179,8,.08)' : 'transparent'
      }">
        <span style="color:#475569;font-family:monospace;font-size:11px;flex-shrink:0">${esc(l.time)}</span>
        <span style="flex:1;word-break:break-all;color:${
          l.type === 'error' ? '#f87171' : l.type === 'warn' ? '#fbbf24' : l.type === 'info' ? '#60a5fa' : '#e2e8f0'
        }">${esc(l.msg)}</span>
      </div>
    `).join('') : '<div class="ins-empty">Belum ada log. Console log akan muncul di sini secara real-time.</div>'}
  </div>
</div>`;
  }, true);

  showEruda();
  console.log('[INS] ⚡ INS IT Developer Tools v5.3 aktif!');
})();
