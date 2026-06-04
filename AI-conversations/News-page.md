**ME** WHY WON'T MY POSTS API DISPLAY DATA ON THE FRONTEND?
**AI** I can see exactly why — there are **three separate bugs** all preventing data from displaying. Let me show you each one:Fix Bug 1 and Bug 2 first — between them they mean no JavaScript ever runs, and even if it did, it would write to a container that doesn't exist. Here's the order to apply the fixes:

**In `wp.html`, make three changes:**

1. Bottom of `<body>` — change `assets/js/nwp.js` → `assets/js/wp.js`
2. The container div — change `id="Blog"` → `id="news-list"`
3. The `<title>` and nav `aria-current` — update to reflect the News page

Once those are saved, reload the page with LocalWP running. You should immediately see the "Loading latest news..." spinner, followed by posts appearing. If you still see nothing after fixing all three, open DevTools → Network and check whether the fetch to `http://pantry.local/wp-json/wp/v2/posts` is succeeding — if LocalWP isn't started, the `fetch` will fail and you'll see the error message instead.
