/* KaTeX auto-render init (dipakai halaman admin/guru/peserta).
 * Scope default: .katex-scope — override lewat window.KATEX_SCOPE sebelum file ini dimuat.
 */
(function () {
    var OPTS = {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        strict: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'option', 'code']
    };

    function render() {
        if (typeof renderMathInElement !== 'function') return false;
        var sel = window.KATEX_SCOPE || '.katex-scope';
        var nodes = document.querySelectorAll(sel);
        for (var i = 0; i < nodes.length; i++) {
            try { renderMathInElement(nodes[i], OPTS); } catch (e) { /* biarkan teks apa adanya */ }
        }
        return true;
    }

    function boot() {
        if (render()) return;
        var n = 0;
        var t = setInterval(function () {
            if (render() || ++n > 40) clearInterval(t);
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    window.katexRenderAll = render;
})();
