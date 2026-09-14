---
permalink: /
redirect_from:
  - /about/
  - /about.html
---

<div class="intro">
  <img class="intro-avatar" src="{{ '/images/me.jpg' | relative_url }}" alt="{{ site.author.name }}">
  <div class="intro-text">
    <h1 class="intro-name">{{ site.author.name }}</h1>
    <p class="intro-meta">{{ site.author.bio }} &middot; {{ site.author.employer }}<br>{{ site.author.location }}</p>
  </div>
</div>

<p class="lede">I'm a PhD student at Michigan State University, pursuing a dual PhD in Computer Science and Ecology, Evolution, and Behavior, advised by <a href="https://cse.msu.edu/~dolsonem/">Emily Dolson</a>. My main focus these days is <a href="https://www.nebulous-design.org/">Nebulous</a>, where I'm the primary software developer and dev-team lead, evolving real spacecraft and instrument hardware. Evolutionary swarm robotics is where I started, and is now past work, below.</p>

## Current work

<div class="project-card project-card--feature">
  <div class="project-card__media">
    <div class="stl-viewer" data-model="{{ '/assets/models/eclipse-run/' | relative_url }}">
      <div class="stl-viewer__canvas-wrap">
        <canvas class="stl-viewer__canvas"></canvas>
        <p class="stl-viewer__status">Loading…</p>
      </div>
      <div class="stl-viewer__controls">
        <button type="button" class="stl-viewer__play" aria-label="Play">&#9654;</button>
        <input type="range" class="stl-viewer__slider" min="1" max="1" value="1" step="1" aria-label="Generation">
        <span class="stl-viewer__label">Gen 1</span>
      </div>
      <noscript><p class="media-note">Enable JavaScript to view this interactive 3D model.</p></noscript>
    </div>
    <p class="media-note">An evolved design, generation by generation &mdash; drag to rotate, scroll to zoom, or hit play.</p>
  </div>
  <script type="importmap">
  {
    "imports": {
      "three": "{{ '/assets/js/vendor/three/three.module.js' | relative_url }}"
    }
  }
  </script>
  <script type="module" src="{{ '/assets/js/stl-viewer.js' | relative_url }}"></script>
  <div class="project-card__body">
    <h3>Nebulous &amp; ECLIPSE</h3>
    <p>Nebulous is a research collaboration (NASA JPL, Michigan State, Ohio State, CU Boulder, and others) using evolutionary algorithms, AI, and physics-based simulation to design next-generation science hardware &mdash; antennas, spacecraft, and deployable structures that are high-performing, buildable, and mission-relevant. I lead development of <strong>ECLIPSE</strong>, the evolutionary computation framework the whole project runs on, and the small dev team building it.</p>
    <p>Active sub-projects include <strong>SOAR</strong> (spacecraft aerodynamics in very low Earth orbit), <strong>FACET</strong> (antenna geometry optimization), <strong>LEO</strong> (antenna arrays), and <strong>ORIGAMI</strong> (deployable structures).</p>
    <p><a href="https://www.nebulous-design.org/">nebulous-design.org &rarr;</a></p>
  </div>
</div>

## Past work

<div class="project-grid">
{% assign work_items = site.work | sort: 'order' %}
{% for item in work_items %}
  <a class="project-card project-card-link" href="{{ item.url | relative_url }}">
    <div class="project-card__media">
      <img src="{{ item.thumbnail | relative_url }}" alt="{{ item.title }}">
    </div>
    <div class="project-card__body">
      <h3>{{ item.title }}</h3>
      <p>{{ item.summary }}</p>
      <p class="project-card__cta">Read more &rarr;</p>
    </div>
  </a>
{% endfor %}
</div>
