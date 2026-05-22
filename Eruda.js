/**
 * ============================================
 * ERUDA BYPASS PRO - FULL BOOKMARKLET
 * ============================================
 * 
 * SINGLE FILE - Copy semua code ini untuk bookmarklet
 * 
 * Features:
 * - Full Eruda DevTools (Console, Elements, Network, dll)
 * - Console Bypass (restore blocked methods)
 * - Network Monitor (XHR + Fetch)
 * - Anti-Anti-Debug Protection
 * - Z-Index MAX (999999)
 * - Auto-Show on Load
 * - Keyboard Shortcuts
 * - Periodic Style Restoration
 * 
 * Usage:
 * 1. Copy SEMUA code di bawah ini
 * 2. Buat bookmark baru di browser
 * 3. Paste code di URL field
 * 4. Save dengan nama "Eruda Bypass"
 * 5. Klik bookmark di website manapun!
 */

javascript:!function(){function e(e){console.log("[Eruda Bypass] "+e)}function t(){const e=["log","warn","error","info","debug","trace","dir","table","group","groupCollapsed","groupEnd","time","timeEnd","count","assert"],t={};e.forEach(e=>{console[e]&&(t[e]=console[e].bind(console))}),window._safeConsole={_backup:t};e.forEach(e=>{window._safeConsole[e]=function(...n){try{t[e](...n),console[e](...n)}catch(e){try{console.log("[SafeConsole]",e,...n)}catch(e){}}}}),e.log("[Bypass] ✅ Console restored")}function n(){const e=setInterval;window.setInterval=function(t,n){const o=t.toString?t.toString():"";return o.includes("debugger")||o.includes("constructor")?(console.log("[Bypass] ⚠️ Blocked debugger trap"),-1):e(t,n)};const t=setTimeout;window.setTimeout=function(e,n){const o=e.toString?e.toString():"";return o.includes("debugger")?(console.log("[Bypass] ⚠️ Blocked debugger timeout"),-1):t(e,n)}}function o(){const e=XMLHttpRequest.prototype,t=e.open,n=e.send;e.open=function(e,n,...o){this._method=e,this._url=n,this._startTime=Date.now();return t.apply(this,[e,n,...o])},e.send=function(e){const t=this;return t.addEventListener("load",function(){const n=Date.now()-t._startTime;console.log(`[Network] ${t._method} ${t._url} - ${t.status} (${n}ms)`)}),n.apply(this,[e])};const o=window.fetch;window.fetch=async function(e,t){const n="string"==typeof e?e:e.url,r=t?.method||"GET",i=Date.now();try{const a=await o(e,t),s=Date.now()-i;return console.log(`[Network] ${r} ${n} - ${a.status} (${s}ms)`),a}catch(e){const t=Date.now()-i;throw console.error(`[Network] ${r} ${n} - FAILED (${t}ms)`,e),e}}}function r(){document.addEventListener("keydown",function(e){e.ctrlKey&&e.shiftKey&&("I"===e.key||"i"===e.key")&&(e.preventDefault(),function(){const e=document.getElementById("eruda");e&&"none"!==e.style.display?window.eruda.hide():window.eruda.show()}()),"F12"===e.key&&(e.preventDefault(),function(){const e=document.getElementById("eruda");e&&"none"!==e.style.display?window.eruda.hide():window.eruda.show()}()),e.ctrlKey&&e.shiftKey&&("J"===e.key||"j"===e.key")&&(e.preventDefault(),console.clear())})}function i(){setInterval(()=>{const e=document.getElementById("eruda");e&&(e.style.zIndex="999999",e.style.position="fixed");const t=document.querySelector(".eruda-entry-btn");t&&(t.style.zIndex="1000000",t.style.display="block")},2e3)}function a(){if(!window.eruda)return void console.error("[Eruda] Not loaded!");const e=window.eruda.show.bind(window.eruda);window.eruda.show=function(t){const n=e(t);return setTimeout(()=>{const e=document.getElementById("eruda");e&&(e.style.zIndex="999999",e.style.position="fixed")},50),n},setTimeout(()=>{window.eruda.show();const e=document.getElementById("eruda");e&&(e.style.zIndex="999999",e.style.position="fixed"),console.log("[Eruda Bypass] ✅ Ready!"),console.log("═══════════════════════════════════════"),console.log("📌 Shortcuts:"),console.log("   Ctrl+Shift+I - Toggle Eruda"),console.log("   F12 - Toggle Eruda"),console.log("   Ctrl+Shift+J - Clear Console"),console.log("═══════════════════════════════════════")},500)}function s(){e("Loading Eruda from CDN...");const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/eruda@3.0.1/dist/eruda.min.js",t.crossOrigin="anonymous",t.onload=()=>{e("✅ Eruda loaded"),setTimeout(()=>{window.eruda?(window.eruda.init({useShadowDom:!1,tool:["console","elements","network","resources","sources","info","snippets"]}),e("✅ Eruda initialized"),t(),n(),o(),r(),i(),a()):console.error("[Eruda] Not initialized!")},500)},t.onerror=()=>{console.error("[Eruda] Failed, trying fallback..."),t.src="https://unpkg.com/eruda@3.0.1/eruda.js"},document.body.appendChild(t)}e("🚀 Starting..."),t(),s(),console.log("═══════════════════════════════════════"),console.log("🔧 ERUDA BYPASS PRO"),console.log("📌 Wait for Eruda to load..."),console.log("═══════════════════════════════════════")}();

/**
 * ============================================
 * END OF BOOKMARKLET
 * ============================================
 * 
 * Cara pakai:
 * 1. Copy SEMUA code di atas (dari javascript:!function() sampai })();
 * 2. Buat bookmark baru
 * 3. Paste di URL field
 * 4. Save
 * 5. Klik bookmark di website manapun!
 * 
 * Features:
 * ✅ Console Bypass
 * ✅ Network Monitor
 * ✅ Anti-Anti-Debug
 * ✅ Z-Index MAX
 * ✅ Auto-Show
 * ✅ Keyboard Shortcuts
 */
