BM Digital Calculator Site - 3 calculators (standalone HTML files)

Files:
- concrete-slab-calculator.html (template + generic table)
- gravel-driveway-calculator.html (new)
- concrete-footing-calculator.html (new)
- about/index.html, contact/index.html, privacy-policy/index.html, terms/index.html
  (required pages: footer links must never point to missing pages)

Each calculator file is complete on its own. Open in a browser to test, or upload
the whole folder to Cloudflare Pages to launch (folders give you /about/ style URLs).

Generic table: table columns and rows come from the page config
(cfg.table in each file). To change a table, edit only the config -
no JavaScript edits needed.

Professional details now in place:
- Site name: BuildCalc
- Author: Bilal Mughal (formulas checked by)
- Contact email: armanzaheer808@gmail.com
Still to do when you buy a domain: replace example.com in canonical URLs
with your real domain (decided: after first money from calls).

AdSense: add your client ID later, after approval. Ad slots stay hidden
until then, so no empty space shows.

Note: Claude's original build.js project was not available here (only the
slab preview file was received), so these calculators were built directly
in the same template style instead of recreating his build system.
