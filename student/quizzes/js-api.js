/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-api',
    title: 'JavaScript · API (fetch)',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'კოდი გამოსცადე ბრაუზერის კონსოლში (`F12` → Console). სატესტო API-ებისთვის გამოდგება `jsonplaceholder.typicode.com`.'
};

const QUESTIONS = [
    // 1
    {
        type: 'choice',
        text: 'რას აბრუნებს `fetch("/api/users")` დაუყოვნებლივ?',
        options: ['სერვერის პასუხის ტექსტს', 'ობიექტს მონაცემებით', 'Promise-ს', 'undefined-ს'],
        answer: 2,
        explain: '`fetch` მოთხოვნის შედეგს მაშინვე ვერ აბრუნებს, რადგან სერვერის პასუხს დრო სჭირდება. ის აბრუნებს Promise-ს - დაპირებას, რომ პასუხი მოგვიანებით მოვა. მას ვიღებთ `then`-ით ან `await`-ით.'
    },
    // 2
    {
        type: 'choice',
        text: 'რას აკეთებს `res.json()`?',
        snippet: [
            'const res = await fetch("/api/users");',
            'const data = await res.json();'
        ],
        options: [
            'პასუხის JSON ტექსტს JavaScript-ის ობიექტად ან მასივად გარდაქმნის (Promise-ის სახით)',
            'ობიექტს JSON ტექსტად გარდაქმნის',
            'მონაცემებს სერვერზე გააგზავნის',
            'პასუხს მეხსიერებიდან წაშლის'
        ],
        answer: 0,
        explain: '`res.json()` პასუხის სხეულს კითხულობს და JSON-იდან ობიექტად აქცევს. ისიც Promise-ს აბრუნებს, ამიტომ `await` გვჭირდება. საპირისპირო მოქმედებას (ობიექტი → ტექსტი) `JSON.stringify` ასრულებს.'
    },
    // 3
    {
        type: 'choice',
        text: 'სერვერმა `fetch`-ს პასუხად 404 დაუბრუნა. რა მოხდება?',
        options: [
            'Promise გაწყდება და `catch` გაეშვება',
            'შეცდომა არ დაფიქსირდება: პასუხი მოვა და `res.ok` იქნება `false`',
            'დაბრუნდება `null`',
            'მოთხოვნა ავტომატურად გამეორდება'
        ],
        answer: 1,
        explain: '`fetch` Promise-ს მხოლოდ ქსელის პრობლემისას (კავშირი არ არის) აგდებს. HTTP შეცდომები (404, 500) „პასუხია“ და ჩვენ თვითონ უნდა შევამოწმოთ: `if (!res.ok) throw new Error(...)`.'
    },
    // 4
    {
        type: 'choice',
        text: 'რა თანმიმდევრობით დაიბეჭდება რიცხვები?',
        snippet: [
            'console.log(1);',
            'Promise.resolve().then(() => console.log(2));',
            'console.log(3);'
        ],
        options: ['1, 2, 3', '1, 3, 2', '2, 1, 3', '3, 2, 1'],
        answer: 1,
        explain: '`then`-ის ფუნქცია ყოველთვის ასინქრონულად, მიმდინარე სინქრონული კოდის დასრულების შემდეგ სრულდება. ჯერ 1 და 3 იბეჭდება, მერე - 2.'
    },
    // 5
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'async function f() {',
            '  return 5;',
            '}',
            'console.log(f());'
        ],
        options: ['5', 'Promise ობიექტს', 'undefined', 'შეცდომას'],
        answer: 1,
        explain: '`async` ფუნქცია ყოველთვის Promise-ს აბრუნებს, თუნდაც `return 5` ეწეროს. თვით რიცხვი რომ მივიღოთ, გამოძახებას `await` უნდა დავუწეროთ (`await f()`) ან `.then()` გამოვიყენოთ.'
    },
    // 6
    {
        type: 'choice',
        text: 'რას დააბრუნებს ეს გამოსახულება?',
        snippet: 'JSON.stringify({ a: 1, b: "x" })',
        options: ['{"a":1,"b":"x"}', '{a: 1, b: x}', '[object Object]', '{ a: 1, b: "x" }'],
        answer: 0,
        explain: '`JSON.stringify` ობიექტს სტრიქონად აქცევს JSON ფორმატით: გასაღებებიც ორმაგ ბრჭყალებშია. სერვერზე მონაცემებს სწორედ ასეთი ტექსტის სახით ვაგზავნით.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ფუნქციამ სერვერიდან მომხმარებლები უნდა ჩამოტვირთოს და მათი რაოდენობა დაბეჭდოს.',
        lines: [
            'async function loadUsers() {',
            '  const res = await fetch("https://jsonplaceholder.typicode.com/users");',
            '  const users = await res.json();',
            '  console.log(users.length);',
            '}',
            'loadUsers();'
        ],
        explain: 'ფუნქცია `async` უნდა იყოს, რომ შიგნით `await` ვიხმაროთ. ჯერ ვითხოვთ მონაცემებს (`fetch`), მერე პასუხს ვაქცევთ ობიექტად (`json`), მერე ვიყენებთ. ბოლოს ფუნქცია უნდა გამოვიძახოთ.'
    },
    // 8
    {
        type: 'order',
        text: 'დაალაგე `then` ჯაჭვი: მოთხოვნა, პასუხის გადაყვანა JSON-ად, მონაცემების ჩვენება და შეცდომის დამუშავება.',
        lines: [
            'fetch("/api/todos")',
            '  .then(res => res.json())',
            '  .then(todos => console.log(todos))',
            '  .catch(err => console.error(err));'
        ],
        explain: 'ყოველი `then` წინა ნაბიჯის შედეგს იღებს. `catch` ბოლოში დგას და ჯაჭვის ნებისმიერ ნაბიჯში გაჩენილ შეცდომას იჭერს.'
    },
    // 9
    {
        type: 'bug',
        text: 'კონსოლში წერია `res.json is not a function`. რომელ ხაზშია შეცდომა?',
        code: [
            'async function load() {',
            '  const res = fetch("/api/users");',
            '  const data = await res.json();',
            '  console.log(data);',
            '}'
        ],
        bugs: [2],
        fix: { 2: '  const res = await fetch("/api/users");' },
        explain: '`await`-ის გარეშე `res` Promise-ია და არა პასუხი, ამიტომ მას `json()` მეთოდი არ აქვს. `fetch`-ს წინ `await` უნდა დაეწეროს.'
    },
    // 10
    {
        type: 'bug',
        text: 'ფუნქციას ორი შეცდომა აქვს: ერთი სინტაქსურია, მეორე ლოგიკური. იპოვე ორივე ხაზი.',
        code: [
            'function load() {',
            '  try {',
            '    const res = await fetch("/api/users");',
            '    if (res.ok) throw new Error("HTTP " + res.status);',
            '    const data = await res.json();',
            '    console.log(data);',
            '  } catch (err) {',
            '    console.error(err);',
            '  }',
            '}'
        ],
        bugs: [1, 4],
        fix: {
            1: 'async function load() {',
            4: '    if (!res.ok) throw new Error("HTTP " + res.status);'
        },
        explain: 'ხაზი 1: `await` მხოლოდ `async` ფუნქციაში შეიძლება (სხვაგვარად SyntaxError). ხაზი 4: შეცდომა უნდა ამოვაგდოთ მაშინ, როცა პასუხი არ არის წარმატებული, ანუ `!res.ok`.'
    },
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც პასუხის JSON ობიექტად გადაიქცევა.',
        template: 'const data = await res.____();',
        accept: ['json'],
        explain: '`res.json()` - JSON-ისთვის, `res.text()` - უბრალო ტექსტისთვის, `res.blob()` - ფაილებისთვის.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე თვისება, რომელიც გვეუბნება, წარმატებული იყო თუ არა პასუხი (სტატუსი 200-299).',
        template: 'if (!res.____) throw new Error("failed");',
        accept: ['ok'],
        explain: '`res.ok` არის `true`, თუ სტატუსი 200-დან 299-მდეა. `res.status` კი ზუსტ კოდს გვაძლევს (მაგ. 404).'
    },
    // 13
    {
        type: 'fill',
        text: 'ჩაწერე სიტყვა, რომელიც `try` ბლოკში გაჩენილ შეცდომას იჭერს.',
        template: 'try { await load(); } ____ (err) { console.error(err); }',
        accept: ['catch'],
        explain: '`try` ბლოკში ვწერთ კოდს, რომელმაც შეიძლება შეცდომა გამოიწვიოს. შეცდომის შემთხვევაში კონტროლი `catch`-ში გადადის და პროგრამა არ ჩერდება. `async/await`-ით ქსელის შეცდომებს ასევე ვიჭერთ.'
    },
    // 14
    {
        type: 'match',
        text: 'შეუსაბამე HTTP სტატუსის კოდი მის მნიშვნელობას.',
        pairs: [
            ['200', 'OK - მოთხოვნა წარმატებულია'],
            ['201', 'Created - ახალი რესურსი შეიქმნა'],
            ['400', 'Bad Request - მოთხოვნა არასწორია'],
            ['404', 'Not Found - რესურსი ვერ მოიძებნა'],
            ['500', 'Server Error - შეცდომა სერვერზე']
        ],
        explain: '2xx - წარმატება, 4xx - შეცდომა მოთხოვნაში (კლიენტის მხრიდან), 5xx - შეცდომა სერვერზე.'
    },
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე ჩანაწერი მის დანიშნულებას.',
        pairs: [
            ['fetch(url)', 'HTTP მოთხოვნის გაგზავნა, აბრუნებს Promise-ს'],
            ['res.json()', 'პასუხის JSON-დან ობიექტად გარდაქმნა'],
            ['JSON.stringify(obj)', 'ობიექტის JSON ტექსტად გადაქცევა'],
            ['JSON.parse(text)', 'JSON ტექსტის ობიექტად გადაქცევა'],
            ['await', 'Promise-ის შედეგის დალოდება async ფუნქციაში']
        ],
        explain: 'API-სთან მუშაობის ძირითადი ინსტრუმენტებია: `fetch` გზავნის მოთხოვნას, `await` ელოდება პასუხს, `json()` და `JSON.parse` JSON-ს ობიექტად აქცევენ, `JSON.stringify` კი - საპირისპიროდ.'
    }
];
