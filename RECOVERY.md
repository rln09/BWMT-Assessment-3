# Recovery

Things that commonly go wrong during setup, and how to get unstuck. None
of this is part of the assessment — it's just plumbing. If you're still
stuck after trying the relevant section, ask on the unit discussion
board.

---

## The `.wpress` backup won't restore in LocalWP

LocalWP changed its restore flow between versions, so the drag-and-drop
doesn't always work.

**Fallback: import into a blank site.**

1. In LocalWP, create a **new blank site** (any name, PHP 8.1+,
   WordPress latest).
2. Start it and open **WP Admin**.
3. Install and activate the **All-in-One WP Migration** plugin
   (Plugins → Add New → search for it).
4. Go to **All-in-One WP Migration → Import**, choose **Import from
   file**, and select the `.wpress` file.
5. Confirm the overwrite when prompted, then follow the link to log back
   in.

If the file itself looks corrupt (size is tiny, or the import errors
immediately), re-download it — partial downloads are the usual cause.

## LocalWP site won't start / "port in use"

- Stop other LocalWP sites you have running.
- Restart LocalWP entirely.
- On macOS, make sure nothing else is bound to the LocalWP router port
  (other dev tools sometimes grab it). Quitting Docker/other local
  servers and restarting LocalWP usually clears it.

## The WordPress URL is different from the examples

That's normal — LocalWP picks the hostname. Use whatever URL LocalWP
shows for the site (e.g. `http://pantry-perth.local` or a
`localhost:PORT` form). Wherever the docs show an example WP URL,
substitute yours.

---

## `node mock-api/server.js` says port 4000 is already in use

Something else is on port 4000. Two options:

**Preferred — free port 4000:**

Find and stop whatever is using it.

```bash
# macOS / Linux
lsof -i :4000
# then stop that process, or close the app that started it
```

**If you can't free it — run on another port:**

```bash
PORT=4001 node mock-api/server.js
```

Be aware: the frontend code is written to talk to port 4000. If you move
the API to a different port, the stock page won't reach it until the URL
in the frontend matches. Freeing 4000 is the cleaner path.

## The stock page is empty / no items show

Checklist:

- Is the mock API actually running? Re-run `node mock-api/server.js` and
  watch for the "running at http://localhost:4000" line.
- Test it directly: `curl http://localhost:4000/api/stock` — do you get
  JSON back?
- Are you opening the page through the static server
  (`http://localhost:8765/...`) and **not** as a `file://` path?
- Open DevTools → Console and → Network and look at what the page is
  actually doing. (Reading these tells you a lot — that's intentional.)

## The donate widget doesn't appear / bundle missing

The pages load `donate-widget/dist/donate-widget.iife.js`. If that file
is missing or you suspect it's stale, rebuild it:

```bash
cd donate-widget
npm install
npm run build
```

That regenerates `dist/donate-widget.iife.js`. Reload the page.

If `npm install` fails, it's almost always network/registry — check your
connection, try again, or switch networks.

## `node` / `npm` not found, or version errors

- `node --version` should be 18 or higher. If it's missing or old,
  install the current LTS from <https://nodejs.org/>.
- After installing, open a **new** terminal so the `PATH` updates.

## Static server port 8765 in use

Pick any other free port — it's just where you view the site:

```bash
python3 -m http.server 8080
# or
npx serve -l 8080
```

Then browse to that port instead. The static server port doesn't matter
to anything else.

---

## Nuclear option: clean re-clone

If the repository state itself feels broken (you've edited a lot and want
a clean baseline to compare against), clone a fresh copy of your
submission repo into a separate folder and diff against it. Don't delete
your working copy — your git history is part of what you submit.
