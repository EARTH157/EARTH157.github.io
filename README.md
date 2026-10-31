# EARTH157.github.io

Personal portfolio of **Jirapat Chaumaungphan**, Robotics & AI Engineer.

Live site: https://earth157.github.io/

## Repository layout

| Path | What it is |
|---|---|
| `site/` | The site, built with [Astro](https://astro.build/). |
| `.github/workflows/deploy.yml` | Builds `site/` on every pull request, and builds + deploys it to GitHub Pages on every push to `main`. |

The previous plain-HTML site was removed from the repository root; it is still in the git history.

## Deployment

Pages should be set to **Settings → Pages → Build and deployment → Source → GitHub Actions**.
While it is still on "Deploy from a branch", GitHub also runs its own Jekyll build on every push. That build fails (it reads the `---` blocks in `.astro` files as YAML front matter) but deploys nothing, so the live site still comes from the workflow above. Switching the source stops it.

## Working on the new site

Requires Node.js 22.23.4+ (CI uses Node 24).

```bash
cd site
npm ci
npm run dev       # http://localhost:4321
npm run build     # output in site/dist
npx astro check   # type check
```

### Where content lives

- `site/src/data/site.ts`: profile, headline, stats, hero robots, experience, awards, education, toolkit, languages, events
- `site/src/content/work/*.md`: one Markdown file per case study (frontmatter = card + spec sheet, body = write-up). A new file becomes a new card and a page at `/work/<file-name>/`.
- `site/src/assets/`: images, optimised to WebP at build time
- `site/public/models/`: robot models as Draco-compressed `.glb`. Only robots with a model belong in the hero switcher.
- `site/public/docs/`: resume and certificates. Replace `Jirapat_Chaumaungphan_Resume.pdf` with the same filename to update the Download CV button.
