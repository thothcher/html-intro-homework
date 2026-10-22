/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-functions',
    title: 'JavaScript · ფუნქციები',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'კოდს ჯერ გონებაში გაუშვი, მერე ბრაუზერის კონსოლში (`F12` → Console) გადაამოწმე.'
};

const QUESTIONS = [
    // 1
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'console.log(add(2, 3));',
            '',
            'function add(a, b) {',
            '  return a + b;',
            '}'
        ],
        options: ['5', 'undefined', 'ReferenceError', 'NaN'],
        answer: 0,
        explain: '`function add() {}` სახით აღწერილი ფუნქცია hoisting-ის წყალობით მთელ ფაილში თავიდანვე ხელმისაწვდომია, ამიტომ მისი გამოძახება აღწერამდეც მუშაობს. `const add = () => ...` ფორმით კი ასე არ გამოვიდოდა.'
    },
    // 2
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'function greet(name) {',
            '  console.log("Hi " + name);',
            '}',
            'const r = greet("Ana");',
            'console.log(r);'
        ],
        options: ['Hi Ana', 'Hi Ana და undefined (ორ ხაზზე)', 'undefined', 'Ana'],
        answer: 1,
        explain: 'ფუნქცია `console.log`-ით ბეჭდავს „Hi Ana“-ს, მაგრამ `return` არ აქვს, ამიტომ ავტომატურად აბრუნებს `undefined`-ს. ბეჭდვა და დაბრუნება სხვადასხვა რამეა.'
    },
    // 3
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'function pow(base, exp = 2) {',
            '  return base ** exp;',
            '}',
            'console.log(pow(3));'
        ],
        options: ['3', '6', '9', 'NaN'],
        answer: 2,
        explain: 'როცა მეორე არგუმენტი არ გადაეცემა, ჩაირთვება ნაგულისხმევი მნიშვნელობა `exp = 2`. `**` ახარისხებს, ამიტომ `3 ** 2` არის 9.'
    },
    // 4
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'let x = 1;',
            'function f() {',
            '  let x = 2;',
            '  return x;',
            '}',
            'f();',
            'console.log(x);'
        ],
        options: ['1', '2', 'undefined', 'შეცდომას'],
        answer: 0,
        explain: 'ფუნქციის შიგნით `let x` ახალი, ლოკალური ცვლადია და გარე `x`-ს არ ეხება. ფუნქციის გარეთ `x` ისევ 1-ია.'
    },
    // 5
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'function makeCounter() {',
            '  let c = 0;',
            '  return () => ++c;',
            '}',
            'const next = makeCounter();',
            'next();',
            'console.log(next());'
        ],
        options: ['0', '1', '2', 'undefined'],
        answer: 2,
        explain: 'დაბრუნებული ფუნქცია „იხსენებს“ `c` ცვლადს, თუმცა `makeCounter` უკვე დასრულებულია - ამას closure ჰქვია. პირველმა გამოძახებამ `c` 1-ად აქცია, მეორემ - 2-ად.'
    },
    // 6
    {
        type: 'choice',
        text: 'რა არის callback ფუნქცია?',
        options: [
            'ფუნქცია, რომელიც სხვა ფუნქციას არგუმენტად გადაეცემა და მას მოგვიანებით იძახებს',
            'ფუნქცია, რომელიც არაფერს აბრუნებს',
            'ფუნქცია, რომელიც საკუთარ თავს იძახებს',
            'ფუნქცია, რომელიც ობიექტშია შენახული'
        ],
        answer: 0,
        explain: 'მაგალითად `arr.map(n => n * 2)` ან `setTimeout(fn, 1000)`: ფუნქციას სხვა ფუნქციას გადავცემთ, რათა ის საჭირო მომენტში თვითონ გამოიძახოს. საკუთარ თავს იძახებს რეკურსიული ფუნქცია.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ფუნქცია ორი რიცხვის ჯამს აბრუნებს, შემდეგ კი შედეგი იბეჭდება.',
        lines: [
            'function add(a, b) {',
            '  return a + b;',
            '}',
            'console.log(add(2, 3));'
        ],
        explain: 'ჯერ ფუნქციის აღწერა (`function`, სახელი, პარამეტრები, სხეული `return`-ით), მერე - გამოძახება არგუმენტებით.'
    },
    // 8
    {
        type: 'order',
        text: 'დაალაგე closure-ის კოდი: `makeCounter` ფუნქციამ უნდა დააბრუნოს ფუნქცია, რომელიც ყოველ გამოძახებაზე მრიცხველს ზრდის.',
        lines: [
            'function makeCounter() {',
            '  let count = 0;',
            '  return function () {',
            '    count++;',
            '    return count;',
            '  };',
            '}'
        ],
        explain: 'გარე ფუნქციაში ჯერ `count` ცხადდება, მერე ბრუნდება შიდა ფუნქცია, რომელსაც ამ ცვლადზე წვდომა აქვს. შიდა ფუნქცია `};`-ით იხურება (ის `return`-ის გამოსახულებაა), გარე კი - `}`-ით.'
    },
    // 9
    {
        type: 'bug',
        text: '`double(4)` უნდა აბრუნებდეს 8-ს, მაგრამ ბეჭდავს `undefined`-ს. რომელ ხაზშია შეცდომა?',
        code: [
            'function double(n) {',
            '  n * 2;',
            '}',
            'console.log(double(4));'
        ],
        bugs: [2],
        fix: { 2: '  return n * 2;' },
        explain: 'გამოსახულება `n * 2` გამოითვლება, მაგრამ არსად ბრუნდება. `return`-ის გარეშე ფუნქცია `undefined`-ს აბრუნებს.'
    },
    // 10
    {
        type: 'bug',
        text: 'კოდი მართკუთხედის ფართობს ითვლის, მაგრამ შეცდომას აგდებს. იპოვე ორივე პრობლემური ხაზი.',
        code: [
            'function area(w, h) {',
            '  const result = w * h;',
            '}',
            'const a = area(3, 4);',
            'console.log(result);'
        ],
        bugs: [2, 5],
        fix: {
            2: '  return w * h;',
            5: 'console.log(a);'
        },
        explain: 'ხაზი 2: ფუნქცია შედეგს არ აბრუნებს (`return` აკლია), ამიტომ `a` იქნება `undefined`. ხაზი 5: `result` ფუნქციის შიგნით გამოცხადებული ლოკალური ცვლადია და გარეთ არ არსებობს (`ReferenceError`). გარეთ უნდა დაიბეჭდოს `a`.'
    },
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე ისრისებრი ფუნქციის ნიშანი.',
        template: 'const add = (a, b) ____ a + b;',
        accept: ['=>'],
        explain: 'ისრისებრი ფუნქცია ასე იწერება: `(პარამეტრები) => გამოსახულება`. თუ სხეულში ერთი გამოსახულებაა, `return` და ფიგურული ფრჩხილები აღარ გვჭირდება.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე სიმბოლო, რომლითაც პარამეტრს ნაგულისხმევი მნიშვნელობა ენიჭება.',
        template: 'function hi(name ____ "guest") {',
        accept: ['='],
        explain: '`name = "guest"` ნიშნავს: თუ არგუმენტი არ გადმოეცა (ან `undefined`-ია), `name` იქნება `"guest"`.'
    },
    // 13
    {
        type: 'fill',
        text: 'რა სიტყვა უნდა ჩაწერო, რომ ფუნქციამ ნამრავლი გარეთ დააბრუნოს?',
        template: 'function mul(a, b) { ____ a * b; }',
        accept: ['return'],
        explain: '`return` ფუნქციას წყვეტს და მნიშვნელობას გამომძახებელს უბრუნებს. მის შემდეგ დაწერილი კოდი აღარ სრულდება.'
    },
    // 14
    {
        type: 'match',
        text: 'შეუსაბამე ჩანაწერი მის მნიშვნელობას.',
        pairs: [
            ['function f(a) {}', 'ფუნქციის აღწერა; a პარამეტრია'],
            ['f(5)', 'ფუნქციის გამოძახება; 5 არგუმენტია'],
            ['return', 'ფუნქციიდან მნიშვნელობის დაბრუნება'],
            ['=>', 'ისრისებრი ფუნქციის ნიშანი'],
            ['...args', 'rest პარამეტრი: დარჩენილი არგუმენტები მასივად']
        ],
        explain: 'პარამეტრი არის სახელი ფუნქციის აღწერაში, არგუმენტი - რეალური მნიშვნელობა გამოძახებისას. `...args` ყველა დარჩენილ არგუმენტს ერთ მასივში აგროვებს.'
    },
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე ფუნქციის ჩაწერის ფორმა მის სახელს.',
        pairs: [
            ['function add(a, b) {}', 'function declaration (hoisting-ის გამო აღწერამდეც მუშაობს)'],
            ['const add = function () {}', 'function expression (ცვლადში შენახული ფუნქცია)'],
            ['const add = (a, b) => a + b', 'ისრისებრი ფუნქცია (arrow function)'],
            ['(function () {})()', 'დაუყოვნებლივ გამოძახებადი ფუნქცია (IIFE)'],
            ['setTimeout(fn, 1000)', 'callback-ის გამოძახება 1 წამის შემდეგ']
        ],
        explain: 'ფუნქციის დაწერა რამდენიმე გზით შეიძლება. declaration მთელ ფაილში წინასწარ ჩანს, expression და arrow კი მხოლოდ იმ ხაზის შემდეგ, სადაც ცვლადს მიენიჭა.'
    }
];
