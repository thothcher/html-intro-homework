/* =====================================================
   დამხმარე ფუნქციები
   ===================================================== */
const TYPE_LABEL = {
    choice: 'ტესტი',
    order: 'თანმიმდევრობა',
    bug: 'იპოვე შეცდომა',
    fill: 'ჩაწერე',
    match: 'შესაბამისობა'
};

function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
        if (k === 'class') e.className = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, '');
        else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) e.append(kid);
    return e;
}

const $ = id => document.getElementById(id);

// სურათი კითხვაში: { src, alt, w, h, caption }
function figure(img, cls) {
    return h('figure', { class: 'fig' + (cls ? ' ' + cls : '') },
        h('img', { src: img.src, alt: img.alt, width: img.w, height: img.h, loading: 'lazy', decoding: 'async' }),
        img.caption ? h('figcaption', {}, img.caption) : null);
}

// ფანჯარა confirm()-ის ნაცვლად. ask({ title, text, ok, cancel }) -> Promise<boolean>
function ask({ title, text, ok = 'კარგი', cancel = '' }) {
    return new Promise(resolve => {
        const dlg = h('dialog', { class: 'modal', 'aria-labelledby': 'dlgTitle', 'aria-describedby': 'dlgText' });
        const finish = value => { dlg.close(); dlg.remove(); resolve(value); };
        const yes = h('button', { type: 'button', class: 'btn modal-ok', onclick: () => finish(true) }, ok);
        const no = cancel ? h('button', { type: 'button', class: 'btn ghost modal-cancel', onclick: () => finish(false) }, cancel) : null;
        dlg.append(h('div', { class: 'modal-in' },
            h('h3', { id: 'dlgTitle' }, title),
            h('p', { id: 'dlgText' }, text),
            h('div', { class: 'modal-actions' }, no, yes)));
        dlg.addEventListener('cancel', e => { e.preventDefault(); finish(false); });     // Esc
        dlg.addEventListener('click', e => { if (e.target === dlg) finish(false); });      // დაწკაპუნება ფანჯრის გარეთ
        document.body.append(dlg);
        dlg.showModal();
        (no || yes).focus();                  // შემთხვევითი დაჭერისგან დასაცავად ფოკუსი „უკან დაბრუნებაზეა“
    });
}

/* კოდის ფერადი გამოყოფა VS Code-ის მსგავსად. ორი ენაა: HTML (თეგი, ატრიბუტი, მნიშვნელობა, კომენტარი, სიმბოლო &lt;)
   და JavaScript (საკვანძო სიტყვა, სტრიქონი, რიცხვი, ფუნქცია, კლასი). ენას ტესტი განსაზღვრავს (QUIZ.lang).
   ბრაუზერის DOM-ით ვაგებთ (არა innerHTML-ით), ამიტომ ტექსტი ყოველთვის უსაფრთხოა.
   opts.slot - ელემენტი (მაგ. input), რომელიც ჩაჯდება ტექსტში ადგილის მაჩვენებლის ადგილას (HTML-ში {}, JavaScript-ში ____). */
