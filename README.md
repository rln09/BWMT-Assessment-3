# Pantry Perth website

Hi — and sorry.

If you're reading this you've probably picked up the Pantry Perth site
after me. I volunteered with Pantry Perth for about a year doing the web
stuff, and I was part way through redoing the site when life got busy and
I had to step back. I feel bad leaving it half-done, so I've tried to
write this so you're not completely lost.

I'm not a professional developer — I do a bit of coding and I was the
only one around who could, so I picked up the website. Please don't
assume everything in here is done "the right way". It mostly works, but
there are rough edges.

## What this is

A small website for Pantry Perth, a community food pantry. Static pages
for the public-facing stuff, plus a WordPress site behind it for the news
blog and the volunteer/team bits, plus a little donate widget and a tiny
mock server I used for the stock page while there was no real one.

## How it's laid out

```
index.html, donate.html, volunteer.html, stock.html, team.html
                       the actual pages
assets/css/            styles (one main.css, I kept it simple)
assets/js/             the page scripts
assets/img/            images
donate-widget/         the React donate widget (built file is in dist/)
mock-api/              little Node server for the stock list
wp-backup/             how to get the WordPress part (it's hosted elsewhere)
```

There's a `SETUP.md` with step-by-step instructions for getting it all
running locally, and a `RECOVERY.md` for when something won't cooperate.
Start with `SETUP.md`.

## Stuff I know isn't great (sorry)

I'd rather be honest than have you find these the hard way:

- **The hero image on the home page is way too big.** It's a massive
  photo straight off someone's phone. I always meant to resize/compress
  it and never did. It makes the home page slow. Sorry.
- **The mobile menu never worked properly.** On a narrow screen the
  navigation is a bit broken. I started on a hamburger menu thing and
  didn't finish it. On desktop it's fine.
- **There's an "API key" sitting in the stock page JavaScript.** I know
  that's not really how you're supposed to do keys — anyone can read it
  in the browser. The plan was always to move that to the server side
  once we had a proper stock service, but we never got there, so it's
  just sitting in the front-end for now.

There are almost certainly other things that aren't right — I was
learning as I went. If something looks off, it probably is. Trust your
eye and dig in.

## The donate widget

It's a small React thing built with Vite. The built bundle is committed
in `donate-widget/dist/` so the pages just work without you having to
build anything. If you want to change the widget itself there are notes
in `SETUP.md`.

## The WordPress part

That's not in this repo (the backup file is too big for git). See
`wp-backup/README.md` — there's a download link and restore steps. It's
the same LocalWP process you may have done before.

## Last thing

Thank you for taking this on. Pantry Perth does genuinely good work and
the website matters to them more than you'd think — it's how a lot of
people find out the pantry exists and when it's open. Do what you can.
It doesn't have to be perfect.

— the previous volunteer
