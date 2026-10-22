/* ტესტის აღწერა: იხ. js-conditions.js */
const QUIZ = {
    id: 'js-crud',
    title: 'JavaScript · CRUD',
    lang: 'js',
    hero: 'img/hero-js.svg',
    note: 'სამეცადინოდ გამოგადგება `jsonplaceholder.typicode.com` ან `mockapi.io` - იქ მოთხოვნებს შეგიძლია უსაფრთხოდ გაუშვა.'
};

const QUESTIONS = [
    // 1
    {
        type: 'choice',
        text: 'რას ნიშნავს CRUD?',
        options: [
            'Create, Read, Update, Delete - შექმნა, წაკითხვა, განახლება, წაშლა',
            'Copy, Run, Use, Debug',
            'Connect, Request, Upload, Download',
            'Class, Router, URL, Data'
        ],
        answer: 0,
        explain: 'CRUD მონაცემებზე ოთხი ძირითადი მოქმედებაა. თითქმის ყველა აპლიკაცია (ბლოგი, ონლაინ მაღაზია, ამოცანების სია) ამ ოთხს აკეთებს.'
    },
    // 2
    {
        type: 'choice',
        text: 'რომელი HTTP მეთოდით იქმნება სერვერზე ახალი ჩანაწერი?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        answer: 1,
        explain: '`POST` ახალ ჩანაწერს ქმნის, ჩანაწერის მონაცემები კი მოთხოვნის `body`-შია. `GET` კითხულობს, `PUT`/`PATCH` ცვლის, `DELETE` შლის.'
    },
    // 3
    {
        type: 'choice',
        text: 'რომელი მეთოდი გამოიყენება ჩანაწერის მხოლოდ ზოგიერთი ველის (მაგ. `done`) შესაცვლელად, დანარჩენის შეუხებლად?',
        options: ['GET', 'POST', 'PATCH', 'DELETE'],
        answer: 2,
        explain: '`PATCH` ნაწილობრივ ანახლებს ჩანაწერს, `PUT` კი ჩვეულებრივ მთლიანად ანაცვლებს (ყველა ველი უნდა გადაეცეს).'
    },
    // 4
    {
        type: 'choice',
        text: 'რას აკეთებს ეს მოთხოვნა?',
        snippet: 'fetch("/api/todos/5", { method: "DELETE" });',
        options: [
            'წაშლის ჩანაწერს, რომლის id არის 5',
            'წაშლის ყველა ჩანაწერს',
            'წაიკითხავს ჩანაწერს 5',
            'შექმნის მეხუთე ჩანაწერს'
        ],
        answer: 0,
        explain: 'REST-ში ერთ ჩანაწერს საკუთარი მისამართი აქვს: `/todos/5`, ხოლო მოქმედებას HTTP მეთოდი განსაზღვრავს. `DELETE /todos/5` ნიშნავს „წაშალე ჩანაწერი 5“.'
    },
    // 5
    {
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
    // 6
    {
        type: 'choice',
        text: 'რატომ ვუმატებთ POST მოთხოვნას ჰედერს `"Content-Type": "application/json"`?',
        options: [
            'რომ სერვერმა იცოდეს, რომ `body` JSON ფორმატშია',
            'რომ მოთხოვნა უფრო სწრაფად შესრულდეს',
            'რომ პასუხი ქეშში შეინახოს',
            'რომ ბრაუზერმა `fetch` გახსნას'
        ],
        answer: 0,
        explain: 'ჰედერი სერვერს ეუბნება, როგორ წაიკითხოს `body`. ამის გარეშე ბევრი სერვერი JSON-ს ვერ ამოიცნობს და მონაცემებს ვერ მიიღებს.'
    },
    // 7
    {
        type: 'order',
        text: 'დაალაგე ფუნქცია: ჯერ ჩანაწერი სერვერზე წაიშალოს, მერე იგივე ჩანაწერი ლოკალური `todos` სიიდან ამოვიღოთ და ბოლოს სია თავიდან გამოვსახოთ.',
        lines: [
            'async function deleteTodo(id) {',
            '  await fetch("/api/todos/" + id, { method: "DELETE" });',
            '  todos = todos.filter(t => t.id !== id);',
            '  renderTodos();',
            '}'
        ],
        explain: 'ჯერ სერვერი (`await fetch ... DELETE`), მერე ლოკალური მონაცემები (`filter`), ბოლოს ეკრანი (`renderTodos`). ასე ეკრანზე ის ჩანს, რაც მართლა სერვერზეა.'
    },
    // 8
    {
        type: 'order',
        text: 'დაალაგე ფორმის დამმუშავებელი: ჯერ ბრაუზერის ნაგულისხმევი გაგზავნა შეაჩერე, მერე ტექსტი აიღე, შექმენი ჩანაწერი და ბოლოს ველი გაასუფთავე.',
        lines: [
            'form.addEventListener("submit", async (e) => {',
            '  e.preventDefault();',
            '  const title = input.value.trim();',
            '  await createTodo(title);',
            '  input.value = "";',
            '});'
        ],
        explain: '`preventDefault()` პირველია, რომ გვერდი არ გადაიტვირთოს. მერე ვკითხულობთ ველს, ვქმნით ჩანაწერს (`await`, რადგან ეს ქსელური მოქმედებაა) და ბოლოს ველს ვასუფთავებთ.'
    },
    // 9
    {
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
    // 10
    {
        type: 'bug',
        text: 'ჩანაწერის განახლება არ მუშაობს. კოდში ორი შეცდომაა. იპოვე ორივე ხაზი.',
        code: [
            'async function updateTodo(id) {',
            '  const res = await fetch("/api/todos/", {',
            '    method: "PUT",',
            '    headers: { "Content-Type": "application/json" },',
            '    body: { done: true }',
            '  });',
            '  return res.json();',
            '}'
        ],
        bugs: [2, 5],
        fix: {
            2: '  const res = await fetch("/api/todos/" + id, {',
            5: '    body: JSON.stringify({ done: true })'
        },
        explain: 'ხაზი 2: მისამართში ჩანაწერის `id` არ არის, სერვერმა არ იცის, რომელი ჩანაწერი განაახლოს. ხაზი 5: `body` ტექსტი უნდა იყოს და არა ობიექტი - `JSON.stringify` გვჭირდება, თორემ გაიგზავნება `[object Object]`.'
    },
    // 11
    {
        type: 'fill',
        text: 'ჩაწერე HTTP მეთოდი, რომლითაც ჩანაწერი მთლიანად ჩანაცვლდება.',
        template: 'fetch("/api/todos/1", { method: "____" })',
        accept: ['PUT'],
        explain: '`PUT` მთლიან ჩანაწერს ანაცვლებს. მეთოდის სახელი `fetch`-ში დიდი ასოებით იწერება.'
    },
    // 12
    {
        type: 'fill',
        text: 'ჩაწერე მასივის მეთოდი, რომლითაც ლოკალური სიიდან `id`-ით ელემენტი ამოვაგდოთ.',
        template: 'todos = todos.____(t => t.id !== id);',
        accept: ['filter'],
        explain: '`filter` ახალ მასივს აბრუნებს, რომელშიც მხოლოდ დარჩენილი ელემენტებია, ამიტომ მის შედეგს `todos`-ს ვუნიშნებთ.'
    },
    // 13
    {
        type: 'fill',
        text: 'ჩაწერე მეთოდი, რომლითაც ობიექტი JSON ტექსტად იქცევა სერვერზე გასაგზავნად.',
        template: 'body: JSON.____({ title })',
        accept: ['stringify'],
        explain: '`JSON.stringify({ title })` ობიექტს ტექსტად აქცევს: `{"title":"..."}`. სერვერისგან მიღებულ ტექსტს კი `JSON.parse` (ან `res.json()`) ობიექტად აბრუნებს.'
    },
    // 14
    {
        type: 'match',
        text: 'შეუსაბამე CRUD-ის მოქმედება HTTP მეთოდს.',
        pairs: [
            ['Create', 'POST'],
            ['Read', 'GET'],
            ['Update', 'PUT ან PATCH'],
            ['Delete', 'DELETE']
        ],
        explain: 'ეს თანხვედრა REST API-ების საფუძველია: შექმნა - `POST`, წაკითხვა - `GET`, განახლება - `PUT`/`PATCH`, წაშლა - `DELETE`.'
    },
    // 15
    {
        type: 'match',
        text: 'მონაცემები მასივშია შენახული. შეუსაბამე მასივის მეთოდი CRUD-ის მოქმედებას.',
        pairs: [
            ['push', 'ახალი ელემენტის დამატება (Create)'],
            ['find', 'ერთი ელემენტის პოვნა (Read)'],
            ['map', 'ელემენტის შეცვლა ახალ მასივში (Update)'],
            ['filter', 'ელემენტის ამოღება ახალ მასივში (Delete)'],
            ['splice', 'ელემენტის წაშლა ან ჩასმა ინდექსით']
        ],
        explain: 'სერვერისა და ბაზის გარეშეც CRUD ზუსტად ასე მუშაობს - მასივზე: `push` ამატებს, `find` პოულობს, `map` ცვლის, `filter` ან `splice` შლის.'
    }
];
