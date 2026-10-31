# EARTH157.github.io

Personal portfolio of **Jirapat Chaumaungphan**, Robotics & AI Engineer.

Live site: https://earth157.github.io/

## Stack

Plain HTML, CSS, and JavaScript served by GitHub Pages. No build step.

- `index.html`: all page content
- `style.css`: theme tokens (light/dark), layout, and the motion layer at the end of the file
- `script.js`: theme toggle, scroll reveal, nav state, mobile menu, and the 3D model viewers
- 3D viewers use three.js r128 from a CDN, loaded only when a viewer is opened

## Assets

| Folder | Contents |
|---|---|
| `assets/images/` | WebP photos sized for display, skill icons (64px), `og-image.jpg` for link previews |
| `assets/models/` | Robot models as Draco-compressed `.glb` |
| `assets/vendor/draco/` | Draco decoder used by the 3D viewers |
| `assets/docs/` | Resume and certificates linked from the page |

## Adding content

- **Photos:** export as WebP around 1000-1200px on the long side, then add `width`, `height`, and `loading="lazy"` to the `<img>`.
- **3D models:** convert STL to GLB with Draco compression (for example with [glTF Transform](https://gltf-transform.dev/)) rather than committing raw STL files.
- **Resume:** replace `assets/docs/Jirapat_Chaumaungphan_Resume.pdf` and keep the same filename so the Download CV button keeps working.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.
