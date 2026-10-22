/* ტესტის აღწერა. id უნდა ემთხვეოდეს api/src/config.js-ში QUIZZES-ის გასაღებს, კითხვების რაოდენობა კი - max-ს.
   JavaScript-ის ტესტებში: lang 'js'; ჩასაწერ ადგილს ბლანკში აღნიშნავს ____ ; კოდის ნიმუში კითხვის ქვეშ - snippet. */
const QUIZ = {
    id: 'js-conditions',
    title: 'JavaScript · პირობები',
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
            'let temp = 25;',
            'if (temp > 30) {',
            '  console.log("hot");',
            '} else if (temp > 20) {',
            '  console.log("warm");',
            '} else {',
            '  console.log("cold");',
            '}'
        ],
        options: ['hot', 'warm', 'cold', 'warm და cold'],
        answer: 1,
        explain: 'პირობები ზევიდან ქვევით მოწმდება. `25 > 30` მცდარია, `25 > 20` კი ჭეშმარიტი - სრულდება მხოლოდ ეს ბლოკი და დანარჩენი (`else`) გამოტოვებულია.'
    },
    // 2
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: 'console.log(5 == "5", 5 === "5");',
        options: ['true true', 'true false', 'false true', 'false false'],
        answer: 1,
        explain: '`==` ტიპებს ადარებამდე აქცევს ერთნაირად (სტრიქონი "5" რიცხვი 5 ხდება), ამიტომ `true`. `===` ტიპსაც ადარებს: რიცხვი და სტრიქონი სხვადასხვა ტიპია, ამიტომ `false`. ყოველთვის `===` გამოიყენე.'
    },
    // 3
    {
        type: 'choice',
        text: 'რომელი მნიშვნელობა ითვლება პირობაში ჭეშმარიტად (truthy)?',
        options: ['`0`', '`""`', '`"0"`', '`null`'],
        answer: 2,
        explain: 'მცდარია (falsy) მხოლოდ: `false`, `0`, `""` (ცარიელი სტრიქონი), `null`, `undefined`, `NaN`. `"0"` არაცარიელი სტრიქონია, ამიტომ truthy-ა.'
    },
    // 4
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'let name = "";',
            'let shown = name || "guest";',
            'console.log(shown);'
        ],
        options: ['ცარიელ ხაზს', 'guest', 'undefined', 'false'],
        answer: 1,
        explain: '`||` აბრუნებს პირველ truthy მნიშვნელობას. ცარიელი სტრიქონი falsy-ა, ამიტომ შედეგი მარჯვენა მხარეა - `"guest"`. ასე იწერება ნაგულისხმევი მნიშვნელობა.'
    },
    // 5
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'let n = 7;',
            'let kind = n % 2 === 0 ? "even" : "odd";',
            'console.log(kind);'
        ],
        options: ['even', 'odd', '1', 'true'],
        answer: 1,
        explain: '`n % 2` არის 7-ის 2-ზე გაყოფის ნაშთი, ანუ 1. `1 === 0` მცდარია, ამიტომ ტერნარული ოპერატორი (`პირობა ? თუ_ჭეშმარიტია : თუ_მცდარია`) აბრუნებს მეორე მნიშვნელობას - `"odd"`.'
    },
    // 6
    {
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
    // 7
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ქულის მიხედვით უნდა დაიბეჭდოს ნიშანი (90-დან „A“, 70-დან „B“, დანარჩენ შემთხვევაში „C“).',
        lines: [
            'let score = 72;',
            'if (score >= 90) {',
            '  console.log("A");',
            '} else if (score >= 70) {',
            '  console.log("B");',
            '} else {',
            '  console.log("C");',
            '}'
        ],
        explain: 'ჯერ ცვლადი, მერე `if` ყველაზე მკაცრი პირობით, მერე `else if` და ბოლოს `else` - ის მხოლოდ მაშინ სრულდება, როცა ზემოთა პირობები მცდარია.'
    },
    // 8
    {
        type: 'order',
        text: 'დაალაგე `switch`: თუ `color` არის „red“, უნდა დაიბეჭდოს „stop“, სხვა ყველა შემთხვევაში - „go“ (`default` ბოლოში იყოს).',
        lines: [
            'switch (color) {',
            '  case "red":',
            '    console.log("stop");',
            '    break;',
            '  default:',
            '    console.log("go");',
            '}'
        ],
        explain: '`switch`-ის შიგნით ჯერ `case`-ები მოდის, ყოველი მათგანის ბოლოს `break`, ბოლოს კი `default` - ის მაშინ სრულდება, როცა არც ერთი `case` არ ემთხვევა.'
    },
    // 9
    {
        type: 'bug',
        text: 'კოდს პაროლი უნდა შეემოწმებინა, მაგრამ ყოველთვის „welcome“-ს ბეჭდავს. რომელ ხაზშია შეცდომა?',
        code: [
            'let password = "wrong";',
            'if (password = "abc123") {',
            '  console.log("welcome");',
            '} else {',
            '  console.log("denied");',
            '}'
        ],
        bugs: [2],
        fix: { 2: 'if (password === "abc123") {' },
        explain: 'ერთი `=` მნიშვნელობას ანიჭებს და არა ადარებს: `password` ხდება "abc123", ეს არაცარიელი სტრიქონია (truthy) და პირობა ყოველთვის სრულდება. შესადარებლად `===` გვჭირდება.'
    },
    // 10
    {
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
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე ოპერატორი, რომელიც ადარებს მნიშვნელობასაც და ტიპსაც.',
        template: 'if (a ____ b) {',
        accept: ['==='],
        explain: '`===` მკაცრი ტოლობაა: `5 === "5"` მცდარია. `==` ტიპებს თავისით გარდაქმნის და მოულოდნელ შედეგს იძლევა, ამიტომ მისი გამოყენება არ ვარგა.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე სიმბოლო, რომელიც ტერნარულ ოპერატორში პირობას ჭეშმარიტი მნიშვნელობისგან ჰყოფს.',
        template: 'let msg = age >= 18 ____ "adult" : "minor";',
        accept: ['?'],
        explain: 'ტერნარული ოპერატორის ფორმაა `პირობა ? თუ_ჭეშმარიტია : თუ_მცდარია`. `?` პირობას მოსდევს, `:` ორ მნიშვნელობას ჰყოფს.'
    },
    // 13
    {
        type: 'fill',
        text: 'რა სიტყვა უნდა ჩაწერო, რომ `case 1`-ის შესრულების შემდეგ `switch` გაჩერდეს?',
        template: 'case 1: console.log("Mon"); ____;',
        accept: ['break'],
        explain: '`break` ანგრევს `switch`-ს და არ აძლევს შესრულებას შემდეგ `case`-ზე გადასვლის საშუალებას.'
    },
    // 14
    {
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
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე გამოსახულება იმ მნიშვნელობას, რასაც `typeof` დააბრუნებს.',
        pairs: [
            ['typeof 42', '"number"'],
            ['typeof "hi"', '"string"'],
            ['typeof true', '"boolean"'],
            ['typeof undefined', '"undefined"'],
            ['typeof {}', '"object"']
        ],
        explain: '`typeof` აბრუნებს ტიპის სახელს სტრიქონად. ობიექტისთვის (`{}`, მასივი, `null`) შედეგი `"object"`-ია, ფუნქციისთვის - `"function"`.'
    }
];