const TOK = {
    comment: /<!--[\s\S]*?(-->|$)/y,
    doctype: /<!DOCTYPE/iy,
    tagOpen: /<(\/?)([A-Za-z][\w:-]*)/y,
    entity: /&#?\w+;/y,
    text: /[^<&]+/y,
    ws: /\s+/y,
    tagEnd: /\/?>/y,
    attr: /[^\s=>\/"']+/y,
    str: /"[^"]*("|$)|'[^']*('|$)/y
};

const JS_TOK = {
    comment: /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y,
    str: /'(?:[^'\\\n]|\\.)*(?:'|$)|"(?:[^"\\\n]|\\.)*(?:"|$)/y,
    tpl: /`(?:[^`\\]|\\[\s\S])*(?:`|$)/y,
    num: /\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?/iy,
    id: /[A-Za-z_$][\w$]*/y,
    ws: /\s+/y
};
const JS_CONTROL = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'await', 'yield', 'import', 'export']);
const JS_KEYWORD = new Set(['const', 'let', 'var', 'function', 'class', 'extends', 'static', 'get', 'set', 'typeof', 'instanceof', 'in', 'of', 'new', 'void', 'delete', 'this', 'super', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'async']);

function tokenizeHtml(src, inTag) {
    const out = [];
    const put = (cls, text) => { if (text) out.push([cls, text]); };
    const at = re => { re.lastIndex = i; return re.exec(src); };
    let i = 0;

    while (i < src.length) {
        let m;
        if (!inTag) {
            if ((m = at(TOK.comment))) { put('t-com', m[0]); i += m[0].length; }
            else if ((m = at(TOK.doctype))) { put('t-punct', '<!'); put('t-tag', m[0].slice(2)); i += m[0].length; inTag = true; }
            else if ((m = at(TOK.tagOpen))) { put('t-punct', '<' + m[1]); put('t-tag', m[2]); i += m[0].length; inTag = true; }
            else if ((m = at(TOK.entity))) { put('t-ent', m[0]); i += m[0].length; }
            else if ((m = at(TOK.text))) { put('', m[0]); i += m[0].length; }
            else { put('', src[i]); i++; }
        } else {
            if ((m = at(TOK.tagEnd))) { put('t-punct', m[0]); i += m[0].length; inTag = false; }
            else if ((m = at(TOK.ws))) { put('', m[0]); i += m[0].length; }
            else if ((m = at(TOK.str))) { put('t-str', m[0]); i += m[0].length; }
            else if ((m = at(TOK.attr))) { put('t-attr', m[0]); i += m[0].length; }
            else { put('', src[i]); i++; }
        }
    }
    return out;
}

function tokenizeJs(src) {
    const out = [];
    const at = re => { re.lastIndex = i; return re.exec(src); };
    let i = 0;
    let prev = '';          // ბოლო არა-ჰარი სიმბოლო: წერტილის შემდეგ სახელი თვისებაა (user.name), საკვანძო სიტყვა არა

    while (i < src.length) {
        let m;
        if ((m = at(JS_TOK.comment))) { out.push(['t-com', m[0]]); i += m[0].length; }
        else if ((m = at(JS_TOK.str))) { out.push(['j-str', m[0]]); i += m[0].length; prev = 'x'; }
        else if ((m = at(JS_TOK.tpl))) {
            // შაბლონურ სტრიქონში ${...} ნაწილი კოდად ფერადდება
            let k = 0;
            for (const part of m[0].matchAll(/\$\{([^}]*)\}/g)) {
                if (part.index > k) out.push(['j-str', m[0].slice(k, part.index)]);
                out.push(['j-kw', '${'], ...tokenizeJs(part[1]), ['j-kw', '}']);
                k = part.index + part[0].length;
            }
            if (k < m[0].length) out.push(['j-str', m[0].slice(k)]);
            i += m[0].length;
            prev = 'x';
        }
        else if ((m = at(JS_TOK.num))) { out.push(['j-num', m[0]]); i += m[0].length; prev = 'x'; }
        else if ((m = at(JS_TOK.id))) {
            const w = m[0];
            const call = src[i + w.length] === '(';
            let cls;
            if (prev === '.') cls = call ? 'j-fn' : 'j-var';
            else if (JS_CONTROL.has(w)) cls = 'j-ctl';
            else if (JS_KEYWORD.has(w)) cls = 'j-kw';
            else if (/^[A-Z]/.test(w)) cls = 'j-cls';
            else cls = call ? 'j-fn' : 'j-var';
            out.push([cls, w]);
            i += w.length;
            prev = 'x';
        }
        else if ((m = at(JS_TOK.ws))) { out.push(['', m[0]]); i += m[0].length; }
        else { out.push(['', src[i]]); prev = src[i]; i++; }
    }
    return out;
}

function renderTokens(tokens, slot, mark) {
    const frag = document.createDocumentFragment();
    for (const [cls, text] of tokens) {
        const box = cls ? h('span', { class: cls }) : frag;
        const parts = slot && text.includes(mark) ? text.split(mark) : [text];
        parts.forEach((p, k) => {
            if (k > 0) box.append(slot);
            if (p) box.append(p);
        });
        if (cls) frag.append(box);
    }
    return frag;
}

function highlight(src, opts = {}) {
    if ((opts.lang || QUIZ.lang) === 'js') return renderTokens(tokenizeJs(src), opts.slot, '____');
    return renderTokens(tokenizeHtml(src, !!opts.inTag), opts.slot, '{}');
}

// მოკლე ფრაგმენტი (ტექსტის შიგნით `...`) JavaScript-ის ტესტში ყოველთვის ფერადდება, HTML-ის ტესტში - მხოლოდ თუ HTML-ს ჰგავს: <p>, &lt;, type="text"
function codeNode(text) {
    if (/^<[!\/]?[A-Za-z]/.test(text)) return highlight(text, { lang: 'html' });
    if (QUIZ.lang === 'js') return highlight(text);
    if (/^[\w-]+="[^"]*"$/.test(text)) return highlight(text, { inTag: true });
    if (/^&#?\w+;$/.test(text)) return highlight(text);
    return text;
}

// `ასე` ჩაწერილ ნაწილს <code>-ად აქცევს (უსაფრთხოდ, textContent-ით). თვით ბრჭყალის საჩვენებლად დაწერე \` (JS-ის სტრიქონში: '\\`')
const unescapeTick = t => t.replace(/\\`/g, '`');
function rich(text) {
    return text.split(/(?<!\\)`/).map((part, i) => (i % 2 ? h('code', {}, codeNode(unescapeTick(part))) : unescapeTick(part)));
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const sameList = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
// HTML-ში დიდი/პატარა ასო და ბრჭყალები არ ითვლება; JavaScript-ში ასოების რეგისტრი მნიშვნელოვანია (getElementById ≠ getelementbyid)
const normalize = s => (QUIZ.lang === 'js'
    ? s.trim().replace(/\s+/g, '').replace(/"/g, "'")
    : s.trim().toLowerCase().replace(/\s+/g, '').replace(/^["']|["']$/g, ''));

// ორდერის კითხვებში ჩაღრმავებას არ ვითვალისწინებთ
QUESTIONS.forEach(q => { if (q.type === 'order') q.correct = q.lines.map(l => l.trim()); });

/* =====================================================
   მდგომარეობა და შეფასება
   ===================================================== */
function initState(q) {
    switch (q.type) {
        case 'choice': return { sel: null, order: shuffle(q.options.map((_, i) => i)) };
        case 'order': {
            let items;
            do { items = shuffle(q.correct); } while (sameList(items, q.correct));
            return { items, touched: false };
        }
        case 'bug': return { sel: new Set() };
        case 'fill': return { val: '' };
        case 'match': return { sel: q.pairs.map(() => ''), opts: shuffle(q.pairs.map(p => p[1])) };
    }
}

let S = QUESTIONS.map(initState);
let submitted = false;
let startedAt = null;   // "ტესტის დაწყებაზე" დაჭერის დრო - აქედან ითვლება დახარჯული დრო
let me = null;          // { name, group, lecturerId, lecturer } - დაწყების შემდეგ
const QUIZ_ID = QUIZ.id;
const fmtTime = sec => (sec > 0 ? Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') : '-');
let pendingPayload = null;

function isAnswered(q, st) {
    switch (q.type) {
        case 'choice': return st.sel !== null;
        case 'order': return st.touched;
        case 'bug': return st.sel.size > 0;
        case 'fill': return st.val.trim() !== '';
        case 'match': return st.sel.every(Boolean);
    }
}

function isCorrect(q, st) {
    switch (q.type) {
        case 'choice': return st.sel === q.answer;
        case 'order': return sameList(st.items, q.correct);
        case 'bug': return st.sel.size === q.bugs.length && q.bugs.every(n => st.sel.has(n));
        case 'fill': return q.accept.map(normalize).includes(normalize(st.val));
        case 'match': return q.pairs.every((p, i) => st.sel[i] === p[1]);
    }
}

function updateProgress() {
    const n = QUESTIONS.filter((q, i) => isAnswered(q, S[i])).length;
    document.getElementById('progressText').textContent = `პასუხი გაცემულია: ${n} / ${QUESTIONS.length}`;
    document.getElementById('progressBar').style.width = (n / QUESTIONS.length * 100) + '%';
    document.querySelector('.track').setAttribute('aria-valuenow', n);
}

/* =====================================================
   კითხვის ტიპების გამოსახვა (review = შეფასების შემდეგ)
   ===================================================== */
function widgetChoice(q, st, qi, review) {
    const wrap = h('div', { class: 'opts', role: 'radiogroup' });
    st.order.forEach(oi => {
        const input = h('input', { type: 'radio', name: 'q' + qi, disabled: review });
        input.checked = st.sel === oi;
        input.addEventListener('change', () => { st.sel = oi; updateProgress(); });
        let cls = 'opt';
        if (review) {
            if (oi === q.answer) cls += ' ok';
            else if (st.sel === oi) cls += ' bad';
        }
        wrap.append(h('label', { class: cls }, input, h('span', {}, rich(q.options[oi]))));
    });
    return wrap;
}

function widgetOrder(q, st, qi, review) {
    const root = h('div');
    const list = h('ul', { class: 'order' });
    root.append(list);
    function move(from, to, focus = true) {
        if (to < 0 || to >= st.items.length || from === to) return;
        const [x] = st.items.splice(from, 1);
        st.items.splice(to, 0, x);
        st.touched = true;
        paint(focus ? { idx: to, dir: to < from ? 'up' : 'down' } : undefined);
        updateProgress();
    }

    // გადათრევა მაუსით ან თითით (Pointer Events). გადათრევისას სიას თავიდან არ ვაგებთ - მხოლოდ ვწევთ ხაზს
    // და ვაჩვენებთ, სად ჩავარდება. ადგილი იცვლება გაშვების მომენტში.
    let dragging = false;
    function startDrag(e, from, li) {
        if (dragging) return;
        dragging = true;
        const items = [...list.children];
        const rects = items.map(el => {
            const r = el.getBoundingClientRect();
            return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
        });
        const startPageY = e.clientY + window.scrollY;
        let clientY = e.clientY;
        let target = from;
        let raf = 0;

        li.classList.add('dragging');

        const update = () => {
            const pageY = clientY + window.scrollY;
            li.style.transform = `translateY(${pageY - startPageY}px)`;
            const hit = rects.findIndex(r => pageY < r.bottom);
            target = hit === -1 ? items.length - 1 : hit;
            items.forEach((el, k) => {
                el.classList.toggle('drop-before', k === target && target < from);
                el.classList.toggle('drop-after', k === target && target > from);
            });
        };
        // გვერდის თავისით გადახვევა, როცა ხაზს ეკრანის ზედა/ქვედა კიდესთან მიიტან
        const tick = () => {
            const edge = 70, speed = 16;
            if (clientY < edge) window.scrollBy(0, -speed * Math.min(1, 1 - clientY / edge));
            else if (clientY > window.innerHeight - edge) window.scrollBy(0, speed * Math.min(1, 1 - (window.innerHeight - clientY) / edge));
            update();
            raf = requestAnimationFrame(tick);
        };
        const onMove = ev => {
            if (ev.pointerId !== e.pointerId) return;
            clientY = ev.clientY;
            update();
        };
        const end = ev => {
            if (ev.pointerId !== e.pointerId) return;
            if (ev.type === 'pointerup') { clientY = ev.clientY; update(); }   // საბოლოო ადგილი = სადაც გაუშვი
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            li.classList.remove('dragging');
            li.style.transform = '';
            items.forEach(el => el.classList.remove('drop-before', 'drop-after'));
            dragging = false;
            if (ev.type === 'pointerup') move(from, target, false);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
        tick();
    }

    function paint(focus) {
        list.textContent = '';
        st.items.forEach((text, idx) => {
            let cls = 'ord';
            if (review) cls += text === q.correct[idx] ? ' ok' : ' bad';
            const li = h('li', { class: cls + (review ? '' : ' can-drag') });
            li.append(
                h('span', { class: 'grip', 'aria-hidden': 'true' }, review ? String(idx + 1) : '⋮⋮'),
                h('code', {}, q.lang === 'text' ? text : highlight(text))
            );
            if (!review) {
                li.append(
                    h('button', { type: 'button', class: 'mini up', 'aria-label': 'ზევით აწევა', disabled: idx === 0, onclick: () => move(idx, idx - 1) }, '↑'),
                    h('button', { type: 'button', class: 'mini down', 'aria-label': 'ქვევით ჩამოწევა', disabled: idx === st.items.length - 1, onclick: () => move(idx, idx + 1) }, '↓')
                );
                li.addEventListener('pointerdown', e => {
                    if (e.target.closest('.mini')) return;                     // ისრების ღილაკები თავისით მუშაობს
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    // თითით მხოლოდ სახელურიდან (⋮⋮), რომ გვერდის გადახვევა არ დაიბლოკოს
                    if (e.pointerType !== 'mouse' && !e.target.closest('.grip')) return;
                    e.preventDefault();
                    startDrag(e, idx, li);
                });
            }
            list.append(li);
        });
        if (focus) {
            const li = list.children[focus.idx];
            const first = li.querySelector('.' + focus.dir);
            (first && !first.disabled ? first : li.querySelector('.mini:not(:disabled)')).focus();
        }
    }

    paint();
    if (review) {
        root.append(h('div', { class: 'correct-order' },
            h('p', {}, 'სწორი რიგი:'),
            h('pre', { class: 'code' }, q.lang === 'text' ? q.lines.join('\n') : highlight(q.lines.join('\n')))
        ));
    }
    return root;
}

function widgetBug(q, st, qi, review) {
    const root = h('div');
    const box = h('div', { class: 'code' });
    q.code.forEach((line, k) => {
        const n = k + 1;
        const b = h('button', { type: 'button', class: 'ln', 'aria-pressed': String(st.sel.has(n)), disabled: review },
            h('span', { class: 'no' }, String(n)),
            h('code', {}, line ? highlight(line) : ' ')
        );
        if (review) {
            const isBug = q.bugs.includes(n), picked = st.sel.has(n);
            if (isBug && picked) b.classList.add('ok');
            else if (picked) b.classList.add('bad');
            else if (isBug) b.classList.add('miss');
        } else {
            b.addEventListener('click', () => {
                if (st.sel.has(n)) st.sel.delete(n); else st.sel.add(n);
                b.setAttribute('aria-pressed', String(st.sel.has(n)));
                updateProgress();
            });
        }
        box.append(b);
    });
    root.append(box);
    if (review) {
        root.append(h('ul', { class: 'fixes' }, q.bugs.map(n =>
            h('li', {}, `სწორი ვერსია, ხაზი ${n}: `, h('code', {}, highlight(q.fix[n].trim())))
        )));
    }
    return root;
}

function widgetFill(q, st, qi, review) {
    const input = h('input', { type: 'text', class: 'fillin', autocomplete: 'off', spellcheck: 'false', maxlength: '40', 'aria-label': 'შენი პასუხი', disabled: review });
    input.value = st.val;
    if (review) input.classList.add(isCorrect(q, st) ? 'ok' : 'bad');
    input.addEventListener('input', () => { st.val = input.value; updateProgress(); });
    const root = h('div');
    root.append(h('div', { class: 'code fill' }, h('code', {}, highlight(q.template, { slot: input }))));
    if (review && !isCorrect(q, st)) {
        root.append(h('p', { class: 'ans' }, 'სწორი პასუხი: ', h('code', {}, q.accept[0])));
    }
    return root;
}

function widgetMatch(q, st, qi, review) {
    const box = h('div', { class: 'match' });
    q.pairs.forEach(([left, right], k) => {
        const sel = h('select', { 'aria-label': left + ' - შესაბამისობა', disabled: review });
        sel.append(h('option', { value: '' }, '- აირჩიე -'));
        st.opts.forEach(o => {
            const op = h('option', { value: o }, o);
            if (st.sel[k] === o) op.selected = true;
            sel.append(op);
        });
        sel.addEventListener('change', () => { st.sel[k] = sel.value; updateProgress(); });
        const ok = st.sel[k] === right;
        box.append(h('div', { class: 'mrow' + (review ? (ok ? ' ok' : ' bad') : '') },
            h('code', {}, codeNode(left)),
            sel,
            review && !ok ? h('span', { class: 'ans' }, 'სწორია: ' + right) : null
        ));
    });
    return box;
}

const WIDGETS = { choice: widgetChoice, order: widgetOrder, bug: widgetBug, fill: widgetFill, match: widgetMatch };

function hintFor(q) {
    switch (q.type) {
        case 'choice': return 'აირჩიე ერთი სწორი პასუხი.';
        case 'order': return 'გადაათრიე ხაზები ან გამოიყენე ისრები ↑ ↓. ჩაღრმავებას (ხაზის წინ დაშორებას) ყურადღება არ მიაქციო.';
        case 'bug': return q.bugs.length === 1
            ? 'დააწკაპუნე შეცდომიან ხაზზე (ხელახალი დაწკაპუნებით მონიშვნა მოიხსნება).'
            : `ამ კოდში ${q.bugs.length} შეცდომიანი ხაზია - დააწკაპუნე ორივეზე.`;
        case 'fill': return 'ჩაწერე ზუსტად ისე, როგორც კოდში იწერება.';
        case 'match': return 'ყოველ მარცხენა ელემენტს აირჩიე შესაბამისი განმარტება.';
    }
}

function renderQuestion(q, i, review) {
    const st = S[i];
    const ok = review && isCorrect(q, st);
    const card = h('article', { class: 'card q' + (review ? (ok ? ' ok' : ' bad') : ''), id: 'q' + (i + 1) });
    card.append(h('h3', { class: 'qh' },
        h('span', { class: 'num' }, String(i + 1)),
        q.topic ? h('span', { class: 'badge topic' }, q.topic) : null,
        h('span', { class: 'badge' }, TYPE_LABEL[q.type]),
        review ? h('span', { class: 'status' }, ok ? '✔ სწორია' : '✘ არასწორია') : null
    ));
    card.append(h('p', { class: 'qt' }, rich(q.text)));
    if (q.snippet) card.append(h('pre', { class: 'code snippet' }, highlight(Array.isArray(q.snippet) ? q.snippet.join('\n') : q.snippet, { lang: q.snippetLang })));
    if (q.image) card.append(figure(q.image));
    if (!review) card.append(h('p', { class: 'hint' }, hintFor(q)));
    card.append(WIDGETS[q.type](q, st, i, review));
    if (review) {
        card.append(h('div', { class: 'explain' }, h('strong', {}, 'განმარტება'), h('p', {}, rich(q.explain))));
        if (q.explainImage) card.append(figure(q.explainImage, 'after'));
    }
    return card;
}

function renderAll(review) {
    const quiz = document.getElementById('quiz');
    quiz.textContent = '';
    QUESTIONS.forEach((q, i) => quiz.append(renderQuestion(q, i, review)));
}

/* =====================================================
   შეფასება, შედეგი, თავიდან ცდა
   ===================================================== */
let lastReport = '';
let phase = 'intake';   // intake (ფორმა) -> taking (ტესტი) -> done (შეფასებული)

/* ---------- სერვერთან მუშაობა ---------- */
const API = String((window.APP_CONFIG && window.APP_CONFIG.API) || '').replace(/\/+$/, '');
const API_READY = /^https?:\/\//.test(API) && !/YOUR-SUBDOMAIN/i.test(API);
const MSG_NO_API = 'სერვერის მისამართი არ არის მითითებული (config.js). მიმართე ლექტორს.';
const MSG_OFFLINE = 'სერვერთან კავშირი ვერ დამყარდა. შეამოწმე ინტერნეტი და სცადე ხელახლა.';

async function api(method, path, body) {
    if (!API_READY) throw new Error('API_NOT_SET');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
        const res = await fetch(API + path, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            signal: ctrl.signal
        });
        return { status: res.status, data: await res.json().catch(() => ({})) };
    } finally {
        clearTimeout(timer);
    }
}

// ჯგუფის ჩაწერის წესი სერვერზეც იგივეა (api/src/normalize.js): "se-621-6" და "SE-621-6" ერთი ჯგუფია
function normGroup(raw) {
    let s = String(raw || '').normalize('NFKC').trim();
    s = s.replace(/\s*([-_.])\s*/g, '$1').replace(/\s+/g, '-').replace(/[-_.]{2,}/g, m => m[0]);
    const label = s.replace(/[a-z]/g, c => c.toUpperCase());
    return label.length >= 2 && label.length <= 24 && /^[\p{L}\p{N}]+(?:[-_.][\p{L}\p{N}]+)*$/u.test(label) ? label : null;
}

/* ---------- დაწყების ფორმა ---------- */
function showStartMsg(text) {
    const box = $('startMsg');
    box.textContent = text || '';
    box.hidden = !text;
}

function invalid(id, text) {
    ['studentName', 'lecturer', 'group'].forEach(f => $(f).removeAttribute('aria-invalid'));
    if (id) {
        $(id).setAttribute('aria-invalid', 'true');
        $(id).focus();
    }
    showStartMsg(text);
}

async function loadMeta() {
    const sel = $('lecturer');
    $('metaRetry').hidden = true;
    $('startBtn').disabled = true;
    try {
        const { status, data } = await api('GET', '/api/meta');
        if (status !== 200 || !Array.isArray(data.lecturers)) throw new Error('HTTP ' + status);
        sel.textContent = '';
        sel.append(h('option', { value: '' }, '- აირჩიე ლექტორი -'), ...data.lecturers.map(l => h('option', { value: String(l.id) }, l.name)));
        sel.disabled = false;
        const list = $('groupList');
        list.textContent = '';
        data.groups.forEach(g => list.append(h('option', { value: g })));
        $('startBtn').disabled = false;
        showStartMsg('');
    } catch (err) {
        sel.textContent = '';
        sel.append(h('option', { value: '' }, 'ვერ ჩაიტვირთა'));
        showStartMsg(err.message === 'API_NOT_SET' ? MSG_NO_API : MSG_OFFLINE);
        $('metaRetry').hidden = false;
    }
}

async function start(e) {
    e.preventDefault();
    const name = $('studentName').value.replace(/\s+/g, ' ').trim();
    const lecturerId = Number($('lecturer').value);
    const group = normGroup($('group').value);
    if (name.length < 5 || !name.includes(' ')) return invalid('studentName', 'ჩაწერე სახელი და გვარი (ორივე).');
    if (!lecturerId) return invalid('lecturer', 'აირჩიე ლექტორი სიიდან.');
    if (!group) return invalid('group', 'ჯგუფის ნომერი არასწორია. გამოიყენე ასოები, ციფრები და - ან _ (მაგ: SE-621-6).');
    invalid(null, '');

    const btn = $('startBtn');
    btn.disabled = true;
    btn.textContent = 'მოწმდება…';
    try {
        const { status, data } = await api('POST', '/api/check', { quiz: QUIZ_ID, name, group });
        if (status === 200 && !data.taken) {
            begin({ name, group: data.group || group, lecturerId, lecturer: $('lecturer').selectedOptions[0].textContent });
        } else if (status === 200) {
            invalid(null, 'ამ სახელითა და ჯგუფით ტესტი უკვე გავლილია. ტესტის გავლა მხოლოდ ერთხელ შეიძლება. თუ სახელი ან ჯგუფი შეცდომით ჩაწერე, მიმართე ლექტორს - მას შეუძლია შენი ცდის გასუფთავება.');
        } else if (data.field === 'name') {
            invalid('studentName', 'ჩაწერე სახელი და გვარი (ორივე).');
        } else if (data.field === 'group') {
            invalid('group', 'ჯგუფის ნომერი არასწორია. მაგ: SE-621-6.');
        } else {
            throw new Error('HTTP ' + status);
        }
    } catch (err) {
        invalid(null, err.message === 'API_NOT_SET' ? MSG_NO_API : MSG_OFFLINE);
    } finally {
        btn.disabled = false;
        btn.textContent = 'ტესტის დაწყება';
    }
}

function begin(who) {
    me = who;
    phase = 'taking';
    $('startCard').hidden = true;
    const bar = $('whoBar');
    bar.textContent = '';
    [['სტუდენტი', who.name], ['ჯგუფი', who.group], ['ლექტორი', who.lecturer]].forEach(([k, v]) => bar.append(h('span', {}, k, h('b', {}, v))));
    bar.hidden = false;
    $('progress').hidden = false;
    $('submitBox').hidden = false;
    renderAll(false);
    updateProgress();
    startedAt = Date.now();
    bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- შედეგის გაგზავნა ---------- */
async function sendAndShow(payload) {
    const status = $('sendStatus');
    const btn = $('resendBtn');
    pendingPayload = payload;
    btn.hidden = true;
    status.className = 'send';
    status.textContent = 'შედეგი ლექტორთან იგზავნება…';
    try {
        const { status: code, data } = await api('POST', '/api/submit', payload);
        if (code === 201) {
            pendingPayload = null;
            status.className = 'send ok';
            status.textContent = '✔ შედეგი ლექტორთან გაიგზავნა.';
        } else if (code === 409) {
            pendingPayload = null;
            status.className = 'send bad';
            status.textContent = '✘ ამ სახელითა და ჯგუფით შედეგი უკვე გაგზავნილია, ამიტომ ეს ცდა არ ჩაითვალა.';
        } else if (code >= 400 && code < 500) {
            pendingPayload = null;
            status.className = 'send bad';
            status.textContent = `✘ შედეგი არ მიიღეს (${data.error || code}). გადაუგზავნე ლექტორს „შედეგის კოპირებით“.`;
        } else {
            throw new Error('HTTP ' + code);
        }
    } catch (err) {
        status.className = 'send bad';
        status.textContent = '✘ შედეგი ვერ გაიგზავნა (შეამოწმე ინტერნეტი). დააჭირე „ხელახლა გაგზავნას“ ან გადაუგზავნე ლექტორს „შედეგის კოპირებით“.';
        btn.hidden = false;
    }
}

async function submit() {
    if (phase !== 'taking' || !me) return;
    const unanswered = QUESTIONS.filter((q, i) => !isAnswered(q, S[i])).length;
    // ტესტის გავლა მხოლოდ ერთხელ შეიძლება, ამიტომ შეფასებამდე ყოველთვის ვეკითხებით
    const go = await ask({
        title: unanswered ? 'ყველა კითხვას ვერ უპასუხე' : 'დარწმუნებული ხარ?',
        text: (unanswered ? `უპასუხო კითხვებია: ${unanswered}.\n` : '') + 'შეფასების შემდეგ ტესტის თავიდან გავლა შეუძლებელია.',
        ok: 'შეფასება',
        cancel: 'უკან დაბრუნება'
    });
    if (!go || phase !== 'taking') return;

    phase = 'done';
    submitted = true;
    let score = 0;
    const byType = {};
    const byTopic = {};     // თემების მიხედვით დაჯგუფება, თუ ტესტს თემები აქვს (q.topic)
    const detail = QUESTIONS.map((q, i) => {
        const ok = isCorrect(q, S[i]);
        if (ok) score++;
        byType[q.type] = byType[q.type] || { ok: 0, total: 0 };
        byType[q.type].total++;
        if (ok) byType[q.type].ok++;
        if (q.topic) {
            byTopic[q.topic] = byTopic[q.topic] || { ok: 0, total: 0 };
            byTopic[q.topic].total++;
            if (ok) byTopic[q.topic].ok++;
        }
        return ok ? '1' : '0';
    }).join('');

    const total = QUESTIONS.length;
    const pct = Math.round(score / total * 100);
    const timeSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 1;
    const now = new Date();
    const date = [now.getDate(), now.getMonth() + 1].map(n => String(n).padStart(2, '0')).concat(now.getFullYear()).join('.');
    let msg;
    if (pct >= 90) msg = 'შესანიშნავი შედეგია! მასალა კარგად გაქვს ათვისებული.';
    else if (pct >= 75) msg = 'კარგი შედეგია! გადახედე არასწორ კითხვებს და გაიმეორე მასალა.';
    else if (pct >= 50) msg = 'საშუალო შედეგია. გადახედე ლექციის მასალას და არასწორ კითხვებს.';
    else msg = 'კარგად გადახედე ლექციის მასალას და არასწორი კითხვების განმარტებებს - აუცილებლად გამოგივა!';

    document.getElementById('resWho').textContent = `${me.name} · ${me.group} · ${date} · დრო: ${fmtTime(timeSec)}`;
    document.getElementById('resScore').textContent = `${score} / ${total}`;
    document.getElementById('resPercent').textContent = `${pct}%`;
    document.getElementById('resMsg').textContent = msg;
    const typesEl = document.getElementById('resTypes');
    typesEl.textContent = '';
    const typeLines = [];
    Object.keys(TYPE_LABEL).forEach(t => {
        if (!byType[t]) return;
        typesEl.append(h('li', {}, `${TYPE_LABEL[t]}: ${byType[t].ok} / ${byType[t].total}`));
        typeLines.push(`${TYPE_LABEL[t]}: ${byType[t].ok}/${byType[t].total}`);
    });
    const topicsEl = $('resTopics');
    topicsEl.textContent = '';
    const topicLines = Object.entries(byTopic).map(([t, v]) => {
        topicsEl.append(h('li', {}, `${t}: ${v.ok} / ${v.total}`));
        return `${t}: ${v.ok}/${v.total}`;
    });
    $('resTopicsBox').hidden = !topicLines.length;
    lastReport = `საშინაო დავალება: ${QUIZ.title}\n${me.name} · ${me.group} · ლექტორი: ${me.lecturer}\nქულა: ${score}/${total} (${pct}%)\n${topicLines.length ? 'თემები: ' + topicLines.join(' · ') + '\n' : ''}${typeLines.join(' · ')}\nდრო: ${fmtTime(timeSec)}\n${date}`;

    document.getElementById('result').hidden = false;
    document.getElementById('submitBox').hidden = true;
    document.querySelector('.progress').hidden = true;
    renderAll(true);
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    sendAndShow({ quiz: QUIZ_ID, name: me.name, group: me.group, lecturerId: me.lecturerId, point: score, time: timeSec, detail });
}

async function copyReport() {
    const btn = document.getElementById('copyBtn');
    let done = false;
    try {
        await navigator.clipboard.writeText(lastReport);
        done = true;
    } catch (err) {
        const ta = h('textarea', { 'aria-hidden': 'true' });
        ta.value = lastReport;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.append(ta);
        ta.select();
        try { done = document.execCommand('copy'); } catch (e2) { done = false; }
        ta.remove();
    }
    btn.textContent = done ? 'დაკოპირდა ✔' : 'ვერ დაკოპირდა - გადაიღე სურათი';
    setTimeout(() => { btn.textContent = 'შედეგის კოპირება'; }, 2500);
}

// გვერდის სათაური, ილუსტრაცია და პროგრესი არჩეული ტესტის მიხედვით
document.title = `${QUIZ.title} - საშინაო დავალება`;
$('pageTitle').textContent = `საშინაო დავალება: ${QUIZ.title}`;
if (QUIZ.hero) $('heroImg').src = QUIZ.hero;
$('introNote').replaceChildren(...rich(QUIZ.note || ''));
$('progressText').textContent = `პასუხი გაცემულია: 0 / ${QUESTIONS.length}`;
document.querySelector('.track').setAttribute('aria-valuemax', QUESTIONS.length);

$('startForm').addEventListener('submit', start);
$('metaRetry').addEventListener('click', loadMeta);
$('group').addEventListener('input', () => {
    const help = $('groupHelp');
    const label = normGroup($('group').value);
    help.textContent = '';
    if (label) help.append('ჩაიწერება ასე: ', h('b', {}, label));
    else help.textContent = 'დიდი და პატარა ასოები არ აქვს მნიშვნელობა.';
});
$('submitBtn').addEventListener('click', submit);
$('copyBtn').addEventListener('click', copyReport);
$('resendBtn').addEventListener('click', () => { if (pendingPayload) sendAndShow(pendingPayload); });
$('onlyWrong').addEventListener('change', e => {
    document.body.classList.toggle('only-wrong', e.target.checked);
});
// გვერდის დახურვისას ვაფრთხილებთ, თუ პასუხები ჯერ არ არის შეფასებული ან შედეგი ჯერ არ გაგზავნილა
window.addEventListener('beforeunload', e => {
    const unsaved = pendingPayload || (phase === 'taking' && QUESTIONS.some((q, i) => isAnswered(q, S[i])));
    if (unsaved) {
        e.preventDefault();
        e.returnValue = '';
    }
});

loadMeta();
