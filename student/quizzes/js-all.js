/* ერთი ტესტი JavaScript-ის ყველა თემაზე: პირობები, ციკლები, ფუნქციები, კლასები, DOM, BOM, API, CRUD.
   ყოველი კითხვის topic მის თემას აჩვენებს (ბარათზე და შედეგების გვერდზე).
   id უნდა ემთხვეოდეს api/src/config.js-ში QUIZZES-ის გასაღებს, კითხვების რაოდენობა კი - max-ს.
   JavaScript-ის ტესტებში: lang 'js'; ჩასაწერ ადგილს ბლანკში აღნიშნავს ____ ; კოდის ნიმუში კითხვის ქვეშ - snippet. */
const QUIZ = {
    id: 'js-all',
    title: 'JavaScript · ყველა თემა',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'კოდს ჯერ გონებაში გაუშვი, მერე ბრაუზერის კონსოლში (`F12` → Console) გადაამოწმე.'
};

const QUESTIONS = [
    // 1
    {
        topic: 'პირობები',
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: 'console.log(5 == "5", 5 === "5");',
        options: ['true true', 'true false', 'false true', 'false false'],
        answer: 1,
        explain: '`==` ტიპებს ადარებამდე აქცევს ერთნაირად (სტრიქონი "5" რიცხვი 5 ხდება), ამიტომ `true`. `===` ტიპსაც ადარებს: რიცხვი და სტრიქონი სხვადასხვა ტიპია, ამიტომ `false`. ყოველთვის `===` გამოიყენე.'
    },
    // 2
    {
        topic: 'პირობები',
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'let day = 2;',
            'switch (day) {',
            '  case 1: console.log("Mon");',
            '  case 2: console.log("Tue");',
            '  case 3: console.log("Wed"); break;',
            '  default: console.log("?");',
            '}'
        ],
        options: ['Tue', 'Tue და Wed (ორ ხაზზე)', 'Mon, Tue და Wed', '?'],
        answer: 1,
        explain: '`case 2` ემთხვევა, მაგრამ მის ბოლოს `break` არ წერია, ამიტომ შესრულება „ეშვება“ შემდეგ `case 3`-ზეც და მხოლოდ იქ ჩერდება. ამას fall-through ჰქვია.'
    },
    // 3
    {
        topic: 'პირობები',
        type: 'bug',
        text: 'ამ კოდს ორი სინტაქსური შეცდომა აქვს. იპოვე ორივე ხაზი.',
        code: [
            'let grade = 85;',
            'if (grade >= 90 and grade <= 100) {',
            '  console.log("excellent");',
            '} else if grade >= 50 {',
            '  console.log("pass");',
            '} else {',
            '  console.log("fail");',
            '}'
        ],
        bugs: [2, 4],
        fix: {
            2: 'if (grade >= 90 && grade <= 100) {',
            4: '} else if (grade >= 50) {'
        },
        explain: 'ხაზი 2: JavaScript-ში „და“ იწერება `&&`-ით და არა სიტყვით `and`. ხაზი 4: პირობა `else if`-შიც ფრჩხილებში უნდა ჩაიწეროს: `else if (პირობა)`.'
    },
    // 4
    {
        topic: 'პირობები',
        type: 'match',
        text: 'შეუსაბამე ოპერატორი მის მნიშვნელობას.',
        pairs: [
            ['===', 'მკაცრი ტოლობა (მნიშვნელობაც და ტიპიც)'],
            ['!==', 'მკაცრი უტოლობა'],
            ['&&', '„და“: ორივე პირობა ჭეშმარიტია'],
            ['||', '„ან“: ერთი მაინც ჭეშმარიტია'],
            ['!', 'უარყოფა: true ხდება false და პირიქით'],
            ['??', 'მარჯვენა მხარე მხოლოდ მაშინ, თუ მარცხენა null ან undefined-ია']
        ],
        explain: '`&&` და `||` ლოგიკური „და“ და „ან“-ია, `!` - უარყოფა. `??` (nullish coalescing) `||`-სგან იმით განსხვავდება, რომ `0` და `""` მნიშვნელობებს მცდარად არ თვლის: `0 ?? 5` არის `0`, `0 || 5` კი - `5`.'
    },
    // 5
    {
        topic: 'ციკლები',
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'for (let i = 1; i <= 5; i++) {',
            '  if (i === 3) continue;',
            '  console.log(i);',
            '}'
        ],
        options: ['1, 2', '1, 2, 4, 5', '1, 2, 3, 4, 5', '3'],
        answer: 1,
        explain: '`continue` მხოლოდ მიმდინარე ბრუნვას ტოვებს და ციკლი შემდეგზე გადადის, ამიტომ 3 არ იბეჭდება, დანარჩენი კი - დიახ. `break` ციკლს მთლიანად შეწყვეტდა და დაიბეჭდებოდა მხოლოდ 1, 2.'
    },
    // 6
    {
        topic: 'ციკლები',
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: უნდა დაითვალოს და დაიბეჭდოს რიცხვების 1-დან 5-მდე ჯამი.',
        lines: [
            'let sum = 0;',
            'for (let i = 1; i <= 5; i++) {',
            '  sum += i;',
            '}',
            'console.log(sum);'
        ],
        explain: 'ჯერ ჯამის ცვლადი 0-ით, მერე ციკლი, რომელიც ყოველ ბრუნვაზე `i`-ს ამატებს, და ბოლოს - დაბეჭდვა ციკლის გარეთ, რომ მხოლოდ საბოლოო ჯამი გამოჩნდეს (15).'
    },
    // 7
    {
        topic: 'ციკლები',
        type: 'fill',
        text: 'ჩაწერე სიტყვა, რომლითაც `for` გადაუვლის მასივის თითოეულ ელემენტს.',
        template: 'for (const item ____ items) {',
        accept: ['of'],
        explain: '`for (const item of items)` მასივის (და სტრიქონის, Set-ის, Map-ის) ელემენტებზე გადის. `in` ობიექტის გასაღებებისთვისაა.'
    },
    // 8
    {
        topic: 'ციკლები',
        type: 'match',
        text: 'შეუსაბამე მასივის მეთოდი იმას, რასაც ის აკეთებს.',
        pairs: [
            ['forEach', 'ყოველ ელემენტზე ასრულებს ფუნქციას, არაფერს აბრუნებს'],
            ['map', 'აბრუნებს ახალ მასივს გარდაქმნილი ელემენტებით'],
            ['filter', 'ახალ მასივში ტოვებს მხოლოდ პირობის დამაკმაყოფილებელ ელემენტებს'],
            ['find', 'აბრუნებს პირველ ელემენტს, რომელიც პირობას აკმაყოფილებს'],
            ['reduce', 'მასივს ერთ მნიშვნელობამდე ამცირებს (მაგ. ჯამამდე)']
        ],
        explain: 'ეს მეთოდები ციკლის ჩანაცვლებას ემსახურება: `forEach` - გადაუვლის, `map` - გარდაქმნის, `filter` - გაფილტრავს, `find` - ეძებს ერთს, `reduce` - აგროვებს ერთ შედეგად.'
    },
    // 9
    {
        topic: 'ფუნქციები',
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
    // 10
    {
        topic: 'ფუნქციები',
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
    // 11
    {
        topic: 'ფუნქციები',
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
    // 12
    {
        topic: 'ფუნქციები',
        type: 'fill',
        text: 'რა სიტყვა უნდა ჩაწერო, რომ ფუნქციამ ნამრავლი გარეთ დააბრუნოს?',
        template: 'function mul(a, b) { ____ a * b; }',
        accept: ['return'],
        explain: '`return` ფუნქციას წყვეტს და მნიშვნელობას გამომძახებელს უბრუნებს. მის შემდეგ დაწერილი კოდი აღარ სრულდება.'
    },
    // 13
    {
        topic: 'კლასები',
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'class A {',
            '  constructor() { this.x = 1; }',
            '}',
            'class B extends A {',
            '  constructor() {',
            '    super();',
            '    this.y = 2;',
            '  }',
            '}',
            'const b = new B();',
            'console.log(b.x + b.y);'
        ],
        options: ['2', '3', 'NaN', 'შეცდომას'],
        answer: 1,
        explain: '`super()` ამუშავებს მშობლის კონსტრუქტორს და `b`-ს ანიჭებს `x = 1`-ს. მერე `B` ამატებს `y = 2`-ს. ჯამი 3-ია.'
    },
    // 14
    {
        topic: 'კლასები',
        type: 'order',
        text: 'დაალაგე მემკვიდრეობა: `Student` იღებს `Person`-ის თვისებებს და თავისი `school` თვისებაც აქვს.',
        lines: [
            'class Student extends Person {',
            '  constructor(name, school) {',
            '    super(name);',
            '    this.school = school;',
            '  }',
            '}'
        ],
        explain: '`extends` კლასს მშობელს უკავშირებს. კონსტრუქტორში ჯერ `super(...)` უნდა გამოვიძახოთ (მშობლის ნაწილი ინიციალიზდება), მხოლოდ მერე შეგვიძლია `this`-ით ახალი თვისებების დაწერა.'
    },
    // 15
    {
        topic: 'კლასები',
        type: 'bug',
        text: 'მანქანის ბრენდი არ ინახება - ბოლო ხაზი `undefined`-ს ბეჭდავს. რომელ ხაზშია შეცდომა?',
        code: [
            'class Car {',
            '  constructor(brand) {',
            '    brand = brand;',
            '  }',
            '}',
            'console.log(new Car("BMW").brand);'
        ],
        bugs: [3],
        fix: { 3: '    this.brand = brand;' },
        explain: '`brand = brand` პარამეტრს თავის თავს ანიჭებს და ობიექტს არაფერს უწერს. ობიექტის თვისებისთვის `this.brand = brand` გვჭირდება.'
    },
    // 16
    {
        topic: 'კლასები',
        type: 'match',
        text: 'შეუსაბამე სიტყვა მის როლს კლასში.',
        pairs: [
            ['class', 'ობიექტების შაბლონი'],
            ['constructor', 'მეთოდი, რომელიც new-ზე ახალ ობიექტს ამზადებს'],
            ['this', 'მიმდინარე ობიექტი'],
            ['extends', 'მემკვიდრეობა: კლასი სხვა კლასს აფართოებს'],
            ['super', 'მშობელი კლასის კონსტრუქტორის ან მეთოდის გამოძახება'],
            ['static', 'მეთოდი კლასს ეკუთვნის და არა ობიექტს']
        ],
        explain: 'ეს ექვსი სიტყვა კლასების საფუძველია: `class` შაბლონს აღწერს, `constructor` ობიექტს ამზადებს, `this` ობიექტს ეხება, `extends`/`super` მემკვიდრეობას ემსახურება, `static` კი კლასისავე მეთოდებისთვისაა.'
    },
    // 17
    {
        topic: 'DOM',
        type: 'choice',
        text: '`box` დივი გვერდზეა. რას დაინახავს მომხმარებელი ამ ხაზის შემდეგ?',
        snippet: 'box.textContent = "<b>Hi</b>";',
        options: [
            'გამუქებულ სიტყვას Hi',
            'ტექსტს `<b>Hi</b>` ზუსტად ისე, როგორც წერია',
            'არაფერს',
            'შეცდომას'
        ],
        answer: 1,
        explain: '`textContent` ყოველთვის ჩვეულებრივ ტექსტს წერს და თეგებს არ ამუშავებს. `innerHTML` კი ტექსტს HTML-ად გაიგებდა და გამუქებულ Hi-ს აჩვენებდა. მომხმარებლის ტექსტისთვის უსაფრთხო `textContent`-ია - `innerHTML` გვერდზე უცხო სკრიპტის ჩასმის საშუალებას იძლევა.'
    },
    // 18
    {
        topic: 'DOM',
        type: 'choice',
        text: 'რას დააბრუნებს `document.querySelector(".missing")`, თუ გვერდზე ასეთი კლასის ელემენტი არ არსებობს?',
        options: ['undefined', 'null', 'ცარიელ მასივს', 'შეცდომას'],
        answer: 1,
        explain: '`querySelector` ელემენტის ვერმოძებნისას `null`-ს აბრუნებს. შემდეგ `null.textContent = ...` უკვე `TypeError`-ს გამოიწვევს, ამიტომ საჭიროა ან შემოწმება, ან `?.`.'
    },
    // 19
    {
        topic: 'DOM',
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ღილაკზე დაწკაპუნებისას კონსოლში უნდა დაიბეჭდოს „saved“.',
        lines: [
            'const btn = document.querySelector("#save");',
            'btn.addEventListener("click", () => {',
            '  console.log("saved");',
            '});'
        ],
        explain: 'ჯერ ღილაკი უნდა ვიპოვოთ, მერე `addEventListener`-ით მოვლენას ფუნქცია მივაბათ. ფუნქცია `});`-ით იხურება, რადგან `addEventListener`-ის გამოძახებაც ფრჩხილით სრულდება.'
    },
    // 20
    {
        topic: 'DOM',
        type: 'bug',
        text: 'ღილაკი ახალ პუნქტს არ ამატებს. კოდში ორი შეცდომაა. იპოვე ორივე ხაზი.',
        code: [
            'const btn = document.querySelector("#add");',
            'btn.addEventListener("click", addItem());',
            'function addItem() {',
            '  const li = document.createElement("li");',
            '  li.textContent = "Item";',
            '  document.querySelector("ul").appendChild("li");',
            '}'
        ],
        bugs: [2, 6],
        fix: {
            2: 'btn.addEventListener("click", addItem);',
            6: '  document.querySelector("ul").appendChild(li);'
        },
        explain: 'ხაზი 2: `addItem()` ფრჩხილებით ფუნქციას ახლავე გამოიძახებს და მოვლენას მის შედეგს (undefined) გადასცემს. საჭიროა მხოლოდ სახელი: `addItem`. ხაზი 6: `appendChild` ელემენტს ელოდება და არა სტრიქონს `"li"` - ცვლადი `li` უნდა გადავცეთ.'
    },
    // 21
    {
        topic: 'DOM',
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც ღილაკს დაწკაპუნების დამმუშავებელს მივაბამთ.',
        template: 'btn.____("click", handler);',
        accept: ['addEventListener'],
        explain: '`addEventListener(მოვლენა, ფუნქცია)` ელემენტზე მოვლენის მოლოდინს ამატებს. ერთ ელემენტს ბევრი დამმუშავებელი შეიძლება ჰქონდეს.'
    },
    // 22
    {
        topic: 'BOM',
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
    // 23
    {
        topic: 'BOM',
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
    // 24
    {
        topic: 'BOM',
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
    // 25
    {
        topic: 'BOM',
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც მნიშვნელობა `localStorage`-ში ინახება.',
        template: 'localStorage.____("theme", "dark");',
        accept: ['setItem'],
        explain: '`setItem(გასაღები, მნიშვნელობა)` ინახავს, `getItem(გასაღები)` კითხულობს, `removeItem(გასაღები)` შლის, `clear()` კი ყველაფერს ასუფთავებს.'
    },
    // 26
    {
        topic: 'BOM',
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
    // 27
    {
        topic: 'API',
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
    // 28
    {
        topic: 'API',
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
    // 29
    {
        topic: 'API',
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
    // 30
    {
        topic: 'API',
        type: 'fill',
        text: 'ჩაწერე თვისება, რომელიც გვეუბნება, წარმატებული იყო თუ არა პასუხი (სტატუსი 200-299).',
        template: 'if (!res.____) throw new Error("failed");',
        accept: ['ok'],
        explain: '`res.ok` არის `true`, თუ სტატუსი 200-დან 299-მდეა. `res.status` კი ზუსტ კოდს გვაძლევს (მაგ. 404).'
    },
    // 31
    {
        topic: 'API',
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
    // 32
    {
        topic: 'CRUD',
        type: 'choice',
        text: 'რომელი მეთოდი გამოიყენება ჩანაწერის მხოლოდ ზოგიერთი ველის (მაგ. `done`) შესაცვლელად, დანარჩენის შეუხებლად?',
        options: ['GET', 'POST', 'PATCH', 'DELETE'],
        answer: 2,
        explain: '`PATCH` ნაწილობრივ ანახლებს ჩანაწერს, `PUT` კი ჩვეულებრივ მთლიანად ანაცვლებს (ყველა ველი უნდა გადაეცეს).'
    },
    // 33
    {
        topic: 'CRUD',
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'const items = [{ id: 1, t: "a" }, { id: 2, t: "b" }];',
            'const rest = items.filter(i => i.id !== 1);',
            'console.log(rest.length);'
        ],
        options: ['0', '1', '2', 'undefined'],
        answer: 1,
        explain: '`filter` ტოვებს მხოლოდ იმ ელემენტებს, რომლებიც პირობას აკმაყოფილებს. `id !== 1` მხოლოდ მეორე ელემენტს აკმაყოფილებს, ანუ ახალ მასივში 1 ელემენტია. ასე იშლება ელემენტი მასივიდან: ორიგინალის შეცვლის გარეშე.'
    },
    // 34
    {
        topic: 'CRUD',
        type: 'bug',
        text: 'ახალი ჩანაწერის დამატება TypeError-ს იძლევა. რომელ ხაზშია შეცდომა?',
        code: [
            'await fetch("/api/todos", {',
            '  method: "GET",',
            '  headers: { "Content-Type": "application/json" },',
            '  body: JSON.stringify({ title: "Milk" })',
            '});'
        ],
        bugs: [2],
        fix: { 2: '  method: "POST",' },
        explain: '`GET` მოთხოვნას `body` არ შეიძლება ჰქონდეს, ამიტომ `fetch` შეცდომას აგდებს. ახალი ჩანაწერის შესაქმნელად `POST` გვჭირდება.'
    },
    // 35
    {
        topic: 'CRUD',
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც ობიექტი JSON ტექსტად იქცევა სერვერზე გასაგზავნად.',
        template: 'body: JSON.____({ title })',
        accept: ['stringify'],
        explain: '`JSON.stringify({ title })` ობიექტს ტექსტად აქცევს: `{"title":"..."}`. სერვერისგან მიღებულ ტექსტს კი `JSON.parse` (ან `res.json()`) ობიექტად აბრუნებს.'
    },
    // 36
    {
        topic: 'CRUD',
        type: 'match',
        text: 'შეუსაბამე CRUD-ის მოქმედება HTTP მეთოდს.',
        pairs: [
            ['Create', 'POST'],
            ['Read', 'GET'],
            ['Update', 'PUT ან PATCH'],
            ['Delete', 'DELETE']
        ],
        explain: 'ეს თანხვედრა REST API-ების საფუძველია: შექმნა - `POST`, წაკითხვა - `GET`, განახლება - `PUT`/`PATCH`, წაშლა - `DELETE`.'
    }
];
