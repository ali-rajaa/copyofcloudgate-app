# CloudGate Storage website

Static site built with Jekyll, hosted on GitHub Pages.

## How the site is put together

- `_layouts/default.html` is the page shell: head, skip link, header, page content, footer.
- `_includes/head.html` writes every `<head>` tag. The canonical URL, `og:url`,
  `og:type` and the article dates are generated from the page itself, so they
  never need typing by hand.
- `_includes/schema.html` builds one JSON-LD graph per page: Organization and
  WebSite everywhere, Article on every guide, BreadcrumbList on every page
  but home, FAQPage from the page's `faq` list, and an ItemList of guides on
  Cloud Tips.
- `_includes/faq.html`, `crumb.html`, `store-badges.html` and
  `hero-clouds.html` are the shared components. The FAQ and breadcrumb read
  the same front matter the schema reads, so what people see and what search
  engines read cannot drift apart.
- `_data/links.yml` holds every store, web app, support and social link once.
- `sitemap.xml` and `robots.txt` are generated at build time.
- `assets/js/site.js` holds all shared behaviour (menu, FAQ, reveal, contents
  highlighting, review rail, 404 search). `assets/js/cloud-tips.js` is the hub
  search and filter.

Files and folders beginning with `_` are build inputs. They are never published as URLs.

## Design system

All colours, type sizes, spacing, radii, shadows and motion durations are
tokens at the top of `assets/css/site.css`, with a dark theme that follows the
visitor's system setting. Page stylesheets only lay out their own sections and
use the tokens; there are no inline styles. Buttons use `.btn` plus
`btn-primary` / `btn-secondary` / `btn-ghost` / `btn-dark` and `btn-sm` /
`btn-lg`. Store buttons always come from `_includes/store-badges.html`.

Breakpoints: 479.98px, 767.98px, 1023.98px (menu button below this), 1279.98px.

## Editing

**Header or footer:** `_includes/header.html` or `_includes/footer.html`.
**A link to a store, the web app or a social profile:** `_data/links.yml`.
**Shared styling or a token:** `assets/css/site.css`.
**One page's styling:** its file in `assets/css/`, for example `assets/css/features.css`.

**To add a guide:** create `guides/new-guide.html`. Layout, stylesheet,
Article schema and the Cloud Tips breadcrumb come from `_config.yml`.

```
---
title: "Guide title | CloudGate"
description: "Meta description for search results."
crumb: "Short breadcrumb name"
headline: "The H1 text"
last_modified_at: 2026-10-01
faq:
  - q: "A question people ask?"
    a: "The answer, as plain text."
---
<main id="main">
  ...guide content, with {% include crumb.html %} in the hero
  and {% include faq.html %} where the FAQ should appear...
</main>
```

**To add a page:** same pattern in the root, with `layout: default` and an
optional `extra_css`. Do not add a `canonical`; it is generated.

**When you change a page's content,** update its `last_modified_at`. That one
date drives the "Updated" label on guides, the schema `dateModified` and the
sitemap `lastmod`.

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

## Checks before publishing

Legal placeholders from `legal-info-required.md` have been completed on both
legal pages. The App Store link is live in `_data/links.yml`.
