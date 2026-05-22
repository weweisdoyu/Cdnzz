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

  const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
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

  W.__INS_COPY__ = t =>
    navigator.clipboard?.writeText(String(t))
      .then(() => alert('✅ Copied'))
      .catch(() => prompt('Copy:', t));

  const css = `
<style>
.ins-wrap{box-sizing:border-box;padding:10px;font:12px/1.5 Arial,monospace;color:#e7e7e7;background:#101114;min-height:420px;max-height:78vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.ins-head{background:#101114;padding-bottom:8px}
.ins-title{font-size:18px;font-weight:900;margin:0 0 8px;color:#fff}
.ins-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ins-btn{padding:10px;margin:3px 0;border:0;border-radius:12px;background:#252b3a;color:#fff;font-weight:800;cursor:pointer;user-select:none}
.ins-btn:active{transform:scale(.97)}
.ins-blue{background:#2563eb}.ins-green{background:#16a34a}.ins-red{background:#dc2626}.ins-purple{background:#7c3aed}.ins-orange{background:#ea580c}
.ins-input{width:100%;box-sizing:border-box;padding:10px;border-radius:12px;border:1px solid #303747;background:#080a0f;color:#fff;margin:6px 0}
.ins-scroll{max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-bottom:70px}
.ins-card{background:#181c25;border:1px solid #2b3342;border-radius:14px;padding:10px;margin:10px 0;word-break:break-all}
.ins-pre{white-space:pre-wrap;background:#090b10;border-radius:10px;padding:8px;max-height:220px;overflow:auto;-webkit-overflow-scrolling:touch;color:#ddd}
.ins-small{color:#a1a1aa;font-size:11px}.ins-url{color:#60a5fa}
.ins-pill{display:inline-block;padding:2px 7px;border-radius:999px;background:#303848;margin:2px}
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

  if (!W.__INS_PATCHED__) {
    W.__INS_PATCHED__ = true;

    const oldFetch = W.fetch;
    W.fetch = async (...args) => {
      const started = performance.now();
      const input = args[0];
      const opt = args[1] || {};
      const url = String(input?.url || input);
      const method = opt.method || input?.method || 'GET';
      const reqHeaders = {
        ...headersToObj(input?.headers),
        ...headersToObj(opt.headers)
      };
      const reqBody = opt.body ? String(opt.body).slice(0, 4000) : '';

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
          time: new Date().toLocaleTimeString(),
          duration: Math.round(performance.now() - started),
          requestHeaders: reqHeaders,
          responseHeaders: resHeaders,
          requestBody: reqBody,
          body: body.slice(0, 12000)
        });
      } catch (_) {}

      return res;
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
            time: new Date().toLocaleTimeString(),
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
      .map(([k, v]) => ` \\\n  -H ${JSON.stringify(k + ': ' + v)}`).join('');
    W.__INS_COPY(
`curl -L ${JSON.stringify(x.url)} \\
  -X ${JSON.stringify(x.method)}${hs}${x.requestBody ? ` \\\n  --data-raw ${JSON.stringify(x.requestBody)}` : ''}`
    );
  };

  addTool('scraper', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🔧 INS Scraper</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-blue" onclick="window.__INS_PICK__=true;document.getElementById('eruda').style.display='none';alert('Tap elemen target')">🎯 Pick Selector</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY([...document.querySelectorAll('a')].map(a=>a.href).filter(Boolean).join('\\n'))">🔗 Copy Links</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY([...document.images].map(i=>i.src).filter(Boolean).join('\\n'))">🖼 Images</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY(document.documentElement.outerHTML)">📄 HTML</button>
    </div>
  </div>
  <div class="ins-card"><b>Title</b><br>${esc(D.title)}<br><br><b>URL</b><br><span class="ins-url">${esc(location.href)}</span></div>
  <div class="ins-card"><b>JSON Scripts</b><br>${
    [...D.scripts].map((s, i) => s.textContent.includes('{') ? `#${i} — ${s.textContent.length} chars` : null).filter(Boolean).slice(0, 100).join('<br>') || 'none'
  }</div>
