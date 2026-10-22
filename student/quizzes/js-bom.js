/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-bom',
    title: 'JavaScript · BOM',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'კოდი გამოსცადე ბრაუზერის კონსოლში (`F12` → Console). `localStorage`-ის ნახვა შეგიძლია Application ჩანართში.'
};

const QUESTIONS = [
    // 1
    {
        type: 'choice',
        text: 'რა არის `window` ობიექტი BOM-ში?',
        options: [
            'ბრაუზერის ფანჯრის გლობალური ობიექტი, რომელიც `document`-საც, `location`-საც და ტაიმერების ფუნქციებსაც შეიცავს',
            'მხოლოდ გვერდზე არსებული ელემენტების სია',
            'სერვერიდან მიღებული პასუხი',
            'ახალი ჩანართის გასახსნელი ფუნქცია'
        ],
        answer: 0,
        explain: 'BOM (Browser Object Model) ბრაუზერს აღწერს. მისი ცენტრია `window`: `document`, `location`, `history`, `navigator`, `localStorage`, `setTimeout`, `alert` - ყველა ის `window`-ის თვისებაა, ამიტომ ხშირად `window.`-ის გარეშე ვწერთ.'
    },
    // 2
    {
        type: 'choice',
        text: 'რა თანმიმდევრობით დაიბეჭდება ასოები?',
        snippet: [
            'console.log("A");',
            'setTimeout(() => console.log("B"), 0);',
            'console.log("C");'
        ],
        options: ['A, B, C', 'A, C, B', 'B, A, C', 'C, A, B'],
        answer: 1,
        explain: '`setTimeout` ფუნქციას მაშინვე კი არ ასრულებს, არამედ რიგში აყენებს - 0 მილიწამიანი დაყოვნების დროსაც. ჯერ მიმდინარე კოდი სრულდება (A, C), მხოლოდ მერე - რიგში მდგომი ფუნქცია (B).'
    },
    // 3
    {
        type: 'choice',
        text: 'ტაიმერი ასე დავიწყეთ. როგორ შევწყვიტოთ ის?',
        snippet: 'const id = setInterval(tick, 1000);',
        options: [
            '`clearInterval(id)`',
            '`stopInterval(id)`',
            '`id.stop()`',
            '`setInterval(null)`'
        ],
        answer: 0,
        explain: '`setInterval` აბრუნებს ტაიმერის ნომერს, ამიტომ ის ცვლადში უნდა შევინახოთ და `clearInterval(id)`-ს გადავცეთ. `setTimeout`-ის გაუქმება `clearTimeout`-ით ხდება.'
    },
    // 4
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'localStorage.setItem("count", 5);',
            'console.log(typeof localStorage.getItem("count"));'
        ],
        options: ['"number"', '"string"', '"object"', '"undefined"'],
        answer: 1,
        explain: '`localStorage` ყველა მნიშვნელობას სტრიქონად ინახავს. რიცხვი რომ დაგვჭირდეს, წაკითხვის შემდეგ უნდა გადავიყვანოთ: `Number(localStorage.getItem("count"))`.'
    },
    // 5
    {
        type: 'choice',
        text: 'როგორ შევინახოთ `user` ობიექტი `localStorage`-ში ისე, რომ შემდეგ სწორად წავიკითხოთ?',
        options: [
            '`localStorage.setItem("user", user)`',
            '`localStorage.setItem("user", JSON.stringify(user))`',
            '`localStorage.user = user`',
            '`localStorage.setItem(user)`'
        ],
        answer: 1,
        explain: 'ობიექტი სტრიქონად უნდა გადავიყვანოთ `JSON.stringify`-ით, წაკითხვისას კი `JSON.parse`-ით დავაბრუნოთ. სხვა შემთხვევაში შეინახება უაზრო ტექსტი `[object Object]`.'
    },
    // 6
    {
        type: 'choice',
        text: 'რომელი ბრძანება გვერდს თავიდან ტვირთავს?',
        options: [
            '`location.reload()`',
            '`location.refresh()`',
            '`window.reload()`',
            '`history.reload()`'
        ],
        answer: 0,
        explain: '`location` ობიექტი მიმდინარე მისამართს აღწერს: `location.href` მისამართია (მასზე მინიჭებით ახალ გვერდზე გადავდივართ), `location.reload()` კი გვერდს განაახლებს.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ობიექტი უნდა შეინახოს `localStorage`-ში და მერე წაიკითხოს.',
        lines: [
            'const user = { name: "Ana" };',
            'localStorage.setItem("user", JSON.stringify(user));',
            'const saved = JSON.parse(localStorage.getItem("user"));',
            'console.log(saved.name);'
        ],
        explain: 'ჯერ ობიექტი, მერე შენახვა (`stringify`), მერე წაკითხვა (`getItem` + `parse`) და ბოლოს - გამოყენება.'
    },
    // 8
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ტაიმერი ყოველ წამს `seconds`-ს უნდა ზრდიდეს და 3 წამის შემდეგ ჩერდებოდეს.',
        lines: [
            'let seconds = 0;',
            'const id = setInterval(() => {',
            '  seconds++;',
            '  if (seconds === 3) clearInterval(id);',
            '}, 1000);'
        ],
        explain: '`id` ცვლადი ტაიმერის გაშვებისას იქმნება და ფუნქციის შიგნიდან `clearInterval(id)`-ს ეგზავნება. ინტერვალი (1000 მს) `setInterval`-ის ბოლო არგუმენტია - ფუნქციის შემდეგ.'
    },
    // 9
    {
        type: 'bug',
        text: '`sayHi` უნდა დაიბეჭდოს 1 წამის შემდეგ, მაგრამ ის მაშინვე სრულდება. რომელ ხაზშია შეცდომა?',
        code: [
            'function sayHi() {',
            '  console.log("Hi");',
            '}',
            'setTimeout(sayHi(), 1000);'
        ],
        bugs: [4],
        fix: { 4: 'setTimeout(sayHi, 1000);' },
        explain: '`sayHi()` ფრჩხილებით ფუნქციას ახლავე ასრულებს და `setTimeout`-ს მის შედეგს (`undefined`) გადასცემს. ფუნქცია მხოლოდ სახელით უნდა გადავცეთ: `sayHi`.'
    },
    // 10
    {
        type: 'bug',
        text: 'პარამეტრები არ ინახება და არ იკითხება სწორად. იპოვე ორივე პრობლემური ხაზი.',
        code: [
            'const settings = { theme: "dark" };',
            'localStorage.setItem("settings", settings);',
            'const s = localStorage.getItem("settings");',
            'console.log(s.theme);'
        ],
        bugs: [2, 3],
        fix: {
            2: 'localStorage.setItem("settings", JSON.stringify(settings));',
            3: 'const s = JSON.parse(localStorage.getItem("settings"));'
        },
        explain: 'ხაზი 2: ობიექტი `[object Object]` სტრიქონად შეინახებოდა - საჭიროა `JSON.stringify`. ხაზი 3: წაკითხვისას მივიღებთ სტრიქონს, ამიტომ `s.theme` იქნებოდა `undefined`; `JSON.parse` ობიექტს აღადგენს.'
    },
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც მნიშვნელობა `localStorage`-ში ინახება.',
        template: 'localStorage.____("theme", "dark");',
        accept: ['setItem'],
        explain: '`setItem(გასაღები, მნიშვნელობა)` ინახავს, `getItem(გასაღები)` კითხულობს, `removeItem(გასაღები)` შლის, `clear()` კი ყველაფერს ასუფთავებს.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე ფუნქცია, რომელიც OK/Cancel კითხვას აჩვენებს და `true` ან `false`-ს აბრუნებს.',
        template: 'if (____("Delete this item?")) {',
        accept: ['confirm', 'window.confirm'],
        explain: '`confirm` აჩვენებს კითხვას ორი ღილაკით: OK აბრუნებს `true`-ს, Cancel - `false`-ს. `alert` მხოლოდ შეტყობინებას აჩვენებს, `prompt` კი ტექსტის შეყვანას ითხოვს.'
    },
    // 13
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომელიც ბრაუზერში წინა გვერდზე დაგვაბრუნებს.',
        template: 'history.____();',
        accept: ['back'],
        explain: '`history.back()` წინა გვერდზე, `history.forward()` შემდეგზე გადადის, `history.go(-2)` კი ორი ნაბიჯით უკან.'
    },
    // 14
    {
        type: 'match',
        text: 'შეუსაბამე BOM-ის ობიექტი მის დანიშნულებას.',
        pairs: [
            ['window', 'ბრაუზერის ფანჯარა, გლობალური ობიექტი'],
            ['document', 'გვერდის DOM და მისი ელემენტები'],
            ['location', 'მიმდინარე მისამართი (URL) და გადასვლა'],
            ['navigator', 'ინფორმაცია ბრაუზერსა და მოწყობილობაზე'],
            ['history', 'ბრაუზერის ისტორია: უკან და წინ გადასვლა'],
            ['localStorage', 'მონაცემების შენახვა ბრაუზერში მუდმივად']
        ],
        explain: 'ამ ობიექტებს `window` აერთიანებს. `document` DOM-ის შესასვლელია, დანარჩენები კი თვით ბრაუზერის შესაძლებლობებს გვაძლევს.'
    },
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე ფუნქციის გამოძახება იმას, რასაც ის აკეთებს.',
        pairs: [
            ['alert("Hi")', 'შეტყობინების ფანჯარა OK ღილაკით'],
            ['confirm("Sure?")', 'კითხვა OK/Cancel ღილაკებით, აბრუნებს true ან false-ს'],
            ['prompt("Name?")', 'ფანჯარა ტექსტის შესაყვანად'],
            ['setTimeout(fn, 500)', 'ფუნქციას ერთხელ ასრულებს დაყოვნების შემდეგ'],
            ['setInterval(fn, 500)', 'ფუნქციას განუწყვეტლივ იმეორებს ყოველ ინტერვალზე']
        ],
        explain: 'პირველი სამი ფანჯარა აჩერებს კოდის შესრულებას, სანამ მომხმარებელი არ უპასუხებს. ტაიმერები (`setTimeout`, `setInterval`) არ აჩერებენ - ისინი ფუნქციას მოგვიანებით ასრულებენ.'
    }
];
