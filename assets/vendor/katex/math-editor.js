/* Pratinjau LaTeX langsung untuk textarea soal & pilihan jawaban.
 * Dipakai halaman admin/guru yang meng-include assets/includes/katex_head.php.
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
    var SELECTOR = 'textarea[data-math-preview], #soal, #a, #b, #c, #d, #e';

    function attach(ta) {
        if (ta.getAttribute('data-math-preview-attached') === '1') return;
        ta.setAttribute('data-math-preview-attached', '1');

        var box = document.createElement('div');
        box.className = 'math-live-preview mt-1 rounded-md border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm text-gray-800';
        box.style.whiteSpace = 'pre-wrap';
        box.style.display = 'none';
        ta.insertAdjacentElement('afterend', box);

        var timer = null;
        function render() {
            var text = (ta.value || '').replace(/<!--[\s\S]*?-->/g, '').trim();
            if (!text) {
                box.style.display = 'none';
                box.textContent = '';
                return;
            }
            box.style.display = 'block';
            box.textContent = text;
            if (typeof renderMathInElement === 'function') {
                try { renderMathInElement(box, OPTS); } catch (e) { /* biarkan teks apa adanya */ }
            }
        }

        ta.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(render, 120);
        });
        render();
        if (document.getElementById('soal')) buildOptionToolbar(ta);
    }

    /* Toolbar ringkas untuk kolom pilihan jawaban (soal sudah punya toolbar sendiri). */
    function buildOptionToolbar(ta) {
        if (!/^[a-e]$/.test(ta.id) || ta.getAttribute('data-math-toolbar') === '1') return;
        ta.setAttribute('data-math-toolbar', '1');

        var defs = [
            ['a/b', '$\\dfrac{}{}$', 'Pecahan'],
            ['\u221a', '$\\sqrt{}$', 'Akar'],
            ['x\u00b2', '$^{}$', 'Pangkat'],
            ['\u00d7', '$\\times$', 'Kali'],
            ['\u00f7', '$\\div$', 'Bagi'],
            ['\u2264', '$\\le$', 'Kurang dari / sama dengan'],
            ['\u2265', '$\\ge$', 'Lebih dari / sama dengan']
        ];
        var bar = document.createElement('div');
        bar.className = 'math-toolbar mt-1 flex flex-wrap items-center gap-1';
        for (var i = 0; i < defs.length; i++) {
            (function (def) {
                var b = document.createElement('button');
                b.type = 'button';
                b.textContent = def[0];
                b.title = def[2];
                b.className = 'px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600';
                b.addEventListener('click', function (e) {
                    e.preventDefault();
                    ta.focus();
                    if (typeof window.insertMathTemplate === 'function') {
                        window.insertMathTemplate(def[1]);
                    }
                });
                bar.appendChild(b);
            })(defs[i]);
        }
        ta.insertAdjacentElement('afterend', bar);
    }

    function scan(root) {
        var nodes = (root || document).querySelectorAll(SELECTOR);
        for (var i = 0; i < nodes.length; i++) attach(nodes[i]);
    }

    window.mathEditorScan = scan;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scan(document); });
    } else {
        scan(document);
    }

    if (window.MutationObserver && document.body) {
        new MutationObserver(function () { scan(document); })
            .observe(document.body, { childList: true, subtree: true });
    }
})();