</div>`);

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
      <button class="ins-btn ins-purple" onclick="__INS_COPY(JSON.stringify(window.__INS_LOGS__,null,2))">📋 Export JSON</button>
      <button class="ins-btn ins-red" onclick="window.__INS_LOGS__=[];alert('cleared')">🧹 Clear</button>
      <button class="ins-btn ins-blue" onclick="location.reload()">🔄 Reload</button>
    </div>
    <div class="ins-small">Total: ${W.__INS_LOGS__.length} | Shown: ${logs.length}</div>
  </div>
  <div class="ins-scroll">
    ${logs.map(x => `
      <div class="ins-card">
        <span class="ins-pill">${esc(x.method)}</span>
        <span class="ins-pill">${esc(x.status)}</span>
        <span class="ins-pill">${esc(x.type)}</span>
        <span class="ins-pill">${esc(x.duration)}ms</span>
        <div class="ins-url">${esc(x.url)}</div>
        <div class="ins-small">${esc(x.ct || '')}</div>
        <button class="ins-btn ins-blue" onclick="__INS_FETCH_CODE__(${x.i})">fetch()</button>
        <button class="ins-btn ins-purple" onclick="__INS_AXIOS_CODE__(${x.i})">Axios</button>
        <button class="ins-btn ins-orange" onclick="__INS_COPY_CURL__(${x.i})">cURL</button>
        <b>Request Headers</b>
        <pre class="ins-pre">${esc(JSON.stringify(x.requestHeaders || {}, null, 2))}</pre>
        <b>Response Headers</b>
        <pre class="ins-pre">${esc(JSON.stringify(x.responseHeaders || {}, null, 2))}</pre>
        ${x.requestBody ? `<b>Request Body</b><pre class="ins-pre">${esc(x.requestBody)}</pre>` : ''}
        <b>Response Body</b>
        <pre class="ins-pre">${esc(x.body).slice(0, 2200)}</pre>
      </div>
    `).join('') || '<div class="ins-card">Belum ada request. Klik Reload.</div>'}
  </div>
</div>`;
  }, true);

  addTool('store', () => css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">💾 Storage</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-orange" onclick="__INS_COPY(document.cookie)">🍪 Cookies</button>
      <button class="ins-btn ins-blue" onclick="__INS_COPY(JSON.stringify(localStorage,null,2))">LocalStorage</button>
      <button class="ins-btn ins-green" onclick="__INS_COPY(JSON.stringify(sessionStorage,null,2))">SessionStorage</button>
    </div>
  </div>
  <div class="ins-card"><b>Cookies</b><pre class="ins-pre">${esc(D.cookie || 'none')}</pre></div>
  <div class="ins-card"><b>LocalStorage</b><pre class="ins-pre">${esc(JSON.stringify(localStorage, null, 2))}</pre></div>
  <div class="ins-card"><b>SessionStorage</b><pre class="ins-pre">${esc(JSON.stringify(sessionStorage, null, 2))}</pre></div>
</div>`);

  addTool('extract', () => {
    const urls = [...D.querySelectorAll('script,img,video,audio,source,link,a,iframe')]
      .map(x => x.src || x.href)
      .filter(Boolean);

    const js = urls.filter(u => /\.js(\?|$)/i.test(u));
    const media = urls.filter(u => /\.(mp4|m3u8|mp3|webm|jpg|jpeg|png|webp|gif)(\?|$)/i.test(u));

    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">📥 Extractor</h2>
    <div class="ins-grid">
      <button class="ins-btn ins-green" onclick="__INS_COPY(${JSON.stringify(urls.join('\n'))})">All ${urls.length}</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY(${JSON.stringify(js.join('\n'))})">JS ${js.length}</button>
      <button class="ins-btn ins-orange" onclick="__INS_COPY(${JSON.stringify(media.join('\n'))})">Media ${media.length}</button>
    </div>
  </div>
  <div class="ins-scroll">
    <div class="ins-card">
      ${urls.slice(0, 500).map(u => `<div style="padding:7px;border-bottom:1px solid #2b3342;word-break:break-all">${esc(u)}</div>`).join('') || 'No URL'}
    </div>
  </div>
</div>`;
  }, true);

  showEruda();
})();
