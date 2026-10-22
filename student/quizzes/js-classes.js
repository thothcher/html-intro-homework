/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-classes',
    title: 'JavaScript · კლასები',
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
            'class Dog {',
            '  constructor(name) {',
            '    this.name = name;',
            '  }',
            '  bark() {',
            '    return this.name + " woof";',
            '  }',
            '}',
            'const d = new Dog("Rex");',
            'console.log(d.bark());'
        ],
        options: ['Rex woof', 'undefined woof', 'name woof', 'შეცდომას'],
        answer: 0,
        explain: '`new Dog("Rex")` ქმნის ობიექტს და გადასცემს `constructor`-ს. კონსტრუქტორში `this.name = name` ობიექტის თვისებას წერს, მეთოდში `this` იმ ობიექტს ნიშნავს, რომელზეც მეთოდი გამოიძახეს.'
    },
    // 2
    {
        type: 'choice',
        text: 'რა მოხდება, თუ კლასს `new`-ის გარეშე გამოვიძახებთ: `Dog("Rex")`?',
        options: [
            'შეიქმნება ჩვეულებრივი ობიექტი',
            'დაბრუნდება undefined',
            'TypeError: კლასი new-ის გარეშე ვერ გამოიძახება',
            'ყველაფერი ისე იმუშავებს, როგორც new-ით'
        ],
        answer: 2,
        explain: 'კლასი მხოლოდ `new`-ით იძახება. ძველი ტიპის კონსტრუქტორ-ფუნქციას `new` რომ დაგვავიწყდეს, ჩუმად ცუდად იმუშავებდა, კლასი კი ცხადად აგდებს შეცდომას.'
    },
    // 3
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'class Animal {',
            '  speak() { return "..."; }',
            '}',
            'class Cat extends Animal {',
            '  speak() { return "meow"; }',
            '}',
            'console.log(new Cat().speak());'
        ],
        options: ['...', 'meow', '... meow', 'undefined'],
        answer: 1,
        explain: 'შვილობილი კლასი მშობლის მეთოდს თავისი მეთოდით ანაცვლებს (override). `Cat`-ის `speak` უფრო ახლოსაა, ამიტომ სრულდება ის.'
    },
    // 4
    {
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
    // 5
    {
        type: 'choice',
        text: 'კლასს აქვს `static` მეთოდი. რომელი გამოძახება იმუშავებს?',
        snippet: [
            'class MathX {',
            '  static double(n) {',
            '    return n * 2;',
            '  }',
            '}'
        ],
        options: [
            'MathX.double(4)',
            'new MathX().double(4)',
            'MathX.prototype.double(4)',
            'double(4)'
        ],
        answer: 0,
        explain: '`static` მეთოდი თვით კლასს ეკუთვნის და არა მისგან შექმნილ ობიექტებს, ამიტომ იძახება `კლასი.მეთოდი()` ფორმით. `new MathX().double` იქნებოდა `undefined`.'
    },
    // 6
    {
        type: 'choice',
        text: 'რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'class Circle {',
            '  constructor(r) { this.r = r; }',
            '  get diameter() { return this.r * 2; }',
            '}',
            'const c = new Circle(5);',
            'console.log(c.diameter);'
        ],
        options: ['10', 'ფუნქციას', 'undefined', 'TypeError'],
        answer: 0,
        explain: '`get` ქმნის getter-ს: თვისებასავით იკითხება, ფრჩხილების გარეშე (`c.diameter`), მაგრამ ყოველ წაკითხვაზე გამოითვლება. `c.diameter()` TypeError-ს მოგვცემდა.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე კლასის აღწერა: `User` კლასს აქვს `name` თვისება და `hello()` მეთოდი.',
        lines: [
            'class User {',
            '  constructor(name) {',
            '    this.name = name;',
            '  }',
            '  hello() {',
            '    return "Hi " + this.name;',
            '  }',
            '}'
        ],
        explain: 'კლასის ფარგლებში ჯერ `constructor` იწერება, მერე მეთოდები. მეთოდებს შორის არც `function` სიტყვა იწერება და არც მძიმე.'
    },
    // 8
    {
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
    // 9
    {
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
    // 10
    {
        type: 'bug',
        text: 'კოდი ReferenceError-ს აგდებს. პრობლემა ორი ხაზის არასწორ რიგშია - მონიშნე ორივე.',
        code: [
            'class Animal {',
            '  constructor(name) { this.name = name; }',
            '}',
            'class Dog extends Animal {',
            '  constructor(name, breed) {',
            '    this.breed = breed;',
            '    super(name);',
            '  }',
            '}'
        ],
        bugs: [6, 7],
        fix: {
            6: '    super(name);',
            7: '    this.breed = breed;'
        },
        explain: 'შვილობილი კლასის კონსტრუქტორში `this`-ის გამოყენებამდე აუცილებლად უნდა გამოვიძახოთ `super(...)`. წესი ასეთია: ჯერ `super`, მერე `this`.'
    },
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე სიტყვა, რომლითაც `Dog` კლასი `Animal`-ის მემკვიდრე ხდება.',
        template: 'class Dog ____ Animal {',
        accept: ['extends'],
        explain: '`class Dog extends Animal` - `Dog` იღებს `Animal`-ის ყველა თვისებასა და მეთოდს და შეუძლია საკუთარი დაამატოს ან გადააფაროს.'
    },
    // 12
    {
        type: 'fill',
        text: 'რა სიტყვა უნდა ჩაწერო, რომ კლასისგან ახალი ობიექტი შეიქმნას?',
        template: 'const d = ____ Dog("Rex");',
        accept: ['new'],
        explain: '`new` ქმნის ცარიელ ობიექტს, იძახებს `constructor`-ს და ახალ ობიექტს აბრუნებს.'
    },
    // 13
    {
        type: 'fill',
        text: 'ჩაწერე ფუნქცია, რომელიც შვილობილი კლასის კონსტრუქტორში მშობლის კონსტრუქტორს იძახებს.',
        template: 'constructor(name) { ____(name); }',
        accept: ['super'],
        explain: '`super(...)` გადასცემს არგუმენტებს მშობლის `constructor`-ს. მეთოდშიც შეგვიძლია `super.მეთოდი()` დავწეროთ, რომ მშობლის ვერსია გამოვიძახოთ.'
    },
    // 14
    {
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
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე ჩანაწერი მის მნიშვნელობას.',
        pairs: [
            ['#secret', 'private თვისება: მხოლოდ კლასის შიგნიდან ჩანს'],
            ['get area()', 'getter: წაკითხვისას გამოითვლება, ფრჩხილების გარეშე'],
            ['set name(v)', 'setter: მნიშვნელობის მინიჭებისას სრულდება'],
            ['static create()', 'კლასზე გამოძახებადი მეთოდი: User.create()'],
            ['obj instanceof User', 'ამოწმებს, არის თუ არა ობიექტი ამ კლასისგან შექმნილი']
        ],
        explain: '`#` თვისებას კლასის გარეთ წვდომას უკრძალავს. `get` და `set` თვისებასავით გამოიყენება, მაგრამ მათ უკან კოდი სრულდება. `instanceof` კი იმის შესამოწმებლად გვჭირდება, რომელი კლასის ობიექტთან გვაქვს საქმე.'
    }
];
