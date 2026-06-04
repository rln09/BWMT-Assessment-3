# Setup

How to get the Pantry Perth site running on your own machine. Budget
about 20–30 minutes the first time, mostly waiting on the WordPress
restore.

If something here doesn't work, check `RECOVERY.md` before panicking.

---

## What you need installed

- **Node.js** 18 or newer — <https://nodejs.org/> (`node --version` to
  check)
- **LocalWP** — <https://localwp.com/> (for the WordPress part)
- A terminal you're comfortable with
- A modern browser with DevTools (Chrome, Firefox, or Edge)

That's it. The static site has no build step to run it, and the mock API
has no dependencies.

---

## The pieces

The site is made of three things that run separately:

| Piece            | What it is                          | How it runs                 |
|------------------|-------------------------------------|-----------------------------|
| Static frontend  | The HTML/CSS/JS pages               | Any static file server      |
| Mock stock API   | A small Node server                 | `node mock-api/server.js`   |
| WordPress site   | News + volunteer/team data          | LocalWP                     |

You generally want all three running to see the whole site behave.

---

## 1. Restore the WordPress site

Follow `wp-backup/README.md`. Download the `.wpress` backup (link is in
your Blackboard assessment instructions), restore it in LocalWP, and
start the site.

Write down the local URL LocalWP gives you, e.g.
`http://pantry-perth.local`.

> **About the URL:** these instructions assume the default LocalWP restore —
> a site named `pantry-perth`, which gives the domain `pantry-perth.local`.
> If you named the site differently (or LocalWP assigned a different
> domain), check the site's **Overview** tab in LocalWP for the real URL
> and substitute it everywhere you see `pantry-perth.local` below.

To reach the WordPress dashboard (you'll need this to inspect and test the
back-end), go to `http://pantry-perth.local/wp-admin` and log in with:

| Field    | Value               |
|----------|---------------------|
| Username | `admin`             |
| Password | `pantry-perth-2026` |

These are local-only credentials for a throwaway practice site — they are
not secret and not used anywhere else.

## 2. Run the mock stock API

> You don't need to read or change anything in `mock-api/`. It's just a
> small server so the stock page has data to fetch. Start it, leave it
> running, move on — none of the things you're triaging live in there.

From the repository root:

```bash
node mock-api/server.js
```

You should see:

```
Pantry Perth mock stock API running at http://localhost:4000
```

Leave this terminal open. Quick check in another terminal or your
browser:

```bash
curl http://localhost:4000/api/stock
```

That should return JSON with a list of stock items.

## 3. Serve the static frontend

The pages are plain static files, so any static server works. Pick one:

**Option A — Python (already on macOS / most Linux):**

```bash
python3 -m http.server 8765
```

**Option B — Node:**

```bash
npx serve -l 8765
```

Then open <http://localhost:8765/index.html> in your browser.

> Don't open the HTML files with `file://` (double-clicking them).
> Several pages make network requests that browsers block from
> `file://`. Always go through the static server.

## 4. (Optional) Run the donate-widget dev server

You only need this if you want to **modify** the donate widget. A
pre-built bundle is already committed at
`donate-widget/dist/donate-widget.iife.js`, and the static pages load
that — so the widget works without this step.

If you do want to work on it:

```bash
cd donate-widget
npm install
npm run dev
```

That starts Vite on its own port with a live preview of just the widget.
When you're done changing it, rebuild the bundle so the main site picks
up your changes:

```bash
npm run build
```

This overwrites `donate-widget/dist/donate-widget.iife.js`. Commit the
rebuilt bundle.

---

## What "working" looks like

With the mock API running and the static site served:

- The home page loads with the hero section and the donate widget.
- The stock page shows a list of pantry items.
- The news link goes to the WordPress site.
- The volunteer and team pages load.

If some of that doesn't behave the way you'd expect a finished site to —
that's the point of this assessment. Your job is to find out why and
write it up. Start poking around with DevTools open.
