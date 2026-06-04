# WordPress backup

The Pantry Perth WordPress site is **not stored in this repository** — the
backup file is too large for git and is hosted externally instead.

## Download

> **Download link:** <https://lms.curtin.edu.au/bbcswebdav/pid-14310588-dt-content-rid-94828656_1/xid-94828656_1>
>
> (You may need to be logged in to Blackboard. If the link doesn't work,
> the same file is linked from the Assessment 3 area on Blackboard.)

You're after a single LocalWP export file with a `.wpress` extension
(roughly 30–60 MB).

## What's in it

The WordPress site provides the parts of Pantry Perth that aren't plain
static HTML:

- the **News** section (a normal WordPress blog with a few posts)
- the **volunteer signup** handling behind the volunteer form
- the data the **Team** page shows

You don't need to understand the internals to get the site running — you
just need it restored and serving locally.

## Restore steps (LocalWP)

This is the same workflow you used in Assignment 2.

1. Install **LocalWP** if you don't have it: <https://localwp.com/>
2. Open LocalWP.
3. Drag the downloaded `.wpress` file onto the LocalWP window
   (or use **+ Add Local Site → Restore from backup** depending on your
   LocalWP version — older versions use the All-in-One WP Migration
   import inside a blank site instead; see `../RECOVERY.md` if the drag
   doesn't work).
4. When prompted, keep the suggested site name (something like
   `pantry-perth`).
5. Wait for the restore to finish, then click **Start site**.
6. Click **Open site** (or **WP Admin**) to confirm it loads.

Note the local URL LocalWP gives you (for example
`http://pantry-perth.local`) — you'll need it when running the rest of
the site. See `../SETUP.md` for the full run-through.

If you kept the suggested site name (`pantry-perth`) the domain will be
`pantry-perth.local`, which is what the rest of the instructions assume.
If yours differs, check LocalWP's **Overview** tab and use your own URL
wherever these docs say `pantry-perth.local`.

## Dashboard login

To get into the WordPress admin (at `/wp-admin`):

- **Username:** `admin`
- **Password:** `pantry-perth-2026`

Local-only credentials for a throwaway practice site — not secret, not
reused anywhere.

## Files in this folder

Only this README is tracked in git. The `.wpress` file and any extracted
WordPress files are deliberately git-ignored (see `.gitignore` in the repo
root) — don't commit the backup.
