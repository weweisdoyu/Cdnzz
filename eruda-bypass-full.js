// ==UserScript==
// @name         Eruda Bypass Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enhanced Eruda bypass with improved UI visibility, anti-detection, and extended features for all websites.
// @author       Manus AI
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Eruda Bypass] 🔧 Loading Enhanced Eruda...");

    // --- Anti-Detection Mechanisms ---

    // 1. Override debugger to noop
    window.debugger = function() {};

    // 2. Spoof Function.prototype.constructor to strip debugger statements from strings
    const originalConstructor = Function.prototype.constructor;
    Function.prototype.constructor = new Proxy(originalConstructor, {
        apply(target, thisArg, args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('debugger')) {
                args[0] = args[0].replace(/debugger/g, '');
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    // 3. Spoof Function.prototype.toString to hide overrides (especially debugger function)
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = new Proxy(originalToString, {
        apply(target, thisArg, args) {
            if (thisArg === window.debugger) {
                return 'function debugger() { [native code] }';
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    // 4. Override eval to strip debugger statements from any eval'd code
    const originalEval = window.eval;
    window.eval = function(code) {
        if (typeof code === 'string') {
            code = code.replace(/debugger;?/g, '');
        }
        return originalEval(code);
    };

    // 5. Override console methods to disable traps and weird behaviors
    ['log', 'debug', 'error', 'info', 'warn'].forEach(method => {
        const originalMethod = console[method];
        console[method] = function(...args) {
            // Skip logging if args include certain trap images or weird data (optional)
            for (const arg of args) {
                if (arg instanceof Image) return; // Example: bypass image-based console detection
            }
            return originalMethod.apply(console, args);
        };
    });

    // 6. Block console.clear to prevent wiping logs
    console.clear = function () {
        console.log('[Eruda Bypass] Blocked console.clear()');
    };

    // 7. Spoof window.outerWidth and outerHeight to match inner dimensions (for devtools detection)
    function spoofWindowSize() {
        Object.defineProperty(window, 'outerWidth', {
            get: () => window.innerWidth,
            configurable: true
        });
        Object.defineProperty(window, 'outerHeight', {
            get: () => window.innerHeight,
            configurable: true
        });
    }
    spoofWindowSize();
    // Repeat periodically to counter site attempts to redefine
    setInterval(spoofWindowSize, 1000);

    // 8. Override setInterval and setTimeout to prevent debugger loops and constructor checks
    const _origSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
        const callbackStr = callback.toString();
        if (callbackStr.includes("debugger") || callbackStr.includes("constructor")) {
            console.warn("[Eruda Bypass] Blocked suspicious setInterval call.");
            return -1;
        }
        return _origSetInterval(callback, delay);
    };

    const _origSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        const callbackStr = callback.toString();
        if (callbackStr.includes("debugger")) {
            console.warn("[Eruda Bypass] Blocked suspicious setTimeout call.");
            return -1;
        }
        return _origSetTimeout(callback, delay);
    };

    console.log("[Eruda Bypass] ✅ Anti-detection mechanisms active.");

    // --- Eruda Loading and Initialization ---

    const erudaScriptUrl = "https://cdn.jsdelivr.net/npm/eruda";
    const erudaPlugins = [
        "https://cdn.jsdelivr.net/npm/eruda-fps",
        "https://cdn.jsdelivr.net/npm/eruda-features",
        "https://cdn.jsdelivr.net/npm/eruda-timing",
        "https://cdn.jsdelivr.net/npm/eruda-memory",
        "https://cdn.jsdelivr.net/npm/eruda-code",
        "https://cdn.jsdelivr.net/npm/eruda-dom",
        "https://cdn.jsdelivr.net/npm/eruda-orientation",
        "https://cdn.jsdelivr.net/npm/eruda-touches",
        "https://cdn.jsdelivr.net/npm/eruda-monitor",
        "https://cdn.jsdelivr.net/npm/eruda-benchmark",
        "https://cdn.jsdelivr.net/npm/eruda-geolocation"
    ];

    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = () => console.error(`[Eruda Bypass] Failed to load script: ${url}`);
        document.head.appendChild(script);
    }

    // Function to inject Eruda and its plugins
    function injectEruda() {
        loadScript(erudaScriptUrl, () => {
            if (!window.eruda) {
                console.error("[Eruda Bypass] ❌ Eruda not found after loading script.");
                return;
            }
            console.log("[Eruda Bypass] 🚀 Initializing Eruda...");
            window.eruda.init({
                useShadowDom: true, // Use Shadow DOM for better isolation
                tool: [
                    'console', 'elements', 'network', 'resources', 'sources', 'info', 'snippets',
                    'fps', 'features', 'timing', 'memory', 'code', 'dom', 'orientation', 'touches',
                    'monitor', 'benchmark', 'geolocation'
                ]
            });

            // Load plugins dynamically
            let pluginsLoaded = 0;
            erudaPlugins.forEach(pluginUrl => {
                loadScript(pluginUrl, () => {
                    const pluginName = pluginUrl.split('/').pop().replace('eruda-', '').replace('.js', '');
                    if (window.eruda[pluginName]) {
                        window.eruda.add(window.eruda[pluginName]);
                        console.log(`[Eruda Bypass] ✅ Loaded plugin: ${pluginName}`);
                    } else {
                        console.warn(`[Eruda Bypass] ⚠️ Plugin object not found for: ${pluginName}`);
                    }
                    pluginsLoaded++;
                    if (pluginsLoaded === erudaPlugins.length) {
                        console.log("[Eruda Bypass] ✅ All plugins loaded.");
                        forceErudaUIVisibility();
                    }
                });
            });

            // Ensure Eruda UI is visible and styled correctly
            function forceErudaUIVisibility() {
                const erudaContainer = document.getElementById('eruda');
                const erudaEntryBtn = document.querySelector('.eruda-entry-btn');

                if (erudaContainer) {
                    erudaContainer.style.cssText = 'z-index: 2147483647 !important; position: fixed !important; display: block !important; opacity: 1 !important; visibility: visible !important;';
                    console.log("[Eruda Bypass] ✅ Eruda container forced visible.");
                }
                if (erudaEntryBtn) {
                    erudaEntryBtn.style.cssText = 'z-index: 2147483647 !important; position: fixed !important; display: block !important; opacity: 1 !important; visibility: visible !important;';
                    console.log("[Eruda Bypass] ✅ Eruda entry button forced visible.");
                }
                window.eruda.show();
                console.log("[Eruda Bypass] 🎉 Eruda UI should be visible now!");
            }

            // Periodically check and force UI visibility
            setInterval(forceErudaUIVisibility, 2000);

            // Keyboard shortcuts for toggling Eruda
            window.addEventListener('keydown', function(e) {
                if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || e.key === 'F12') {
                    e.preventDefault();
                    setTimeout(() => {
                        const erudaEl = document.getElementById('eruda');
                        if (window.eruda) {
                            if (erudaEl && erudaEl.style.display !== 'none') {
                                window.eruda.hide();
                            } else {
                                window.eruda.show();
                            }
                        }
                    }, 100);
                }
            });

        });
    }

    // Attempt to inject Eruda after document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectEruda);
    } else {
        injectEruda();
    }

    console.log("[Eruda Bypass] ⏳ Waiting for Eruda to load...");

})();
