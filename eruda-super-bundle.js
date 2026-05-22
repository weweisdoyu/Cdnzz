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
.ins-wrap{height:100%;box-sizing:border-box;padding:12px;font:12px/1.5 Arial,monospace;color:#e7e7e7;background:#0f1117;overflow:hidden}
.ins-head{position:sticky;top:0;background:#0f1117;z-index:9;padding-bottom:8px}
.ins-title{font-size:18px;font-weight:900;margin:0 0 8px;color:#fff}
.ins-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ins-btn{padding:10px;margin:3px 0;border:0;border-radius:12px;background:#252b3a;color:#fff;font-weight:800}
.ins-blue{background:#2563eb}.ins-green{background:#16a34a}.ins-red{background:#dc2626}.ins-purple{background:#7c3aed}.ins-orange{background:#ea580c}
.ins-input{width:100%;box-sizing:border-box;padding:10px;border-radius:12px;border:1px solid #303747;background:#080a0f;color:#fff;margin:6px 0}
.ins-scroll{height:calc(100vh - 210px);overflow:auto;padding-bottom:40px}
.ins-card{background:#181c25;border:1px solid #2b3342;border-radius:14px;padding:10px;margin:10px 0;word-break:break-all}
.ins-pre{white-space:pre-wrap;background:#090b10;border-radius:10px;padding:8px;max-height:190px;overflow:auto;color:#ddd}
.ins-small{color:#a1a1aa;font-size:11px}
.ins-url{color:#60a5fa}
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

  function hideEruda() {
    const e = D.getElementById('eruda');
    if (e) e.style.display = 'none';
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
      const url = String(args[0]?.url || args[0]);
      const opt = args[1] || {};
      const res = await oldFetch(...args);
      try {
        const c = res.clone();
        const ct = c.headers.get('content-type') || '';
        const txt = await c.text();
        W.__INS_LOGS__.push({
          id: Date.now() + Math.random(),
          type: 'fetch',
          url,
          method: opt.method || 'GET',
          status: res.status,
          ct,
          time: new Date().toLocaleTimeString(),
          body: txt.slice(0, 10000)
        });
      } catch (_) {}
      return res;
    };

    const xo = XMLHttpRequest.prototype.open;
    const xs = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (m, u) {
      this.__ins_m = m;
      this.__ins_u = u;
      return xo.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('load', () => {
        try {
          W.__INS_LOGS__.push({
            id: Date.now() + Math.random(),
            type: 'xhr',
            url: this.__ins_u,
            method: this.__ins_m,
            status: this.status,
            ct: this.getResponseHeader('content-type'),
            time: new Date().toLocaleTimeString(),
            body: String(this.responseText || '').slice(0, 10000)
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
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
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

  W.__INS_SNIPPET__ = i => {
    const x = W.__INS_LOGS__[i];
    if (!x) return;
    W.__INS_COPY__(
`fetch(${JSON.stringify(x.url)}, {
  method: ${JSON.stringify(x.method)}
})
.then(r => r.text())
.then(console.log);`
    );
  };

  W.__INS_NODE__ = i => {
    const x = W.__INS_LOGS__[i];
    if (!x) return;
    W.__INS_COPY__(
`const axios = require('axios');

axios({
  method: ${JSON.stringify(String(x.method).toLowerCase())},
  url: ${JSON.stringify(x.url)},
  headers: {
    'user-agent': 'Mozilla/5.0',
    'accept': '*/*'
  }
}).then(r => console.log(r.data));`
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
  <div class="ins-scroll">
    <div class="ins-card"><b>Title</b><br>${esc(D.title)}<br><br><b>URL</b><br><span class="ins-url">${esc(location.href)}</span></div>
    <div class="ins-card"><b>JSON Scripts</b><br>${
      [...D.scripts].map((s, i) => s.textContent.includes('{') ? `#${i} — ${s.textContent.length} chars` : null).filter(Boolean).slice(0, 100).join('<br>') || 'none'
    }</div>
  </div>
</div>`);

  addTool('api', () => {
    const q = (W.__INS_FILTER__ || '').toLowerCase();
    const logs = W.__INS_LOGS__
      .map((x, i) => ({ ...x, i }))
      .filter(x => !q || [x.url, x.method, x.status, x.ct, x.body, x.type].join(' ').toLowerCase().includes(q))
      .slice(-150)
      .reverse();

    return css + `
<div class="ins-wrap">
  <div class="ins-head">
    <h2 class="ins-title">🌐 Live API / XHR</h2>
    <input class="ins-input" placeholder="Search: api, json, xhr, fetch, mp4, m3u8, graphql..." value="${esc(W.__INS_FILTER__)}" oninput="__INS_SET_FILTER__(this.value)">
    <div class="ins-grid">
      <button class="ins-btn ${W.__INS_LIVE__ ? 'ins-green' : 'ins-red'}" onclick="__INS_TOGGLE_LIVE__()">${W.__INS_LIVE__ ? '🟢 Live ON' : '🔴 Live OFF'}</button>
      <button class="ins-btn ins-purple" onclick="__INS_COPY(JSON.stringify(window.__INS_LOGS__,null,2))">📋 Export</button>
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
        <span class="ins-pill">${esc(x.time || '')}</span>
        <div class="ins-url">${esc(x.url)}</div>
        <div class="ins-small">${esc(x.ct || '')}</div>
        <button class="ins-btn ins-blue" onclick="__INS_SNIPPET__(${x.i})">Copy fetch()</button>
        <button class="ins-btn ins-purple" onclick="__INS_NODE__(${x.i})">Copy Node Axios</button>
        <pre class="ins-pre">${esc(x.body).slice(0, 1800)}</pre>
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
  <div class="ins-scroll">
    <div class="ins-card"><b>Cookies</b><pre class="ins-pre">${esc(D.cookie || 'none')}</pre></div>
    <div class="ins-card"><b>LocalStorage</b><pre class="ins-pre">${esc(JSON.stringify(localStorage, null, 2))}</pre></div>
    <div class="ins-card"><b>SessionStorage</b><pre class="ins-pre">${esc(JSON.stringify(sessionStorage, null, 2))}</pre></div>
  </div>
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
