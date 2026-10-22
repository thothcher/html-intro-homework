# HTML intro homework

A quiz for students (HTML basics, lecture 4) whose results go to a small database that lecturers can browse.

**Students open the list of quizzes:** https://thothcher.github.io/html-intro-homework/student/menu.html

| Quiz | Direct link |
|---|---|
| HTML intro (lecture 4, 24 questions) | https://thothcher.github.io/html-intro-homework/student/ |
| JavaScript · conditions | https://thothcher.github.io/html-intro-homework/student/?quiz=js-conditions |
| JavaScript · loops | https://thothcher.github.io/html-intro-homework/student/?quiz=js-loops |
| JavaScript · functions | https://thothcher.github.io/html-intro-homework/student/?quiz=js-functions |
| JavaScript · classes | https://thothcher.github.io/html-intro-homework/student/?quiz=js-classes |
| JavaScript · DOM | https://thothcher.github.io/html-intro-homework/student/?quiz=js-dom |
| JavaScript · BOM | https://thothcher.github.io/html-intro-homework/student/?quiz=js-bom |
| JavaScript · API (fetch) | https://thothcher.github.io/html-intro-homework/student/?quiz=js-api |
| JavaScript · CRUD | https://thothcher.github.io/html-intro-homework/student/?quiz=js-crud |

(the old link `.../homework.html` redirects to the HTML quiz)

## How it fits together

| Part | Where | What it is |
|---|---|---|
| `student/` | this repository, published with GitHub Pages | The quiz students take |
| `api/` | Cloudflare Workers + D1 database (free) | Stores results and enforces the rules |
| Lecturers' dashboard | its own repository and GitHub Pages site | Results, charts and CSV export (needs an access code) |

```
student site ──► API ◄── lecturers' site
 (public)     (Cloudflare)   (needs the access code)
```

API address: `https://homework-api.homework-api.workers.dev`

**Rules the server enforces**

- A student can take the test **once**. Name + group identify them; capitals and word order don't matter (`giorgi beridze` = `Beridze Giorgi`). A lecturer can clear an attempt from the dashboard if a student typed the wrong group.
- Group names are case-insensitive: `se-621-6` and `SE-621-6` are the same group, stored as `SE-621-6`. `JP_539_4` / `jp-539-4` also match. Groups appear in the lecturers' dropdown automatically after the first student submits.
- Scores can only be read with the **lecturer access code**. Every lecturer sees every group and every other lecturer's students.

---

## Everyday tasks

| I want to... | Do this |
|---|---|
| Change a question | Edit `student/quizzes/<quiz id>.js`, then `git add -A && git commit -m "..." && git push`. GitHub Pages updates in about a minute. |
| Add or remove a lecturer | Edit the list in `api/src/config.js`, then `cd api && npx wrangler deploy`. Removed lecturers disappear from the dropdowns; their students' results are kept. |
| Change the access code | `cd api && npx wrangler secret put LECTURER_CODE` (lecturers are asked to log in again) |
| Delete a result / let a student retake the test | Lecturers' dashboard → click the trash icon at the end of the student's row and confirm. The student can then take the test again. |
| Export results | Lecturers' dashboard → **CSV** (opens in Excel; follows the selected group) |
| Back up everything | `cd api && npx wrangler d1 export homework-db --remote --output backup.sql` |
| Start a new semester | `cd api && npx wrangler d1 execute homework-db --remote --command "DELETE FROM results"` |
| Add another quiz | Copy a file in `student/quizzes/` (e.g. `js-loops.js`), give it a new `id`, write the questions, add the same id, title and number of questions to `QUIZZES` in `api/src/config.js`, run `npm test` (checks the question files), deploy the API, add a tile to `student/menu.html` and push. The quiz opens at `student/?quiz=<id>`; the dashboard's quiz picker lists it automatically. |

## Deploy from scratch

You need a free [Cloudflare account](https://dash.cloudflare.com/sign-up), Node.js, and (for the websites) a GitHub account.

1. **API.** In the `api` folder run `npm install`, `npx wrangler login`, `npx wrangler d1 create homework-db`. Paste the printed `database_id` into `api/wrangler.toml`, then `npx wrangler deploy`. It prints the API address. Tables and the lecturer list are created automatically on the first request.
2. **Access code.** `npx wrangler secret put LECTURER_CODE` and type a long passphrase. Until a code is set, the dashboard refuses to open.
3. **Point the websites at the API.** Put the API address into `student/config.js` (and into `config.js` of the lecturers' site).
4. **Publish the student site.** Repository → Settings → Pages → Deploy from branch → `main` / `/ (root)`. The student site is then at `https://<user>.github.io/<repo>/student/`.

On Windows PowerShell, if `npm` says "running scripts is disabled", run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once and open a new window.

## Run everything on your computer

```bash
cd api
npm install
copy .dev.vars.example .dev.vars     # Windows. On Mac/Linux: cp
npm run dev                          # API on http://127.0.0.1:8787, local test database
```

Set `API` in `student/config.js` to `http://127.0.0.1:8787` and open `student/index.html`. The access code is whatever is in `.dev.vars`. (Do not commit the changed `config.js`.)

```bash
npm test            # group/name matching rules and the structure of every quiz file (no server needed)
npm run test:api    # full API test against the running dev server
```

## Good to know

- The student page's JavaScript lives in `quizzes/*.js`, `loader.js` and `app.js` on purpose. Tools like VS Code **Live Server** insert a script before the first closing body tag of the HTML, and question 2's code sample contains such a line, which used to cut the page's script in half and print the code as text. Keep the JavaScript out of `index.html`.
- **Scoring happens in the student's browser.** The server checks that a result is consistent (score matches the per-question answers, the lecturer exists, one attempt per student) but cannot tell if someone read the answers from the page source or sent a made-up result. If cheating becomes a problem, the next step is to move the answer key into the API.
- The access code is one shared code. Use a long passphrase; never put it in this repository.
- Anyone who knows the API address can send results to the public student endpoints. Junk rows can be cleared one by one from the dashboard.
- The free Cloudflare plan is plenty for a class (100k requests and 100k database writes per day). The dashboard pauses auto-refresh in background tabs to save quota.
- Results from the very first version (MockAPI) were not migrated - they had no group or lecturer.
- Quiz files declare `lang: 'html'` or `'js'`: it picks the code colouring and, for fill-in-the-blank questions, the blank marker (`{}` in HTML quizzes, `____` in JavaScript quizzes) and whether capitals matter (they do in JavaScript). A question can show a code sample with `snippet`.
