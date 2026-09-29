# CloudGate Storage website

Static site built with Jekyll, hosted on GitHub Pages.

## How the shared header and footer work

- `_includes/header.html` and `_includes/footer.html` hold the header and footer **once**.
- `_layouts/default.html` is the page shell that pulls them in.
- Each page in the root is just front matter plus its own content.

Edit the footer once and every page updates on the next push.

Files and folders beginning with `_` are build inputs. They are never published as URLs.

## Editing

**To change the header or footer:** edit `_includes/header.html` or `_includes/footer.html`.

**To change shared styling:** edit `assets/css/site.css`.

**To change one page's styling:** edit that page's file in `assets/css/`, for example `assets/css/features.css`.

**To add a page:** create `new-page.html` in the root with front matter:

```
---
layout: default
title: "Page title | CloudGate"
description: "Meta description for search results."
canonical: "https://cloudgate-app.com/new-page"
extra_css: "/assets/css/new-page.css"
---
<main id="top">
  ...page content...
</main>
```

`extra_css` is optional. Leave it out if the page needs no extra styling.

## Staging copy (this repository)

This repository is a staging copy of the live site, served at
`https://cloudgate.fixmypcperth.com` (set in the `CNAME` file). While
`staging: true` in `_config.yml`, every page is marked noindex and
`robots.txt` blocks crawlers, so it can't be indexed or compete with
the live `cloudgate-app.com`. Canonical links still point at
`cloudgate-app.com`.

To make this the live site later: set `staging: false`, put
`cloudgate-app.com` back in `CNAME`, and follow "Custom domain" below.

## Deploying

1. Push to the `main` branch.
2. Repository Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. GitHub builds the site automatically. First build takes about a minute.

No local install is required. Jekyll runs on GitHub's servers.

## Custom domain (do this later)

1. Settings > Pages > Custom domain: enter `cloudgate-app.com`.
2. At your DNS provider, add four A records for the apex domain:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. Add a CNAME record: `www` -> `USERNAME.github.io`
4. Wait until **both** the apex and www resolve, then tick "Enforce HTTPS".

Order matters. The certificate only covers domains that resolve correctly at the moment it is issued. Setting up www first and the apex later is what causes an apex domain to show "not secure".

## Outstanding

- The App Store button in `_includes/footer.html` still points to `#`. Replace with the real App Store URL when available.
- The legal pages contain highlighted placeholders that must be completed before publishing. See `legal-info-required.md`.
