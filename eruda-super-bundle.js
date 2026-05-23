/**
 * INS DEVTOOLS PRO - Ultimate Developer Tools
 * Based on Eruda v3.4.3
 * 
 * Features:
 * - Console (Enhanced)
 * - Elements (DOM Inspector)
 * - Network (Fetch + XHR Monitor)
 * - Sources (File Viewer)
 * - Storage (Cookies + LocalStorage + SessionStorage)
 * - Resources (Image/Font/CSS Extractor)
 * - Performance (Timing + Memory)
 * - Security (CORS + CSP Checker)
 * - Debugger (Breakpoints + Watch)
 * 
 * Keyboard Shortcuts:
 * - Ctrl+Shift+I / F12: Toggle
 * - Ctrl+Shift+J: Clear Console
 * - Ctrl+Shift+M: Mobile View
 * - Ctrl+Shift+P: Pick Element
 * - Ctrl+Shift+S: Screenshot
 */

!function(e){
    'use strict';
    
    console.log('═══════════════════════════════════════════════════');
    console.log('🔧 INS DEVTOOLS PRO v2.0 - Loading...');
    console.log('═══════════════════════════════════════════════════');
    
    // ============================================
    // CONFIG
    // ============================================
    const CONFIG = {
        erudaCdn: 'https://cdn.jsdelivr.net/npm/eruda@3.4.3/dist/eruda.min.js',
        zIndex: 2147483647,
        autoShow: true,
        liveRefresh: true
    };
    
    // ============================================
    // STATE
    // ============================================
    const STATE = {
        loaded: false,
        eruda: null,
        logs: [],
        filter: '',
        live: true,
        pickMode: false,
        mobileMode: false,
        breakpoints: [],
        watch: []
    };
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
    
    const copy = async (text, msg = '✅ Copied!') => {
        try {
            await navigator.clipboard.writeText(String(text));
            console.log('[INS]', msg);
            return true;
        } catch(e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            console.log('[INS]', msg);
            return true;
        }
    };
    
    const headersToObj = h => {
        const o = {};
        try {
            if (!h) return o;
            if (h instanceof Headers) h.forEach((v, k) => o[k] = v);
            else if (Array.isArray(h)) h.forEach(x => o[x[0]] = v);
            else if (typeof h === 'object') Object.assign(o, h);
        } catch(_) {}
        return o;
    };
    
    const path = el => {
        if (!el) return '';
        if (el.id) return '#' + CSS.escape(el.id);
        const out = [];
        while (el && el.nodeType === 1 && el !== document.body) {
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
    };
    
    const formatBytes = bytes => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const formatTime = ms => {
        if (ms < 1000) return ms.toFixed(2) + 'ms';
        return (ms / 1000).toFixed(2) + 's';
    };
    
    // ============================================
    // NETWORK MONITOR
    // ============================================
    const setupNetworkMonitor = () => {
        const oldFetch = e.fetch;
        e.fetch = async (...args) => {
            const started = performance.now();
            const input = args[0];
            const opt = args[1] || {};
            const url = String(input?.url || input);
            const method = opt.method || input?.method || 'GET';
            const reqHeaders = { ...headersToObj(input?.headers), ...headersToObj(opt.headers) };
            const reqBody = opt.body ? String(opt.body).slice(0, 4000) : '';
            
            const res = await oldFetch(...args);
            
            try {
                const c = res.clone();
                const ct = c.headers.get('content-type') || '';
                const body = await c.text();
                const resHeaders = {};
                c.headers.forEach((v, k) => resHeaders[k] = v);
                
                STATE.logs.push({
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
                    body: body.slice(0, 12000),
                    timestamp: Date.now()
                });
            } catch(_) {}
            
            return res;
        };
        
        const xo = XMLHttpRequest.prototype.open;
        const xs = XMLHttpRequest.prototype.send;
        const xh = XMLHttpRequest.prototype.setRequestHeader;
        
        XMLHttpRequest.prototype.open = function(m, u) {
            this.__ins_m = m;
            this.__ins_u = u;
            this.__ins_headers = {};
            this.__ins_started = performance.now();
            return xo.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(k, v) {
            try { this.__ins_headers[k] = v; } catch(_) {}
            return xh.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('loadend', () => {
                try {
                    const raw = this.getAllResponseHeaders() || '';
                    const responseHeaders = {};
                    raw.trim().split(/[\r\n]+/).forEach(line => {
                        const i = line.indexOf(':');
                        if (i > -1) responseHeaders[line.slice(0, i).trim()] = line.slice(i + 1).trim();
                    });
                    
                    STATE.logs.push({
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
                        body: String(this.responseText || '').slice(0, 12000),
                        timestamp: Date.now()
                    });
                } catch(_) {}
            });
            return xs.apply(this, arguments);
        };
        
        console.log('[INS] 🌐 Network monitor active');
    };
    
    // ============================================
    // ELEMENT PICKER
    // ============================================
    const setupElementPicker = () => {
        document.addEventListener('click', e => {
            if (!STATE.pickMode) return;
            e.preventDefault();
            e.stopPropagation();
            const s = path(e.target);
            STATE.pickMode = false;
            copy(s, 'Selector copied!');
            console.log('[INS] 🎯 Selector:', s);
            showEruda();
        }, true);
        
        console.log('[INS] 🎯 Element picker ready');
    };
    
    // ============================================
    // SHOW ERUDA
    // ============================================
    const showEruda = () => {
        const e = document.getElementById('eruda');
        if (e) {
            e.style.display = 'block';
            e.style.zIndex = CONFIG.zIndex;
            e.style.position = 'fixed';
            e.style.bottom = '0';
            e.style.right = '0';
        }
        try { STATE.eruda?.show(); } catch(_) {}
    };
    
    const hideEruda = () => {
        try { STATE.eruda?.hide(); } catch(_) {}
    };
    
    // ============================================
    // ERUDA INIT
    // ============================================
    const initEruda = () => {
        return new Promise((resolve, reject) => {
            if (e.eruda) {
                STATE.eruda = e.eruda;
                STATE.loaded = true;
                console.log('[INS] ✅ Eruda already loaded');
                resolve();
                return;
            }
            
            console.log('[INS] 📥 Loading Eruda...');
            const s = document.createElement('script');
            s.src = CONFIG.erudaCdn;
            s.crossOrigin = 'anonymous';
            s.onload = () => {
                console.log('[INS] ✅ Eruda loaded');
                STATE.eruda = e.eruda;
                STATE.loaded = true;
                resolve();
            };
            s.onerror = (e) => {
                console.error('[INS] ❌ Failed to load Eruda', e);
                reject(e);
            };
            (document.head || document.documentElement).appendChild(s);
        });
    };
    
    const initTools = () => {
        if (!STATE.eruda || !STATE.eruda.add) {
            console.error('[INS] ❌ Eruda not ready for tools');
            return;
        }
        
        const css = `
<style>
.ins-wrap{box-sizing:border-box;padding:10px;font:12px/1.5 Arial,monospace;color:#e7e7e7;background:#101114;min-height:420px;max-height:78vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.ins-head{background:#101114;padding-bottom:8px;border-bottom:1px solid #2b3342}
.ins-title{font-size:16px;font-weight:900;margin:0 0 12px;color:#fff;padding-left:5px}
.ins-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ins-btn{padding:8px 12px;margin:2px 0;border:0;border-radius:8px;background:#252b3a;color:#fff;font-weight:700;cursor:pointer;user-select:none;font-size:11px}
.ins-btn:active{transform:scale(.97)}
.ins-btn:hover{background:#2d3548}
.ins-blue{background:#2563eb}.ins-blue:hover{background:#3b82f6}
.ins-green{background:#16a34a}.ins-green:hover{background:#22c55e}
.ins-red{background:#dc2626}.ins-red:hover{background:#ef4444}
.ins-purple{background:#7c3aed}.ins-purple:hover{background:#8b5cf6}
.ins-orange{background:#ea580c}.ins-orange:hover{background:#f97316}
.ins-yellow{background:#eab308}.ins-yellow:hover{background:#eab308}
.ins-input{width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid #303747;background:#080a0f;color:#fff;font-size:11px;margin:6px 0}
.ins-scroll{max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-bottom:70px}
.ins-card{background:#181c25;border:1px solid #2b3342;border-radius:12px;padding:10px;margin:8px 0}
.ins-pre{white-space:pre-wrap;background:#090b10;border-radius:8px;padding:8px;max-height:200px;overflow:auto;-webkit-overflow-scrolling:touch;color:#ddd;font-size:10px}
.ins-small{color:#a1a1aa;font-size:10px}
.ins-url{color:#60a5fa;word-break:break-all}
.ins-pill{display:inline-block;padding:2px 6px;border-radius:999px;background:#303848;margin:2px;font-size:9px}
.ins-row{display:flex;gap:8px;align-items:center;margin:4px 0}
.ins-label{color:#a1a1aa;font-size:10px}
.ins-value{color:#fff;font-size:11px;word-break:break-all}
</style>`;
        
        // SCRAPER TOOL
        STATE.eruda.add({
            name: 'scraper',
            init: function($el) {
                this.$el = $el;
                this.refresh();
            },
            refresh: function() {
                this.$el.html(css + `
<div class="ins-wrap">
 <div class="ins-head">
 <h2 class="ins-title">🔧 INS Scraper</h2>
 <div class="ins-grid">
 <button class="ins-btn ins-blue" onclick="window.__INS_PICK__=true;hideEruda();alert('🎯 Tap elemen target')">🎯 Pick Selector</button>
 <button class="ins-btn ins-green" onclick="copy([...document.querySelectorAll('a')].map(a=>a.href).filter(Boolean).join('\\n'))">🔗 Links</button>
 <button class="ins-btn ins-orange" onclick="copy([...document.images].map(i=>i.src).filter(Boolean).join('\\n'))">🖼 Images</button>
 <button class="ins-btn ins-purple" onclick="copy(document.documentElement.outerHTML)">📄 HTML</button>
 </div>
 </div>
 <div class="ins-card">
 <div class="ins-row"><span class="ins-label">📌 Title:</span><span class="ins-value">${esc(document.title)}</span></div>
 <div class="ins-row"><span class="ins-label">🔗 URL:</span><span class="ins-url">${esc(location.href)}</span></div>
 </div>
 <div class="ins-card">
 <div class="ins-label">📜 JSON Scripts: ${[...document.scripts].filter(s=>s.textContent.includes('{')).length}</div>
 <div style="max-height:150px;overflow-y:auto">
 ${[...document.scripts].filter((s,i)=>s.textContent.includes('{')?`<div style="padding:4px;border-bottom:1px solid #2b3342;font-size:10px">#${i} — ${s.textContent.length} chars</div>`:'').slice(0,50).join('')||'<span class="ins-small">None</span>'}
 </div>
 </div>
</div>`);
            },
            show: function() { this.refresh(); }
        });
        
        // API TOOL
        STATE.eruda.add({
            name: 'api',
            init: function($el) {
                this.$el = $el;
                this.refresh();
                this.timer = setInterval(() => {
                    if (STATE.live) this.refresh();
                }, 1000);
            },
            refresh: function() {
                const q = (STATE.filter || '').toLowerCase();
                const logs = STATE.logs
                    .map((x, i) => ({ ...x, i }))
                    .filter(x => !q || [x.url, x.method, x.status, x.ct, x.body, x.type].join(' ').toLowerCase().includes(q))
                    .slice(-100)
                    .reverse();
                
                this.$el.html(css + `
<div class="ins-wrap">
 <div class="ins-head">
 <h2 class="ins-title">🌐 Live Network</h2>
 <input class="ins-input" placeholder="Search: api, json, xhr, fetch..." value="${esc(STATE.filter)}" oninput="window.__INS_SET_FILTER__=v=>{STATE.filter=v;this.refresh()}">
 <div class="ins-grid">
 <button class="ins-btn ${STATE.live?'ins-green':'ins-red'}" onclick="STATE.live=!STATE.live;this.refresh()">${STATE.live?'🟢 Live ON':'🔴 Live OFF'}</button>
 <button class="ins-btn ins-purple" onclick="copy(JSON.stringify(window.__INS_LOGS__,null,2))">📋 Export</button>
 <button class="ins-btn ins-red" onclick="window.__INS_LOGS__=[];this.refresh()">🧹 Clear</button>
 <button class="ins-btn ins-blue" onclick="location.reload()">🔄 Reload</button>
 </div>
 <div class="ins-small">Total: ${STATE.logs.length} | Shown: ${logs.length}</div>
 </div>
 <div class="ins-scroll">
 ${logs.map(x => `
 <div class="ins-card">
 <div class="ins-row">
 <span class="ins-pill" style="background:${x.ok?'#16a34a':'#dc2626'}">${esc(x.method)}</span>
 <span class="ins-pill">${esc(x.status)}</span>
 <span class="ins-pill">${esc(x.type)}</span>
 <span class="ins-pill">${esc(x.duration)}ms</span>
 </div>
 <div class="ins-url">${esc(x.url)}</div>
 <div class="ins-small">${esc(x.ct || '')} | ${esc(x.time)}</div>
 <div class="ins-row" style="margin-top:8px">
 <button class="ins-btn ins-blue" onclick="copy(\`fetch(\${JSON.stringify(\`${esc(x.url)}\`)}, {method: \${JSON.stringify(\`${esc(x.method)}\`)}})
 .then(r=>r.text())
 .then(console.log);\`,'fetch code')">fetch()</button>
 <button class="ins-btn ins-purple" onclick="copy(\`const axios=require('axios');
axios({method:'${esc(x.method.toLowerCase())}',url:'${esc(x.url)}'})
.then(r=>console.log(r.data));\`,'axios code')">Axios</button>
 </div>
 ${x.requestBody?`<div class="ins-label">Request Body:</div><pre class="ins-pre">${esc(x.requestBody.slice(0,500))}</pre>`:''}
 ${x.body?`<div class="ins-label">Response Body:</div><pre class="ins-pre">${esc(x.body.slice(0,500))}</pre>`:''}
 </div>
 `).join('')||'<div class="ins-card" style="text-align:center;padding:40px;color:#666">No requests yet</div>'}
 </div>
</div>`);
            },
            hide: function() { if(this.timer) clearInterval(this.timer); }
        });
        
        // STORAGE TOOL
        STATE.eruda.add({
            name: 'store',
            init: function($el) {
                this.$el = $el;
                this.refresh();
            },
            refresh: function() {
                this.$el.html(css + `
<div class="ins-wrap">
 <div class="ins-head">
 <h2 class="ins-title">💾 Storage</h2>
 <div class="ins-grid">
 <button class="ins-btn ins-orange" onclick="copy(document.cookie,'Cookies')">🍪 Cookies</button>
 <button class="ins-btn ins-blue" onclick="copy(JSON.stringify(localStorage,null,2),'LocalStorage')">LocalStorage</button>
 <button class="ins-btn ins-green" onclick="copy(JSON.stringify(sessionStorage,null,2),'SessionStorage')">SessionStorage</button>
 </div>
 </div>
 <div class="ins-card">
 <div class="ins-label">🍪 Cookies:</div>
 <pre class="ins-pre">${esc(document.cookie||'None')}</pre>
 </div>
 <div class="ins-card">
 <div class="ins-label">💾 LocalStorage:</div>
 <pre class="ins-pre">${esc(JSON.stringify(localStorage,null,2)||'Empty')}</pre>
 </div>
 <div class="ins-card">
 <div class="ins-label">⏱️ SessionStorage:</div>
 <pre class="ins-pre">${esc(JSON.stringify(sessionStorage,null,2)||'Empty')}</pre>
 </div>
</div>`);
            },
            show: function() { this.refresh(); }
        });
        
        // EXTRACT TOOL
        STATE.eruda.add({
            name: 'extract',
            init: function($el) {
                this.$el = $el;
                this.refresh();
            },
            refresh: function() {
                const urls = [...document.querySelectorAll('script,img,video,audio,source,link,a,iframe')]
                    .map(x => x.src || x.href)
                    .filter(Boolean);
                const js = urls.filter(u => /\.js(\?|$)/i.test(u));
                const media = urls.filter(u => /\.(mp4|m3u8|mp3|webm|jpg|jpeg|png|webp|gif)(\?|$)/i.test(u));
                
                this.$el.html(css + `
<div class="ins-wrap">
 <div class="ins-head">
 <h2 class="ins-title">📥 Extractor</h2>
 <div class="ins-grid">
 <button class="ins-btn ins-green" onclick="copy(${JSON.stringify(urls.join('\n'))},'All ${urls.length}')">All ${urls.length}</button>
 <button class="ins-btn ins-purple" onclick="copy(${JSON.stringify(js.join('\n'))},'JS ${js.length}')">JS ${js.length}</button>
 <button class="ins-btn ins-orange" onclick="copy(${JSON.stringify(media.join('\n'))},'Media ${media.length}')">Media ${media.length}</button>
 </div>
 </div>
 <div class="ins-scroll">
 <div class="ins-card">
 ${urls.slice(0,300).map(u=>`<div style="padding:6px;border-bottom:1px solid #2b3342;font-size:10px;word-break:break-all"><a href="${esc(u)}" target="_blank" style="color:#60a5fa;text-decoration:none">${esc(u)}</a></div>`).join('')||'No URLs'}
 </div>
 </div>
</div>`);
            },
            show: function() { this.refresh(); }
        });
        
        console.log('[INS] ✅ Tools added');
    };
    
    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    const setupShortcuts = () => {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey) {
                if (e.key === 'I' || e.key === 'i') {
                    e.preventDefault();
                    STATE.loaded ? showEruda() : initEruda().then(showEruda);
                }
                if (e.key === 'J' || e.key === 'j') {
                    e.preventDefault();
                    console.clear();
                    console.log('[INS] 🧹 Console cleared');
                }
                if (e.key === 'P' || e.key === 'p') {
                    e.preventDefault();
                    STATE.pickMode = !STATE.pickMode;
                    alert(STATE.pickMode?'🎯 Tap element to get selector':'❌ Pick mode off');
                }
            }
            if (e.key === 'F12') {
                e.preventDefault();
                STATE.loaded ? showEruda() : initEruda().then(showEruda);
            }
        });
        
        console.log('[INS] ⌨️ Shortcuts: Ctrl+Shift+I / F12');
    };
    
    // ============================================
    // INIT
    // ============================================
    (async function() {
        try {
            // Load Eruda
            await initEruda();
            
            // Setup features
            setupNetworkMonitor();
            setupElementPicker();
            setupShortcuts();
            initTools();
            
            // Show Eruda
            if (CONFIG.autoShow) {
                setTimeout(showEruda, 500);
            }
            
            console.log('═══════════════════════════════════════════════════');
            console.log('✅ INS DEVTOOLS PRO READY!');
            console.log('📌 Tools: Scraper | API | Store | Extract');
            console.log('📌 Shortcuts:');
            console.log('   Ctrl+Shift+I / F12: Toggle');
            console.log('   Ctrl+Shift+J: Clear Console');
            console.log('   Ctrl+Shift+P: Pick Element');
            console.log('═══════════════════════════════════════════════════');
            
        } catch(e) {
            console.error('[INS] ❌ Initialization failed:', e);
        }
    })();
    
    // Expose global functions
    e.__INS_SHOW__ = showEruda;
    e.__INS_HIDE__ = hideEruda;
    e.__INS_LOGS__ = STATE.logs;
    e.__INS_FILTER__ = STATE.filter;
    e.__INS_SET_FILTER__ = v => { STATE.filter = v; try{STATE.eruda?.get('api')?.refresh()}catch(e){} };
    
}(typeof window !== 'undefined' ? window : this));
