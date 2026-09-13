# Max-Foreback.github.io

My personal site, built as a small hand-written Jekyll site (no theme, no build step) and hosted on GitHub Pages.

## Structure

- `_config.yml` — site title/description and author info shown around the site
- `_data/navigation.yml` — top nav links
- `_data/collaborators.yml`, `_data/awards.yml`, `_data/publications.yml` — the content behind those three pages; edit these instead of touching HTML
- `_pages/` — the actual pages (home, publications, collaborators, awards, 404), written in Markdown with a little inline HTML for images/figures
- `_layouts/default.html` + `_includes/head.html`, `header.html`, `footer.html` — the whole page shell
- `assets/css/main.css` — all styling, including the light/dark theme variables
- `assets/js/theme.js` — the dark-mode toggle
- `images/` — photos and figures used across the site

## Adding a project image or GIF

Drop the file in `images/` and reference it from a page using the shared `.figure` component:

```html
<figure class="figure">
  <img src="{{ '/images/your-file.gif' | relative_url }}" alt="Describe what's happening">
  <figcaption>A short caption.</figcaption>
</figure>
```

GIFs work exactly like static images here — just point an `<img>` at a `.gif` file and it will autoplay.

## Running locally

GitHub Pages builds this with Jekyll automatically on push, but to preview changes before pushing:

```
bundle install
bundle exec jekyll serve -l -H localhost
```

Ruby is required. On Windows, the easiest path is via WSL (`wsl --install`, then run the commands above inside it); Ruby-for-Windows works too but is more prone to native gem build issues.
