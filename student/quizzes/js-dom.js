/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-dom',
    title: 'JavaScript · DOM',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'კოდი გამოსცადე ბრაუზერის კონსოლში (`F12` → Console) ან საკუთარ `index.html` ფაილში.'
};

const QUESTIONS = [
    // 1
    {
        type: 'choice',
        text: 'რომელი გამოსახულება პოულობს ელემენტს მისი `id`-ით?',
        options: [
            '`document.getElementById("title")`',
            '`document.getElement("#title")`',
            '`document.findById("title")`',
            '`document.id("title")`'
        ],
        answer: 0,
        explain: '`getElementById` id-ს სახელს ირჩევს `#`-ის გარეშე. თუ გვინდა CSS სელექტორის გამოყენება, `document.querySelector("#title")` დავწეროთ.'
    },
    // 2
    {
        type: 'choice',
        text: 'გვერდზე ეს ორი აბზაცია. რას დააბრუნებს `document.querySelectorAll(".note").length`?',
        snippet: [
            '<p class="note">One</p>',
            '<p class="note">Two</p>'
        ],
        snippetLang: 'html',
        options: ['0', '1', '2', 'undefined'],
        answer: 2,
        explain: '`querySelectorAll` აბრუნებს ყველა შესაბამის ელემენტს (NodeList), მათი რაოდენობა კი `length`-ში წერია. `querySelector` მხოლოდ პირველს აბრუნებდა.'
    },
    // 3
    {
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
    // 4
    {
        type: 'choice',
        text: 'რას აკეთებს `event.preventDefault()` ფორმის `submit` მოვლენაში?',
        options: [
            'აჩერებს ბრაუზერის ნაგულისხმევ ქცევას (მაგ. გვერდის გადატვირთვას)',
            'ფორმას ასუფთავებს',
            'ფორმას სერვერზე აგზავნის',
            'ყველა სხვა მოვლენას გამორთავს'
        ],
        answer: 0,
        explain: 'ფორმის გაგზავნისას ბრაუზერი გვერდს თავიდან ტვირთავს. `preventDefault()` ამას აჩერებს და მონაცემების JavaScript-ით დამუშავების საშუალებას გვაძლევს (მაგ. `fetch`-ით).'
    },
    // 5
    {
        type: 'choice',
        text: 'ელემენტს თავიდან `active` კლასი არ აქვს. რას დაბეჭდავს ეს კოდი?',
        snippet: [
            'el.classList.toggle("active");',
            'el.classList.toggle("active");',
            'console.log(el.classList.contains("active"));'
        ],
        options: ['true', 'false', 'undefined', 'შეცდომას'],
        answer: 1,
        explain: '`toggle` კლასს ამატებს, თუ ის არ არის, და აშორებს, თუ არის. პირველმა გამოძახებამ დაამატა, მეორემ მოხსნა, ამიტომ `contains` აბრუნებს `false`-ს.'
    },
    // 6
    {
        type: 'choice',
        text: 'რას დააბრუნებს `document.querySelector(".missing")`, თუ გვერდზე ასეთი კლასის ელემენტი არ არსებობს?',
        options: ['undefined', 'null', 'ცარიელ მასივს', 'შეცდომას'],
        answer: 1,
        explain: '`querySelector` ელემენტის ვერმოძებნისას `null`-ს აბრუნებს. შემდეგ `null.textContent = ...` უკვე `TypeError`-ს გამოიწვევს, ამიტომ საჭიროა ან შემოწმება, ან `?.`.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე კოდი სწორ რიგში: ახალი `<li>` უნდა შეიქმნას, ტექსტი მიენიჭოს და გვერდზე სიას დაემატოს.',
        lines: [
            'const li = document.createElement("li");',
            'li.textContent = "New task";',
            'document.querySelector("ul").append(li);'
        ],
        explain: 'ელემენტი ჯერ იქმნება (`createElement`), მერე ივსება (`textContent`) და ბოლოს ემატება გვერდს (`append`). სანამ არ დაემატება, ის DOM-ში არ არსებობს და ეკრანზე არ ჩანს.'
    },
    // 8
    {
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
    // 9
    {
        type: 'bug',
        text: 'სათაურის ტექსტი არ იცვლება და კონსოლში TypeError ჩანს. რომელ ხაზშია შეცდომა?',
        code: [
            'const title = document.getElementById("#title");',
            'title.textContent = "Hello";'
        ],
        bugs: [1],
        fix: { 1: 'const title = document.getElementById("title");' },
        explain: '`getElementById` id-ს `#`-ის გარეშე იღებს. `"#title"` სახელის ელემენტი არ არსებობს, ამიტომ დაბრუნდა `null` და მეორე ხაზზე `null.textContent` TypeError-ს იძლევა.'
    },
    // 10
    {
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
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომელიც CSS სელექტორით პირველ ელემენტს პოულობს.',
        template: 'const card = document.____(".card");',
        accept: ['querySelector'],
        explain: '`querySelector` იღებს ნებისმიერ CSS სელექტორს (`.card`, `#id`, `ul > li`...) და პირველ შესაბამის ელემენტს აბრუნებს.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც ღილაკს დაწკაპუნების დამმუშავებელს მივაბამთ.',
        template: 'btn.____("click", handler);',
        accept: ['addEventListener'],
        explain: '`addEventListener(მოვლენა, ფუნქცია)` ელემენტზე მოვლენის მოლოდინს ამატებს. ერთ ელემენტს ბევრი დამმუშავებელი შეიძლება ჰქონდეს.'
    },
    // 13
    {
        type: 'fill',
        text: 'ჩაწერე თვისება, რომლის საშუალებითაც ელემენტს კლასს ვუმატებთ.',
        template: 'box.____.add("hidden");',
        accept: ['classList'],
        explain: '`classList`-ს აქვს მეთოდები: `add`, `remove`, `toggle`, `contains`. CSS-ში აღწერილი კლასის ჩართვა-გამორთვა ვიზუალის შესაცვლელად უკეთესია, ვიდრე ხაზობრივი სტილები.'
    },
    // 14
    {
        type: 'match',
        text: 'შეუსაბამე მეთოდი მის დანიშნულებას.',
        pairs: [
            ['getElementById', 'ელემენტის პოვნა id-ით'],
            ['querySelectorAll', 'ყველა ელემენტის პოვნა CSS სელექტორით'],
            ['createElement', 'ახალი ელემენტის შექმნა (გვერდზე ჯერ არ ჩანს)'],
            ['append', 'ელემენტის დამატება მშობლის ბოლოს'],
            ['remove', 'ელემენტის გვერდიდან წაშლა']
        ],
        explain: 'DOM-თან მუშაობა სამ ნაწილად იყოფა: ელემენტის პოვნა (`get...`/`query...`), შექმნა (`createElement`) და შეცვლა (`append`, `remove`, `textContent`, `classList`...).'
    },
    // 15
    {
        type: 'match',
        text: 'შეუსაბამე მოვლენა იმას, როდის ხდება ის.',
        pairs: [
            ['click', 'ელემენტზე დაწკაპუნებისას'],
            ['input', 'ველში ტექსტის ყოველი ცვლილებისას'],
            ['submit', 'ფორმის გაგზავნისას'],
            ['keydown', 'კლავიშის დაჭერისას'],
            ['DOMContentLoaded', 'როცა HTML გვერდი მთლიანად ჩაიტვირთა']
        ],
        explain: 'ყველაზე ხშირად `click`, `input` და `submit` გამოიყენება. `DOMContentLoaded` გვეხმარება, რომ სკრიპტმა ელემენტების პოვნა მაშინ დაიწყოს, როცა ისინი უკვე არსებობს.'
    }
];
