# EARTH157.github.io

Personal portfolio of **Jirapat Chaumaungphan**, Robotics & AI Engineer.

Live site: https://earth157.github.io/

## Repository layout

| Path | What it is |
|---|---|
| `site/` | The redesigned site, built with [Astro](https://astro.build/). This is what gets deployed once Pages uses GitHub Actions. |
| `index.html`, `style.css`, `script.js`, `assets/` | The previous plain-HTML site. GitHub Pages still serves it while Pages is set to "Deploy from a branch". |
| `.github/workflows/deploy.yml` | Builds `site/` on every pull request, and builds + deploys it on every push to `main`. |

## Switching the live site to the new version

1. Merge the pull request that adds `site/`.
2. In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Re-run the latest **Build and deploy site** workflow (Actions tab), or push any commit to `main`.

Until step 2, the old site keeps working, and the deploy job fails harmlessly.

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
