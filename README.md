# Max-Foreback.github.io

My personal site, built as a small hand-written Jekyll site (no theme, no build step) and hosted on GitHub Pages.

## Structure

- `_config.yml` — site title/description, author info shown around the site, and the `work` collection definition
- `_data/navigation.yml` — nav links
- `_data/collaborators.yml`, `_data/awards.yml`, `_data/publications.yml` — the content behind those pages; edit these instead of touching HTML
- `_pages/` — home, publications, awards, teaching, 404 — written in Markdown with a little inline HTML for images/figures/components. `collaborators.md` also lives here but is currently excluded from the build (see below) — its content is untouched, it's just not being served right now.
- `_work/` — one file per past/side project (e.g. swarm robotics, the eco-evolution continuum); each becomes both a homepage card and its own page at `/work/<slug>/` with a prev/next pager. Front matter: `title`, `order` (sort position), `thumbnail`, `summary` (used on the homepage card); the body is the full write-up. Add a new project by adding a new file here — nothing else needs to change.
- `_layouts/default.html` (shell) and `work.html` (chains to `default`, adds the back-link + prev/next pager) + `_includes/head.html`, `sidebar.html` (nav/socials/theme toggle, persistent on desktop)
- `assets/css/main.css` — all styling, including the light/dark theme variables
- `assets/js/theme.js` — the dark-mode toggle
- `assets/js/stl-viewer.js` + `assets/js/vendor/three/` — the interactive 3D model viewer (see below)
- `assets/models/<name>/` — staged STL frame sequences for the 3D viewer
- `images/` — photos and figures used across the site
- `utils/` — one-off/maintenance scripts, not part of the site build

## Adding a collaborator or student

Add an entry to `_data/collaborators.yml` — it's one shared list for both, nothing else to change:

```yaml
- name: "Full Name"
  picture: "their-photo.jpg"   # goes in images/; square photos crop best
  description: "One line about them."
  link: "https://their-site-or-profile"
```

They show up automatically on the Collaborators page (`/collaborators/`) in the order they're listed in the file.

**That page is currently off** — `_config.yml`'s `exclude:` list has `_pages/collaborators.md` in it, and its nav link is removed from `_data/navigation.yml`. Nothing about the page or its data was deleted, so bringing it back is two small edits: delete that `exclude:` line, and re-add the nav entry:
```yaml
- title: "Collaborators"
  url: /collaborators/
```

## Adding a project image or GIF

Drop the file in `images/` and reference it from a page using the shared `.figure` component:

```html
<figure class="figure">
  <img src="{{ '/images/your-file.gif' | relative_url }}" alt="Describe what's happening">
  <figcaption>A short caption.</figcaption>
</figure>
```

GIFs work exactly like static images here — just point an `<img>` at a `.gif` file and it will autoplay.

## Adding an interactive STL sequence (evolved-design viewer)

For a numbered sequence of STL frames (e.g. one evolved individual per generation) that you want people to be able to rotate/zoom and scrub through, rather than a flat image/GIF:

1. Get the STL files into one folder (or a zip), named so a number appears before `_mesh.stl` (e.g. `12_mesh.stl`) — that number sets frame order.
2. Stage them: `ruby utils/stage_stl_sequence.rb <path-to-zip-or-folder> <name>`. This copies/renumbers them into `assets/models/<name>/frame-0001.stl`, `frame-0002.stl`, ... plus a `manifest.json` the viewer reads.
3. Drop this wherever you want the viewer to appear. Per-viewer opt-in/opt-out attributes, all optional:
   - `data-reverse="true"` — play newest-frame-first, counting down instead of up.
   - `data-wireframe="false"` — skip the triangle-edge overlay (on by default; a plain shape like an antenna doesn't need its facets called out the way a complex evolved structure does).
   - `data-angled="false"` — start the camera dead-on instead of at the default 45° azimuth.
   ```html
   <div class="stl-viewer" data-model="{{ '/assets/models/<name>/' | relative_url }}" data-reverse="true">
     <div class="stl-viewer__canvas-wrap">
       <canvas class="stl-viewer__canvas"></canvas>
       <p class="stl-viewer__status">Loading…</p>
     </div>
     <div class="stl-viewer__controls">
       <button type="button" class="stl-viewer__play" aria-label="Play">&#9654;</button>
       <input type="range" class="stl-viewer__slider" min="1" max="1" value="1" step="1" aria-label="Generation">
       <span class="stl-viewer__label">0%</span>
     </div>
   </div>
   ```
4. On any page that uses it, make sure the import map + module script are present once (see `_pages/about.md` for the exact snippet — it maps the bare `"three"` import to the vendored copy in `assets/js/vendor/three/`).

The viewer (`assets/js/stl-viewer.js`) centers and rescales every frame to the same size, so generations of very different physical size stay visually comparable, renders against a fixed dark viewport background (not the page's light/dark theme colors) so the model reads clearly no matter what color it is or what site theme the visitor has, and auto-plays/loops through the sequence on load — dragging the slider or clicking play/pause takes back control. The progress label shows scrub position as a rounded percentage (0% at the first frame, 100% at the last), independent of `data-reverse`. Multiple viewers can exist on one page; each is independent — see `_pages/about.md`, which runs two side by side (`current-work-row` in `main.css`).

Meshes with inconsistent triangle winding (some STL-writing libraries produce this) render double-sided so they never look hollow/see-through; a uniform "COLOR=..." header some exporters stamp on every file is ignored in favor of a flat gray unless the file's per-vertex colors actually vary.

**Repo size note:** STL frame sequences are not small. That's fine for a personal repo/GitHub Pages at the current scale (~70MB across two datasets), but if this gets used a lot more, worth revisiting — converting to compressed glTF instead of raw STL would shrink this a lot, but needs tooling (Blender or Node + `gltf-pipeline`) that isn't set up here yet.

## Running locally

GitHub Pages builds this with Jekyll automatically on push. To preview locally on Windows, install Ruby via [RubyInstaller](https://rubyinstaller.org/downloads/) (get the **Ruby+Devkit** build, and say yes to the MSYS2/MinGW toolchain step — needed for native gems), then:

```
bundle install
bundle exec jekyll serve -H localhost -P 4000
```

Open `http://localhost:4000`. Notes:
- The `Gemfile` intentionally does **not** use the `github-pages` gem — it pins an old Jekyll that breaks on current Ruby (missing stdlib gems like `csv`/`base64`). We use plain `gem "jekyll"` instead; GitHub's actual Pages build uses its own separate toolchain regardless of what's here, so this only affects local preview.
- `wdm`/`hawkins` (Windows file-watching / browser auto-reload) are commented out in the `Gemfile` for the same reason — Jekyll still rebuilds on save, you just have to refresh the browser tab yourself.
- **Editing `_config.yml` requires restarting the server** — file-watch auto-regeneration does not pick up config changes, only content/asset changes.
